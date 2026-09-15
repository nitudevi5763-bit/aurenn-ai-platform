import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { regenerateSecretAction, updateClientStatusAction } from '@/app/admin/actions'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) redirect('/admin')

  const { data: connection } = await supabase
    .from('assistant_connections')
    .select('*')
    .eq('client_id', id)
    .maybeSingle()

  const { count: totalLeads } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', id)

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="mb-6 inline-block text-sm text-slate-400 hover:text-white">
          &larr; Back to clients
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <form
            action={updateClientStatusAction.bind(
              null,
              client.id,
              client.status === 'active' ? 'inactive' : 'active'
            )}
          >
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              {client.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </form>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard label="Status" value={client.status} />
          <StatCard label="Total leads" value={String(totalLeads ?? 0)} />
          <StatCard label="Monthly fee" value={`$${client.monthly_fee}`} />
        </div>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-4 text-sm font-medium text-slate-400">Business details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Detail label="Website" value={client.website} />
            <Detail label="Industry" value={client.industry} />
            <Detail label="Country" value={client.country} />
            <Detail label="Contact email" value={client.contact_email} />
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-4 text-sm font-medium text-slate-400">Assistant connection</h2>
          {!connection ? (
            <p className="text-slate-500">No connection record found.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <Detail label="Status" value={connection.status} />
              <Detail
                label="Last event"
                value={connection.last_event_at ? new Date(connection.last_event_at).toLocaleString() : 'Never'}
              />
              <div>
                <p className="mb-1 text-slate-400">Ingest secret</p>
                <code className="block break-all rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">
                  {connection.ingest_secret}
                </code>
                <p className="mt-1 text-xs text-slate-500">
                  Put this in the client bot&apos;s environment variables as AURENN_WEBHOOK_SECRET —
                  never in browser-facing code.
                </p>
              </div>
              <form action={regenerateSecretAction.bind(null, connection.id, client.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Regenerate secret
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold capitalize">{value}</p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="text-slate-200">{value || '—'}</p>
    </div>
  )
}
