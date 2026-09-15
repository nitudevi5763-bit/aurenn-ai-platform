import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single()
  if (!lead) redirect('/dashboard/leads')

  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, ai_summary, started_at')
    .eq('lead_id', id)
    .maybeSingle()

  return (
    <main className="pt-4">
      <Link href="/dashboard/leads" className="mb-6 inline-block text-sm text-slate-400 hover:text-white">
        &larr; Back to leads
      </Link>

      <h1 className="mb-6 text-2xl font-semibold">{lead.name ?? 'Unnamed lead'}</h1>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <InfoCard label="Status" value={lead.status} />
        <InfoCard label="Priority" value={lead.priority ?? '—'} />
        <InfoCard label="AI score" value={lead.ai_score != null ? String(lead.ai_score) : '—'} />
      </div>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-400">Contact information</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Email" value={lead.email} />
          <Detail label="Phone" value={lead.phone} />
          <Detail label="Service" value={lead.service} />
          <Detail label="Source" value={lead.source} />
        </dl>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-400">Original enquiry</h2>
        <p className="text-slate-300">{lead.original_enquiry || 'Not recorded.'}</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-400">AI summary</h2>
        <p className="text-slate-300">{lead.ai_summary || conversation?.ai_summary || 'Not generated yet.'}</p>
      </section>
    </main>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold capitalize">{value}</p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="text-slate-200">{value || '—'}</p>
    </div>
  )
}
