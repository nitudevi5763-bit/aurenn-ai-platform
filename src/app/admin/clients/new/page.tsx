import Link from 'next/link'
import { createClientAction } from '@/app/admin/actions'
import SubmitButton from '@/components/submit-button'
import PageHeader from '@/components/ui/page-header'

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="mb-6 inline-block text-sm text-fg-subtle transition-colors duration-fast hover:text-fg"
      >
        &larr; Back to clients
      </Link>

      <PageHeader title="Add a new client" subtitle="Set up their workspace, login, and billing." />

      <form
        action={createClientAction}
        className="space-y-6 rounded-xl border border-border bg-surface p-8"
      >
        <div>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Business details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business name" name="name" required />
            <Field label="Website" name="website" />
            <Field label="Industry" name="industry" placeholder="e.g. Law Firm" />
            <Field label="Country" name="country" />
            <Field label="Contact email" name="contact_email" type="email" />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Client login credentials</h2>
          <p className="mb-3 text-xs text-fg-subtle">
            This is the email and password the client will use to log into their own dashboard. Share
            it with them yourself after creating it — it won&apos;t be shown again here.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Login email" name="login_email" type="email" required />
            <Field label="Login password" name="login_password" type="text" required />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Assistant connection</h2>
          <p className="mb-3 text-xs text-fg-subtle">
            Leave this blank if the assistant isn&apos;t built yet — you can add it later from the
            client&apos;s detail page.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Assistant name" name="assistant_name" placeholder="e.g. Smith Law Receptionist" />
            <Field label="Assistant URL" name="assistant_url" placeholder="https://client-bot-name.vercel.app" />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">Billing</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Setup fee (USD)" name="setup_fee" type="number" defaultValue="999" />
            <Field label="Monthly fee (USD)" name="monthly_fee" type="number" defaultValue="79" />
          </div>
          <p className="mt-2 text-xs text-fg-subtle">
            The setup fee is never shown on the client&apos;s billing page — only the monthly fee is.
          </p>
        </div>

        <SubmitButton
          pendingLabel="Creating client…"
          className="w-full rounded-lg bg-accent px-4 py-2 font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
        >
          Create client
        </SubmitButton>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-fg-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
      />
    </div>
  )
}
