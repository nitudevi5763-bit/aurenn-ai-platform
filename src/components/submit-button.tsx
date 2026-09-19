'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({
  children,
  pendingLabel = 'Working…',
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        'w-full rounded-lg bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50'
      }
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
