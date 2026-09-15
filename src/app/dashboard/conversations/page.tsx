import { createClient } from '@/lib/supabase/server'

export default async function ConversationsPage() {
  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, ai_summary, started_at')
    .order('started_at', { ascending: false })

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Conversations</h1>

      {!conversations || conversations.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          Your assistant hasn&apos;t received any conversations yet.
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="mb-2 text-xs text-slate-500">{new Date(c.started_at).toLocaleString()}</p>
              <p className="text-slate-300">{c.ai_summary || 'No summary yet.'}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
