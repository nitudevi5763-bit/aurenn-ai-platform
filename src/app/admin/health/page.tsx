import { createClient } from '@/lib/supabase/server'
import KpiCard from '@/components/ui/kpi-card'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'
import { Activity, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react'

const STALE_HOURS = 48

export default async function HealthPage() {
  const supabase = await createClient()

  const [{ data: connections }, { data: recentErrors }] = await Promise.all([
    supabase
      .from('assistant_connections')
      .select('id, status, last_event_at, client_id, clients(name, status)')
      .order('last_event_at', { ascending: false, nullsFirst: false }),
    supabase
      .from('integration_events')
      .select('id, event_type, error_message, created_at, client_id, clients(name)')
      .eq('status', 'error')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const now = Date.now()
  const rows = (connections ?? []).map((c) => {
    const client = c.clients as unknown as { name: string; status: string } | null
    const lastEventMs = c.last_event_at ? new Date(c.last_event_at).getTime() : null
    const hoursSince = lastEventMs ? (now - lastEventMs) / 36e5 : null
    const isStale = client?.status === 'active' && (hoursSince === null || hoursSince > STALE_HOURS)
    return { ...c, clientName: client?.name ?? 'Unknown', clientStatus: client?.status, isStale, hoursSince }
  })

  const totalClients = rows.length
  const connectedCount = rows.filter((r) => r.status === 'connected').length
  const staleCount = rows.filter((r) => r.isStale).length
  const errors24h = (recentErrors ?? []).filter(
    (e) => now - new Date(e.created_at).getTime() < 24 * 36e5
  ).length

  return (
    <>
      <PageHeader title="Health" subtitle="Connection status and recent errors across every client bot." />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total clients" value={totalClients} icon={Building2} tone="accent" emphasis="primary" />
        <KpiCard label="Connected" value={connectedCount} icon={CheckCircle2} tone="success" />
        <KpiCard label="At risk" value={staleCount} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Errors (24h)" value={errors24h} icon={Activity} tone="danger" />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-fg-muted">Connection status</h2>
        {rows.length === 0 ? (
          <EmptyState title="No clients yet" description="Connection health will appear here once clients are added." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface text-fg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Connection</th>
                    <th className="px-4 py-3 font-medium">Last event</th>
                    <th className="px-4 py-3 font-medium">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-border transition-colors duration-fast hover:bg-surface/60">
                      <td className="px-4 py-3 text-fg">{r.clientName}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-fg-muted">
                        {r.last_event_at ? new Date(r.last_event_at).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        {r.clientStatus !== 'active' ? (
                          <span className="text-fg-subtle">—</span>
                        ) : r.isStale ? (
                          <span className="inline-flex items-center gap-1 text-warning">
                            <AlertTriangle size={13} /> At risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-success">
                            <CheckCircle2 size={13} /> Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-fg-muted">Recent errors</h2>
        {!recentErrors || recentErrors.length === 0 ? (
          <EmptyState title="No errors logged" description="Ingestion errors from any client's bot will show up here." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-surface text-fg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Event type</th>
                    <th className="px-4 py-3 font-medium">Error</th>
                    <th className="px-4 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.map((e) => {
                    const client = e.clients as unknown as { name: string } | null
                    return (
                      <tr key={e.id} className="border-t border-border transition-colors duration-fast hover:bg-surface/60">
                        <td className="px-4 py-3 text-fg">{client?.name ?? 'Unknown'}</td>
                        <td className="px-4 py-3 text-fg-muted">{e.event_type}</td>
                        <td className="max-w-[280px] px-4 py-3 break-words text-danger">{e.error_message ?? '—'}</td>
                        <td className="px-4 py-3 text-fg-muted">{new Date(e.created_at).toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
