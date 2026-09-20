import Link from 'next/link'
import SignOutButton from '@/components/sign-out-button'

export type NavItem = { href: string; label: string }

export default function AppShell({
  workspaceName,
  navItems,
  children,
}: {
  workspaceName: string
  navItems: NavItem[]
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:block">
          <div className="flex h-full flex-col p-5">
            <div className="mb-8 flex items-center gap-2 px-1">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-semibold tracking-tight text-fg">Aurenn AI</span>
            </div>

            <p className="mb-3 truncate px-1 text-xs font-medium text-fg-subtle">{workspaceName}</p>

            <nav className="flex-1 space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className="group flex items-center rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-border pt-3">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-surface/60 backdrop-blur md:hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm font-semibold">{workspaceName}</span>
              <SignOutButton />
            </div>
            <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
