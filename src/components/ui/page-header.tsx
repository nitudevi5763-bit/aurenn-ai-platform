export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-balance break-words text-fg sm:text-xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-fg-subtle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  )
}
