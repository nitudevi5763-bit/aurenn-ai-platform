'use client'

import { useActionState } from 'react'
import { testConnectionAction } from '@/app/admin/actions'
import SubmitButton from '@/components/submit-button'

export default function TestConnectionButton({
  connectionId,
  clientId,
}: {
  connectionId: string
  clientId: string
}) {
  const [state, formAction] = useActionState(
    testConnectionAction.bind(null, connectionId, clientId),
    null as { success: boolean; message: string } | null
  )

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton
        pendingLabel="Testing…"
        className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg disabled:opacity-50"
      >
        Test connection
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
