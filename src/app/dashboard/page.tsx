import { createClient } from '@/lib/supabase/server'
import KpiCard from '@/components/ui/kpi-card'
import PageHeader from '@/components/ui/page-header'
import { Users, Sparkles, AlertTriangle, CalendarClock, Clock } from 'lucide-react'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()

  const [
    { count: totalLeads },
    { count: newLeads },
    { count: highPriority },
    { count: appointments },
    { count: followupsDue },
  ] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'NEW'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('priority', 'high'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase.from('followups').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return (
    <>
      <PageHeader title="Overview" subtitle="What's happening with your enquiries." />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Total leads" value={totalLeads ?? 0} icon={Users} tone="accent" emphasis="primary" />
        <KpiCard label="New leads" value={newLeads ?? 0} icon={Sparkles} tone="accent2" />
        <KpiCard label="High priority" value={highPriority ?? 0} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Appointments" value={appointments ?? 0} icon={CalendarClock} tone="success" />
        <KpiCard label="Follow-ups due" value={followupsDue ?? 0} icon={Clock} tone="neutral" />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 text-fg-muted">
        {totalLeads && totalLeads > 0
          ? "We'll show an AI-generated daily summary here once enough activity comes in."
          : 'No activity yet. Once your assistant is connected, a plain-English daily summary of your enquiries will appear here.'}
      </div>
    </>
  )
}
