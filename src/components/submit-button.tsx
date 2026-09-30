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
      aria-busy={pending}
      className={
        className ??
        'w-full rounded-lg bg-accent px-4 py-2 font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50'
      }
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
