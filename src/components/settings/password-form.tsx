'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from '@/app/dashboard/actions'
import SubmitButton from '@/components/submit-button'

export default function PasswordSettingsForm() {
  const [state, formAction] = useActionState(updatePasswordAction, { error: null, success: false })

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-fg-muted" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-fg-muted" htmlFor="confirm_password">
            Confirm password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
          />
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      {state.success && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Password updated.</p>
      )}

      <SubmitButton
        pendingLabel="Updating…"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
      >
        Update password
      </SubmitButton>
    </form>
  )
}
