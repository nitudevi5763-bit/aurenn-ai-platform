'use client'

import { useEffect, useRef } from 'react'
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

// Top-level entries like /admin or /dashboard only match exactly (otherwise
// they would light up on every sub-page). Deeper entries also match their
// sub-pages, e.g. /dashboard/leads stays active on /dashboard/leads/123.
function isActive(pathname: string, href: string) {
  const isRoot = href.split('/').filter(Boolean).length <= 1
  if (isRoot) return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export default function SidebarNav({
  items,
  variant = 'vertical',
}: {
  items: NavItem[]
  variant?: 'vertical' | 'horizontal'
}) {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  // On phones the top nav scrolls sideways — keep the active tab in view.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) return
    const left = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
    nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [pathname])

  if (variant === 'horizontal') {
    return (
      <nav
        ref={navRef}
        className="scrollbar-none relative flex gap-1 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:px-6"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = ICONS[item.icon]
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-sm transition-colors duration-fast ${
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
        const active = isActive(pathname, item.href)
        const Icon = ICONS[item.icon]
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            aria-current={active ? 'page' : undefined}
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
