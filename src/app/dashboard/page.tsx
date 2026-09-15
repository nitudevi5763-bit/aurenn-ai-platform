import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { count: totalLeads } = await supabase.from('leads').select('id', { count: 'exact', head: true })
  const { count: newLeads } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'NEW')
  const { count: highPriority } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('priority', 'high')
  const { count: appointments } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
  const { count: followupsDue } = await supabase
    .from('followups')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Overview</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total leads" value={totalLeads ?? 0} />
        <StatCard label="New leads" value={newLeads ?? 0} />
        <StatCard label="High priority" value={highPriority ?? 0} />
        <StatCard label="Appointments" value={appointments ?? 0} />
        <StatCard label="Follow-ups due" value={followupsDue ?? 0} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
        {totalLeads && totalLeads > 0
          ? "We'll show an AI-generated daily summary here once enough activity comes in."
          : 'No activity yet. Once your assistant is connected, a plain-English daily summary of your enquiries will appear here.'}
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}
