import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, clients(name)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/admin')

  const clientRecord = profile.clients as unknown as { name: string } | null
  const clientName = clientRecord?.name ?? 'Your dashboard'

  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{clientName}</h1>
        <SignOutButton />
      </div>

      {!leads || leads.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No leads have been captured yet. They&apos;ll show up here once your assistant is
          connected and starts talking to visitors.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{l.name ?? '—'}</td>
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
