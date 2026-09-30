import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

type LeadInput = {
  name?: string
  email?: string
  phone?: string
  service?: string
  source?: string
  original_enquiry?: string
  priority?: 'high' | 'medium' | 'low'
}

type Body = {
  type: 'lead' | 'conversation' | 'appointment' | 'ping'
  lead?: LeadInput
  conversation?: { transcript: unknown[]; ai_summary?: string; started_at?: string }
  appointment?: { appointment_time: string; source?: string; status?: string }
}

function errMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err) {
    const details = 'details' in err ? ` (${(err as { details?: string }).details})` : ''
    return String((err as { message: string }).message) + details
  }
  return 'Unknown error'
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()

  const authHeader = req.headers.get('authorization') ?? ''
  const secret = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (!secret) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401, headers: CORS_HEADERS })
  }

  const { data: connection } = await supabase
    .from('assistant_connections')
    .select('id, client_id')
    .eq('ingest_secret', secret)
    .maybeSingle()

  if (!connection) {
    return NextResponse.json({ error: 'Invalid ingest secret' }, { status: 401, headers: CORS_HEADERS })
  }

  const clientId = connection.client_id

  let body: Body
  try {
    body = await req.json()
  } catch {
    // A bare ping may be sent with no body at all — treat that as a ping too.
    body = { type: 'ping' }
  }

  if (!body.type || !['lead', 'conversation', 'appointment', 'ping'].includes(body.type)) {
    await logEvent(supabase, clientId, body.type ?? 'unknown', body, 'error', 'Missing or invalid "type"')
    return NextResponse.json(
      { error: 'type must be one of: lead, conversation, appointment, ping' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  // "ping" just proves the secret works and marks the bot as connected —
  // it never touches leads/conversations/appointments, so testing a
  // connection never pollutes a client's real dashboard data.
  if (body.type === 'ping') {
    await supabase
      .from('assistant_connections')
      .update({ status: 'connected', last_event_at: new Date().toISOString() })
      .eq('id', connection.id)

    await logEvent(supabase, clientId, 'ping', body, 'success', null)

    return NextResponse.json({ success: true, message: 'pong' }, { status: 200, headers: CORS_HEADERS })
  }

  try {
    let result: Record<string, unknown>

    if (body.type === 'lead') {
      const leadId = await upsertLead(supabase, clientId, body.lead)
      result = { lead_id: leadId }
    } else if (body.type === 'conversation') {
      if (!Array.isArray(body.conversation?.transcript)) {
        throw new Error('conversation.transcript must be an array')
      }
      const leadId = await upsertLead(supabase, clientId, body.lead)
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          client_id: clientId,
          lead_id: leadId,
          transcript: body.conversation!.transcript,
          ai_summary: body.conversation!.ai_summary ?? null,
          started_at: body.conversation!.started_at ?? new Date().toISOString(),
        })
        .select('id')
        .single()
      if (error) throw error
      result = { lead_id: leadId, conversation_id: data.id }
    } else {
      if (!body.appointment?.appointment_time) {
        throw new Error('appointment.appointment_time is required')
      }
      const leadId = await upsertLead(supabase, clientId, body.lead)
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId,
          lead_id: leadId,
          appointment_time: body.appointment.appointment_time,
          source: body.appointment.source ?? null,
          status: body.appointment.status ?? 'requested',
        })
        .select('id')
        .single()
      if (error) throw error
      result = { lead_id: leadId, appointment_id: data.id }
    }

    await supabase
      .from('assistant_connections')
      .update({ status: 'connected', last_event_at: new Date().toISOString() })
      .eq('id', connection.id)

    await logEvent(supabase, clientId, body.type, body, 'success', null)

    return NextResponse.json({ success: true, ...result }, { status: 200, headers: CORS_HEADERS })
  } catch (err) {
    const message = errMessage(err)
    await logEvent(supabase, clientId, body.type, body, 'error', message)
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS })
  }
}

async function upsertLead(
  supabase: ReturnType<typeof createAdminClient>,
  clientId: string,
  lead?: LeadInput
): Promise<string> {
  if (lead?.email || lead?.phone) {
    let query = supabase.from('leads').select('id').eq('client_id', clientId)
    if (lead.email) query = query.eq('email', lead.email)
    else if (lead.phone) query = query.eq('phone', lead.phone)

    const { data: existing } = await query.maybeSingle()
    if (existing) {
      await supabase
        .from('leads')
        .update({
          name: lead.name ?? undefined,
          service: lead.service ?? undefined,
          source: lead.source ?? undefined,
          original_enquiry: lead.original_enquiry ?? undefined,
          priority: lead.priority ?? undefined,
        })
        .eq('id', existing.id)
      return existing.id
    }
  }

  const { data: created, error } = await supabase
    .from('leads')
    .insert({
      client_id: clientId,
      name: lead?.name ?? 'Unknown visitor',
      email: lead?.email ?? null,
      phone: lead?.phone ?? null,
      service: lead?.service ?? null,
      source: lead?.source ?? null,
      original_enquiry: lead?.original_enquiry ?? null,
      priority: lead?.priority ?? 'medium',
      status: 'NEW',
    })
    .select('id')
    .single()

  if (error) throw error
  return created.id
}

async function logEvent(
  supabase: ReturnType<typeof createAdminClient>,
  clientId: string,
  eventType: string,
  payload: unknown,
  status: 'success' | 'error',
  errorMessage: string | null
) {
  await supabase.from('integration_events').insert({
    client_id: clientId,
    event_type: eventType,
    payload,
    status,
    error_message: errorMessage,
  })
}
