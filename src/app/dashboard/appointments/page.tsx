import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/ui/status-badge'
import EmptyState from '@/components/ui/empty-state'
import PageHeader from '@/components/ui/page-header'

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, status, appointment_time, source, created_at, leads(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Appointments" subtitle="Consultations and bookings requested through your assistant." />

      {!appointments || appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="Appointments will appear here once a visitor books one through your assistant."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-fg-subtle">
              <tr>
                <th className="px-4 py-3 font-medium">Visitor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Appointment time</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Requested</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const lead = a.leads as unknown as { name: string } | null
                return (
                  <tr
                    key={a.id}
                    className="border-t border-border transition-colors duration-fast hover:bg-surface/60"
                  >
                    <td className="px-4 py-3 text-fg">{lead?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-fg-muted">
                      {a.appointment_time ? new Date(a.appointment_time).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-fg-muted">{a.source ?? '—'}</td>
                    <td className="px-4 py-3 text-fg-muted">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
