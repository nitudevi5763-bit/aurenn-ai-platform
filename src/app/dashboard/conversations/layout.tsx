import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ConversationsShell from '@/components/conversations-shell'
import EmptyState from '@/components/ui/empty-state'

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, ai_summary, started_at, leads(name)')
    .order('started_at', { ascending: false })

  const list =
    !conversations || conversations.length === 0 ? (
      <div className="p-4">
        <EmptyState
          title="No conversations yet"
          description="Your assistant hasn't received any conversations yet."
        />
      </div>
    ) : (
      <ul className="divide-y divide-border">
        {conversations.map((c) => {
          const lead = c.leads as unknown as { name: string } | null
          return (
            <li key={c.id}>
              <Link
                href={`/dashboard/conversations/${c.id}`}
                className="block px-4 py-3 transition-colors duration-fast hover:bg-surface-2"
              >
                <p className="text-sm font-medium text-fg">{lead?.name || 'Unknown visitor'}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-fg-subtle">{c.ai_summary || 'No summary yet'}</p>
                <p className="mt-1 text-[11px] text-fg-subtle">{new Date(c.started_at).toLocaleString()}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    )

  return <ConversationsShell list={list}>{children}</ConversationsShell>
}
