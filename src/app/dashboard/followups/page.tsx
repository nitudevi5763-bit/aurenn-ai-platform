import { createClient } from '@/lib/supabase/server'

export default async function FollowupsPage() {
  const supabase = await createClient()

  const { data: followups } = await supabase
    .from('followups')
    .select('id, status, due_date, notes, created_at')
    .order('due_date', { ascending: true })

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Follow-ups</h1>

      {!followups || followups.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No follow-ups due right now.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((f) => (
                <tr key={f.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{f.due_date ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{f.status}</td>
                  <td className="px-4 py-3">{f.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
