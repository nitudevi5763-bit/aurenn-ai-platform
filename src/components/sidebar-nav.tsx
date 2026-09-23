'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  CalendarClock,
  Clock,
  CreditCard,
  Building2,
  Settings,
  type LucideIcon,
} from 'lucide-react'

// Icon lookup lives entirely inside this Client Component. Server Components
// pass only the string key (below) across the boundary — never the actual
// component function, which is not serializable.
const ICONS = {
  'layout-dashboard': LayoutDashboard,
  users: Users,
  'messages-square': MessagesSquare,
  'calendar-clock': CalendarClock,
  clock: Clock,
  'credit-card': CreditCard,
  'building-2': Building2,
  settings: Settings,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS
export type NavItem = { href: string; label: string; icon: IconName }

export default function SidebarNav({
  items,
  variant = 'vertical',
}: {
  items: NavItem[]
  variant?: 'vertical' | 'horizontal'
}) {
  const pathname = usePathname()

  if (variant === 'horizontal') {
    return (
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = ICONS[item.icon]
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-fast ${
                active ? 'bg-accent/15 text-accent' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex-1 space-y-0.5">
      {items.map((item) => {
        const active = pathname === item.href
        const Icon = ICONS[item.icon]
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-fast ${
              active ? 'bg-accent/12 text-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
            }`}
          >
            {active && (
              <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
            )}
            <Icon size={16} strokeWidth={2} className={active ? 'text-accent' : ''} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
