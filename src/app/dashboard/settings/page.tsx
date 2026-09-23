import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/ui/page-header'
import StatusBadge from '@/components/ui/status-badge'
import BusinessSettingsForm from '@/components/settings/business-form'
import PasswordSettingsForm from '@/components/settings/password-form'

const SECTIONS = [
  { id: 'business', label: 'Business' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'security', label: 'Security' },
]

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('client_id').eq('id', user!.id).single()

  const [{ data: client }, { data: connection }] = await Promise.all([
    supabase
      .from('clients')
      .select('name, website, contact_email, notification_email, booking_url')
      .eq('id', profile!.client_id)
      .single(),
    supabase
      .from('assistant_connections')
      .select('assistant_name, assistant_url, status')
      .eq('client_id', profile!.client_id)
      .maybeSingle(),
  ])

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your business details, assistant, and account security." />

      <div className="flex flex-col gap-8 md:flex-row">
        <nav className="flex gap-1 overflow-x-auto md:w-48 md:flex-col md:gap-0.5">
          {SECTIONS.map((s) => (
            
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="max-w-xl flex-1 space-y-10">
          <section id="business">
            <h2 className="mb-3 text-lg font-semibold text-fg">Business</h2>
            {client && <BusinessSettingsForm client={client} />}
          </section>

          <section id="assistant">
            <h2 className="mb-3 text-lg font-semibold text-fg">Assistant</h2>
            <div className="space-y-3 rounded-xl border border-border bg-surface p-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">Name</span>
                <span className="text-fg">{connection?.assistant_name || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fg-subtle">Status</span>
                {connection ? <StatusBadge status={connection.status} /> : <span className="text-fg-subtle">—</span>}
              </div>
              <p className="text-xs text-fg-subtle">
                To change your assistant&apos;s connection details, contact Aurenn AI support.
              </p>
            </div>
          </section>

          <section id="security">
            <h2 className="mb-3 text-lg font-semibold text-fg">Security</h2>
            <PasswordSettingsForm />
          </section>
        </div>
      </div>
    </>
  )
}
