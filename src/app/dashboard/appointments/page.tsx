import { createClient } from '@/lib/supabase/server'

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, status, appointment_time, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Appointments</h1>

      {!appointments || appointments.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          Appointments will appear here once connected.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Appointment time</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 capitalize">{a.status}</td>
                  <td className="px-4 py-3">
                    {a.appointment_time ? new Date(a.appointment_time).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
