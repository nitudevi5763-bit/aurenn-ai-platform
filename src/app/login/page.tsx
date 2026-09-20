'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.user) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single()

    if (profileError || !profile) {
      setError('This account has no dashboard access yet.')
      setLoading(false)
      return
    }

    router.push(profile.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <h1 className="text-lg font-semibold text-fg">Aurenn AI</h1>
        </div>
        <p className="mb-6 text-sm text-fg-subtle">Sign in to your dashboard</p>

        <label className="mb-1 block text-sm text-fg-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
        />

        <label className="mb-1 block text-sm text-fg-muted" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
        />

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-2 font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
