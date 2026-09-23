'use client'

import { useActionState } from 'react'
import { updateBusinessDetailsAction } from '@/app/dashboard/actions'
import SubmitButton from '@/components/submit-button'

type ClientInfo = {
  name: string
  website: string | null
  contact_email: string | null
  notification_email: string | null
  booking_url: string | null
}

export default function BusinessSettingsForm({ client }: { client: ClientInfo }) {
  const [state, formAction] = useActionState(updateBusinessDetailsAction, { error: null, success: false })

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Business name" name="name" defaultValue={client.name} required />
        <Field label="Website" name="website" defaultValue={client.website ?? ''} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Contact email" name="contact_email" type="email" defaultValue={client.contact_email ?? ''} />
        <Field
          label="Notification email"
          name="notification_email"
          type="email"
          defaultValue={client.notification_email ?? ''}
        />
      </div>
      <Field
        label="Booking URL"
        name="booking_url"
        defaultValue={client.booking_url ?? ''}
        placeholder="https://calendly.com/…"
      />

      {state.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      {state.success && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Saved.</p>}

      <SubmitButton
        pendingLabel="Saving…"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
      >
        Save changes
      </SubmitButton>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  required?: boolean
  placeholder?: string
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
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
      />
    </div>
  )
}
