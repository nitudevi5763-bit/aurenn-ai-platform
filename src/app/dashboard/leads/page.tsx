import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, service, status, priority, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Leads</h1>

      {!leads || leads.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No leads have been captured yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/leads/${l.id}`} className="hover:underline">
                      {l.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{l.service ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{l.priority ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{l.status}</td>
                  <td className="px-4 py-3">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
