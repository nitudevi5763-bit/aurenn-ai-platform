'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      aria-label="Sign out"
      className="rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
    >
      Sign out
    </button>
  )
}
