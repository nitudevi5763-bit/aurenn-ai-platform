'use client'

import { usePathname } from 'next/navigation'

export default function ConversationsShell({
  list,
  children,
}: {
  list: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDetailView = pathname !== '/dashboard/conversations'

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className={`md:w-80 md:shrink-0 ${isDetailView ? 'hidden md:block' : 'block'}`}>
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-surface">{list}</div>
      </div>
      <div className={`min-w-0 flex-1 ${isDetailView ? 'block' : 'hidden md:block'}`}>{children}</div>
    </div>
  )
}
