import Link from 'next/link'
import { createClientAction } from '@/app/admin/actions'

export default function NewClientPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin" className="mb-6 inline-block text-sm text-slate-400 hover:text-white">
          &larr; Back to clients
        </Link>

        <h1 className="mb-6 text-2xl font-semibold">Add a new client</h1>

        <form
          action={createClientAction}
          className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8"
        >
          <div>
            <h2 className="mb-3 text-sm font-medium text-slate-400">Business details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Business name" name="name" required />
              <Field label="Website" name="website" />
              <Field label="Industry" name="industry" placeholder="e.g. Law Firm" />
              <Field label="Country" name="country" />
              <Field label="Contact email" name="contact_email" type="email" />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium text-slate-400">Client login credentials</h2>
            <p className="mb-3 text-xs text-slate-500">
              This is the email and password the client will use to log into their own dashboard.
              Share it with them yourself after creating it — it won&apos;t be shown again here.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Login email" name="login_email" type="email" required />
              <Field label="Login password" name="login_password" type="text" required />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium text-slate-400">Billing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Setup fee (USD)" name="setup_fee" type="number" defaultValue="999" />
              <Field label="Monthly fee (USD)" name="monthly_fee" type="number" defaultValue="79" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              The setup fee is never shown on the client&apos;s billing page — only the monthly fee is.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 font-medium text-white transition hover:opacity-90"
          >
            Create client
          </button>
        </form>
      </div>
    </main>
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
      <label className="mb-1 block text-sm text-slate-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-red-500"
      />
    </div>
  )
}
