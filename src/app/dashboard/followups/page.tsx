import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'

type FollowupRow = {
  id: string
  status: string
  due_date: string | null
  notes: string | null
  leads: { name: string } | null
}

const TONE: Record<string, string> = {
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-fg-subtle/10 text-fg-muted',
  success: 'bg-success/10 text-success',
}

export default async function FollowupsPage() {
  const supabase = await createClient()

  const { data: followups } = await supabase
    .from('followups')
    .select('id, status, due_date, notes, leads(name)')
    .order('due_date', { ascending: true })

  const rows = (followups ?? []) as unknown as FollowupRow[]
  const today = new Date().toISOString().slice(0, 10)

  const dueToday = rows.filter((f) => f.status === 'pending' && f.due_date && f.due_date <= today)
  const upcoming = rows.filter((f) => f.status === 'pending' && (!f.due_date || f.due_date > today))
  const completed = rows.filter((f) => f.status === 'done')

  return (
    <>
      <PageHeader title="Follow-ups" subtitle="Leads that need another touch." />

      {rows.length === 0 ? (
        <EmptyState
          title="No follow-ups yet"
          description="Leads that need a follow-up will show up here, grouped by when they're due."
        />
      ) : (
        <div className="space-y-8">
          <FollowupGroup title="Due Today" items={dueToday} tone="danger" emptyText="Nothing due today." />
          <FollowupGroup title="Upcoming" items={upcoming} tone="neutral" emptyText="Nothing upcoming." />
          <FollowupGroup title="Completed" items={completed} tone="success" emptyText="Nothing completed yet." />
        </div>
      )}
    </>
  )
}

function FollowupGroup({
  title,
  items,
  tone,
  emptyText,
}: {
  title: string
  items: FollowupRow[]
  tone: 'danger' | 'neutral' | 'success'
  emptyText: string
}) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-fg-muted">
        {title}
        <span className={`rounded-full px-2 py-0.5 text-xs ${TONE[tone]}`}>{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-6 text-center text-sm text-fg-subtle">
          {emptyText}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr
                  key={f.id}
                  className="border-t border-border transition-colors duration-fast hover:bg-surface/60"
                >
                  <td className="px-4 py-3 text-fg">{f.leads?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-fg-muted">{f.due_date ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{f.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
