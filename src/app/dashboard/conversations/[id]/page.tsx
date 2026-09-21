import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, ai_summary, transcript, started_at, leads(name, email, phone)')
    .eq('id', id)
    .single()

  if (!conversation) redirect('/dashboard/conversations')

  const lead = conversation.leads as unknown as { name: string; email: string; phone: string } | null
  const transcript = Array.isArray(conversation.transcript)
    ? (conversation.transcript as { role?: string; content?: string }[])
    : []

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border p-5">
        <Link
          href="/dashboard/conversations"
          className="mb-3 inline-flex items-center gap-1 text-sm text-fg-subtle transition-colors duration-fast hover:text-fg md:hidden"
        >
          <ArrowLeft size={14} /> Back to conversations
        </Link>
        <p className="text-lg font-semibold text-fg">{lead?.name || 'Unknown visitor'}</p>
        <p className="text-xs text-fg-subtle">{new Date(conversation.started_at).toLocaleString()}</p>
        {(lead?.email || lead?.phone) && (
          <p className="mt-1 text-xs text-fg-subtle">{[lead?.email, lead?.phone].filter(Boolean).join(' · ')}</p>
        )}
      </div>

      <div className="border-b border-border p-5">
        <p className="mb-1 text-xs font-medium tracking-wide text-fg-subtle uppercase">AI summary</p>
        <p className="text-sm text-fg">{conversation.ai_summary || 'Not generated yet.'}</p>
      </div>

      <div className="p-5">
        <p className="mb-3 text-xs font-medium tracking-wide text-fg-subtle uppercase">Transcript</p>
        {transcript.length === 0 ? (
          <p className="text-sm text-fg-subtle">No transcript recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'assistant' ? 'bg-accent/10 text-fg' : 'ml-auto bg-surface-2 text-fg'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
