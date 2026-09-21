import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/status-badge'

export default async function LeadDetailContent({ id }: { id: string }) {
  const supabase = await createClient()

  const [{ data: lead }, { data: conversation }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase.from('conversations').select('id, ai_summary, started_at').eq('lead_id', id).maybeSingle(),
  ])

  if (!lead) redirect('/dashboard/leads')

  return (
    <div>
      <h1 className="mb-6 pr-8 text-2xl font-semibold text-fg">{lead.name ?? 'Unnamed lead'}</h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <InfoCard label="Status">
          <StatusBadge status={lead.status} />
        </InfoCard>
        <InfoCard label="Priority">
          {lead.priority ? <StatusBadge status={lead.priority} /> : <span className="text-fg-subtle">—</span>}
        </InfoCard>
        <InfoCard label="AI score">
          <span className="text-lg font-semibold text-fg">{lead.ai_score ?? '—'}</span>
        </InfoCard>
      </div>

      <section className="mb-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-fg-muted">Contact information</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Email" value={lead.email} />
          <Detail label="Phone" value={lead.phone} />
          <Detail label="Service" value={lead.service} />
          <Detail label="Source" value={lead.source} />
        </dl>
      </section>

      <section className="mb-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-fg-muted">Original enquiry</h2>
        <p className="text-sm text-fg">{lead.original_enquiry || 'Not recorded.'}</p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-fg-muted">AI summary</h2>
        <p className="text-sm text-fg">{lead.ai_summary || conversation?.ai_summary || 'Not generated yet.'}</p>
      </section>
    </div>
  )
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-1.5 text-xs font-medium tracking-wide text-fg-subtle uppercase">{label}</p>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-fg-subtle">{label}</p>
      <p className="text-fg">{value || '—'}</p>
    </div>
  )
}
