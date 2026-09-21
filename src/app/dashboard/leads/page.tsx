import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'
import LeadsToolbar from '@/components/leads-toolbar'

const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  created_desc: { column: 'created_at', ascending: false },
  created_asc: { column: 'created_at', ascending: true },
  score_desc: { column: 'ai_score', ascending: false },
  name_asc: { column: 'name', ascending: true },
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; priority?: string; sort?: string }>
}) {
  const { search = '', status = 'all', priority = 'all', sort = 'created_desc' } = await searchParams
  const supabase = await createClient()
  const { column, ascending } = SORT_MAP[sort] ?? SORT_MAP.created_desc

  const [{ data: allLeads }, { data: leads }] = await Promise.all([
    supabase.from('leads').select('id'),
    (() => {
      let query = supabase
        .from('leads')
        .select('id, name, service, status, priority, created_at')
        .order(column, { ascending })

      if (search) query = query.ilike('name', `%${search}%`)
      if (status !== 'all') query = query.eq('status', status)
      if (priority !== 'all') query = query.eq('priority', priority)

      return query
    })(),
  ])

  const hasAnyLeads = (allLeads?.length ?? 0) > 0
  const hasFilteredResults = leads && leads.length > 0

  return (
    <>
      <PageHeader title="Leads" subtitle="Every enquiry your assistant has captured." />

      {!hasAnyLeads ? (
        <EmptyState
          title="No leads yet"
          description="Your AI assistant hasn't captured any leads yet. New enquiries will appear here automatically."
        />
      ) : (
        <>
          <Suspense fallback={<div className="mb-4 h-10 rounded-lg bg-surface" />}>
            <LeadsToolbar />
          </Suspense>

          {!hasFilteredResults ? (
            <EmptyState title="No leads match" description="Try a different search term or clear the filters." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-fg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
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
                        {l.priority ? <StatusBadge status={l.priority} /> : <span className="text-fg-subtle">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-4 py-3 text-fg-muted">{new Date(l.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}
