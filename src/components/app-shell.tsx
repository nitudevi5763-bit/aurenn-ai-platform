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
    <div className="min-h-dvh bg-canvas text-fg">
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto">
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
          <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
              <span className="min-w-0 truncate text-sm font-semibold">{workspaceName}</span>
              <SignOutButton />
            </div>
            <SidebarNav items={navItems} variant="horizontal" />
          </header>
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1440px]">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
