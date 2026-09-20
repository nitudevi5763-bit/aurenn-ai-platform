import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'
import {
  regenerateSecretAction,
  updateAssistantConnectionAction,
  updateClientStatusAction,
} from '@/app/admin/actions'
import SubmitButton from '@/components/submit-button'
import KpiCard from '@/components/ui/kpi-card'
import StatusBadge from '@/components/ui/status-badge'
import PageHeader from '@/components/ui/page-header'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: client }, { data: connection }, { count: totalLeads }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('assistant_connections').select('*').eq('client_id', id).maybeSingle(),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('client_id', id),
  ])

  if (!client) redirect('/admin')

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="mb-6 inline-block text-sm text-fg-subtle transition-colors duration-fast hover:text-fg"
      >
        &larr; Back to clients
      </Link>

      <PageHeader
        title={client.name}
        action={
          <form
            action={updateClientStatusAction.bind(
              null,
              client.id,
              client.status === 'active' ? 'inactive' : 'active'
            )}
          >
            <SubmitButton
              pendingLabel="Working…"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg disabled:opacity-50"
            >
              {client.status === 'active' ? 'Deactivate' : 'Activate'}
            </SubmitButton>
          </form>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">Status</p>
          <div className="mt-2">
            <StatusBadge status={client.status} />
          </div>
        </div>
        <KpiCard label="Total leads" value={totalLeads ?? 0} emphasis="primary" />
        <KpiCard label="Monthly fee" value={`$${client.monthly_fee}`} />
      </div>

      <section className="mb-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Business details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Website" value={client.website} />
          <Detail label="Industry" value={client.industry} />
          <Detail label="Country" value={client.country} />
          <Detail label="Contact email" value={client.contact_email} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Assistant connection</h2>
        {!connection ? (
          <p className="text-fg-subtle">No connection record found.</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-fg-subtle">Status</span>
              <StatusBadge status={connection.status} />
            </div>
            <Detail label="Current URL" value={connection.assistant_url} />
            <Detail
              label="Last event"
              value={connection.last_event_at ? new Date(connection.last_event_at).toLocaleString() : 'Never'}
            />

            <form
              action={updateAssistantConnectionAction.bind(null, connection.id, client.id)}
              className="space-y-3 border-t border-border pt-4"
            >
              <div>
                <label className="mb-1 block text-xs text-fg-subtle" htmlFor="assistant_name">
                  Assistant name
                </label>
                <input
                  id="assistant_name"
                  name="assistant_name"
                  defaultValue={connection.assistant_name ?? ''}
                  placeholder="e.g. Smith Law Receptionist"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition-colors duration-fast focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-fg-subtle" htmlFor="assistant_url">
                  Assistant URL
                </label>
                <input
                  id="assistant_url"
                  name="assistant_url"
                  defaultValue={connection.assistant_url ?? ''}
                  placeholder="https://client-bot-name.vercel.app"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition-colors duration-fast focus:border-accent"
                />
              </div>
              <SubmitButton
                pendingLabel="Saving…"
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg disabled:opacity-50"
              >
                Save assistant details
              </SubmitButton>
            </form>

            <div className="border-t border-border pt-4">
              <p className="mb-1 text-fg-subtle">Ingest secret</p>
              <code className="block break-all rounded-lg bg-surface-2 px-3 py-2 text-xs text-fg-muted">
                {connection.ingest_secret}
              </code>
              <p className="mt-1 text-xs text-fg-subtle">
                Put this in the client bot&apos;s environment variables as AURENN_WEBHOOK_SECRET — never
                in browser-facing code.
              </p>
              <form action={regenerateSecretAction.bind(null, connection.id, client.id)} className="mt-3">
                <SubmitButton
                  pendingLabel="Regenerating…"
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg disabled:opacity-50"
                >
                  Regenerate secret
                </SubmitButton>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-fg-subtle">{label}</p>
      <p className="text-fg">{value || '—'}</p>
    </div>
  )
}
