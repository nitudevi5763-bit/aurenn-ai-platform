import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KpiCard from '@/components/ui/kpi-card'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'
import { Building2, CheckCircle2, Users } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: clients }, { count: totalLeads }] = await Promise.all([
    supabase.from('clients').select('id, name, status, created_at').order('created_at', { ascending: false }),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
  ])

  const totalClients = clients?.length ?? 0
  const activeClients = clients?.filter((c) => c.status === 'active').length ?? 0

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage client workspaces, assistants, and subscription status."
        action={
          <Link
            href="/admin/clients/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover"
          >
            + Add client
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total clients" value={totalClients} icon={Building2} tone="accent" emphasis="primary" />
        <KpiCard label="Active clients" value={activeClients} icon={CheckCircle2} tone="success" />
        <KpiCard label="Total leads" value={totalLeads ?? 0} icon={Users} tone="accent2" />
      </div>

      {!clients || clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description={'Click "+ Add client" once a deal closes to set up their workspace.'}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-border transition-colors duration-fast hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/clients/${c.id}`} className="text-fg hover:text-accent">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
