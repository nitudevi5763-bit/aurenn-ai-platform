import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/app-shell'
import type { NavItem } from '@/components/sidebar-nav'

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/dashboard/leads', label: 'Leads', icon: 'users' },
  { href: '/dashboard/conversations', label: 'Conversations', icon: 'messages-square' },
  { href: '/dashboard/appointments', label: 'Appointments', icon: 'calendar-clock' },
  { href: '/dashboard/followups', label: 'Follow-ups', icon: 'clock' },
  { href: '/dashboard/billing', label: 'Billing', icon: 'credit-card' },
]

export default async function DashboardLayout({
  children,
  drawer,
}: {
  children: React.ReactNode
  drawer: React.ReactNode
}) {
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
      {drawer}
    </AppShell>
  )
}
