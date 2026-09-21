import { MessagesSquare } from 'lucide-react'

export default function ConversationsIndexPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 text-center">
      <MessagesSquare size={22} className="mb-3 text-fg-subtle" />
      <p className="text-sm font-medium text-fg">Select a conversation</p>
      <p className="mt-1 max-w-xs text-sm text-fg-subtle">
        Choose a conversation from the list to view the transcript and AI summary.
      </p>
    </div>
  )
}
