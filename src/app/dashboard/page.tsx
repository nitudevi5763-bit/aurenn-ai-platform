import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KpiCard from '@/components/ui/kpi-card'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'
import { Users, Sparkles, AlertTriangle, CalendarClock, Clock } from 'lucide-react'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()

  const [
    { count: totalLeads },
    { count: newLeads },
    { count: highPriority },
    { count: appointments },
    { count: followupsDue },
    { data: recentLeads },
    { data: priorityLeads },
  ] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'NEW'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('priority', 'high'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase.from('followups').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('leads')
      .select('id, name, service, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('leads')
      .select('id, name, service, ai_score')
      .eq('priority', 'high')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const brief =
    totalLeads && totalLeads > 0
      ? `${newLeads ?? 0} new ${newLeads === 1 ? 'enquiry' : 'enquiries'} so far. ${
          highPriority ?? 0
        } marked high priority. ${followupsDue ?? 0} follow-up${followupsDue === 1 ? '' : 's'} due.`
      : "No activity yet. Once your assistant is connected, a plain-English daily summary of your enquiries will appear here."

  return (
    <>
      <PageHeader title="Overview" subtitle="What's happening with your enquiries." />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Total leads" value={totalLeads ?? 0} icon={Users} tone="accent" emphasis="primary" />
        <KpiCard label="New leads" value={newLeads ?? 0} icon={Sparkles} tone="accent2" />
        <KpiCard label="High priority" value={highPriority ?? 0} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Appointments" value={appointments ?? 0} icon={CalendarClock} tone="success" />
        <KpiCard label="Follow-ups due" value={followupsDue ?? 0} icon={Clock} tone="neutral" />
      </div>

      <div className="mb-8 rounded-xl border border-border-strong bg-surface-2 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles size={15} strokeWidth={2} />
          </span>
          <div>
            <p className="mb-0.5 text-xs font-medium tracking-wide text-fg-subtle uppercase">AI Daily Brief</p>
            <p className="text-sm text-fg">{brief}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Recent Leads</h2>
          {!recentLeads || recentLeads.length === 0 ? (
            <EmptyState
              title="No leads yet"
              description="Your AI assistant hasn't captured any leads yet. New enquiries will appear here automatically."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-fg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((l) => (
                    <tr
                      key={l.id}
                      className="border-t border-border transition-colors duration-fast hover:bg-surface/60"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/leads/${l.id}`} className="text-fg hover:text-accent">
                          {l.name ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-fg-muted">{l.service ?? '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-4 py-3 text-fg-muted">
                        {new Date(l.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Priority Leads</h2>
          {!priorityLeads || priorityLeads.length === 0 ? (
            <EmptyState title="Nothing urgent" description="High-priority leads will show up here as they come in." />
          ) : (
            <div className="space-y-2">
              {priorityLeads.map((l) => (
                <Link
                  key={l.id}
                  href={`/dashboard/leads/${l.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-colors duration-fast hover:bg-surface-2"
                >
                  <div>
                    <p className="text-sm text-fg">{l.name ?? 'Unnamed lead'}</p>
                    <p className="text-xs text-fg-subtle">{l.service ?? '—'}</p>
                  </div>
                  {l.ai_score != null && (
                    <span className="text-sm font-semibold text-warning">{l.ai_score}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
