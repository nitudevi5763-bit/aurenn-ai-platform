import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KpiCard from '@/components/ui/kpi-card'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'
import ClientsToolbar from '@/components/clients-toolbar'
import { Building2, CheckCircle2, Users } from 'lucide-react'

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  created_desc: { column: 'created_at', ascending: false },
  created_asc: { column: 'created_at', ascending: true },
  name_asc: { column: 'name', ascending: true },
  name_desc: { column: 'name', ascending: false },
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; sort?: string }>
}) {
  const { search = '', status = 'all', sort = 'created_desc' } = await searchParams
  const supabase = await createClient()
  const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.created_desc

  let filteredQuery = supabase
    .from('clients')
    .select('id, name, industry, status, monthly_fee, created_at, assistant_connections(status)')
    .order(column, { ascending })

  if (search) filteredQuery = filteredQuery.ilike('name', `%${search}%`)
  if (status !== 'all') filteredQuery = filteredQuery.eq('status', status)

  const [{ data: allClients }, { count: totalLeads }, { data: clients }] = await Promise.all([
    supabase.from('clients').select('id, status'),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    filteredQuery,
  ])

  const totalClients = allClients?.length ?? 0
  const activeClients = allClients?.filter((c) => c.status === 'active').length ?? 0
  const hasAnyClients = totalClients > 0
  const hasFilteredResults = clients && clients.length > 0

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

      {!hasAnyClients ? (
        <EmptyState
          title="No clients yet"
          description={'Click "+ Add client" once a deal closes to set up their workspace.'}
        />
      ) : (
        <>
          <Suspense fallback={<div className="mb-4 h-10 rounded-lg bg-surface" />}>
            <ClientsToolbar />
          </Suspense>

          {!hasFilteredResults ? (
            <EmptyState
              title="No clients match"
              description="Try a different search term or clear the status filter."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-fg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Assistant</th>
                    <th className="px-4 py-3 font-medium">Monthly fee</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {clients!.map((c) => {
                    const connections = c.assistant_connections as unknown as { status: string }[] | null
                    const assistantStatus = connections?.[0]?.status ?? 'pending'
                    return (
                      <tr
                        key={c.id}
                        className="border-t border-border transition-colors duration-fast hover:bg-surface/60"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/admin/clients/${c.id}`} className="text-fg hover:text-accent">
                            {c.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-fg-muted">{c.industry || '—'}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={assistantStatus} />
                        </td>
                        <td className="px-4 py-3 text-fg-muted">${c.monthly_fee}</td>
                        <td className="px-4 py-3 text-fg-muted">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}
