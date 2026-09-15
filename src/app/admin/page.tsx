import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/sign-out-button'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })

  const { count: totalLeads } = await supabase.from('leads').select('id', { count: 'exact', head: true })

  const totalClients = clients?.length ?? 0
  const activeClients = clients?.filter((c) => c.status === 'active').length ?? 0

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients/new"
            className="rounded-lg bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add client
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Total clients" value={String(totalClients)} />
        <StatCard label="Active clients" value={String(activeClients)} />
        <StatCard label="Total leads" value={String(totalLeads ?? 0)} />
      </div>

      {!clients || clients.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No clients yet. Click &quot;+ Add client&quot; once a deal closes.
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
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/clients/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{c.status}</td>
                  <td className="px-4 py-3">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}
