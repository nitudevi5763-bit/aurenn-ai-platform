'use client'

import { useActionState } from 'react'
import { recordManualPaymentAction } from '@/app/admin/actions'
import SubmitButton from '@/components/submit-button'

export default function RecordPaymentButton({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(
    recordManualPaymentAction.bind(null, clientId),
    null as { success: boolean; message: string } | null
  )

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton
        pendingLabel="Recording…"
        className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
      >
        Record manual payment (+30 days)
      </SubmitButton>
      {state && (
        <p role="status" className={`text-sm ${state.success ? 'text-success' : 'text-danger'}`}>
          {state.success ? '✓ ' : '✗ '}
          {state.message}
        </p>
      )}
    </form>
  )
}
