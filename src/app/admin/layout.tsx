import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/app-shell'
import { Building2 } from 'lucide-react'

const NAV = [{ href: '/admin', label: 'Clients', icon: Building2 }]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <AppShell workspaceName="Admin" navItems={NAV}>
      {children}
    </AppShell>
  )
}
