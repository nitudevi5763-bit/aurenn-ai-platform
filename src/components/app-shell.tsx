import SignOutButton from '@/components/sign-out-button'
import SidebarNav, { type NavItem } from '@/components/sidebar-nav'
import PageTransition from '@/components/page-transition'

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
            <div className="mb-8 flex items-center gap-2.5 px-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-xs font-bold text-white shadow-lg shadow-accent/20">
                A
              </span>
              <span className="text-sm font-semibold tracking-tight text-fg">Aurenn AI</span>
            </div>

            <p className="mb-3 truncate px-1 text-xs font-medium text-fg-subtle">{workspaceName}</p>

            <SidebarNav items={navItems} />

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
            <SidebarNav items={navItems} variant="horizontal" />
          </header>
          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  )
}
