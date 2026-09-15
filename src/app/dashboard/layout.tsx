import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/sign-out-button'

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/conversations', label: 'Conversations' },
  { href: '/dashboard/appointments', label: 'Appointments' },
  { href: '/dashboard/followups', label: 'Follow-ups' },
  { href: '/dashboard/billing', label: 'Billing' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, clients(name)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/admin')

  const clientRecord = profile.clients as unknown as { name: string } | null
  const clientName = clientRecord?.name ?? 'Your dashboard'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="w-56 border-r border-slate-800 p-6">
          <p className="mb-8 text-lg font-semibold">{clientName}</p>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <div className="flex justify-end p-4">
            <SignOutButton />
          </div>
          <div className="px-8 pb-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
