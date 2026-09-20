import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/app-shell'

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
  const workspaceName = clientRecord?.name ?? 'Your dashboard'

  return (
    <AppShell workspaceName={workspaceName} navItems={NAV}>
      {children}
    </AppShell>
  )
}
