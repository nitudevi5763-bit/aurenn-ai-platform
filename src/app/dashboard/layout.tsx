import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/app-shell'
import { LayoutDashboard, Users, MessagesSquare, CalendarClock, Clock, CreditCard } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/conversations', label: 'Conversations', icon: MessagesSquare },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/dashboard/followups', label: 'Follow-ups', icon: Clock },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
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
