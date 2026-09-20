export default function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface/50 px-8 py-16 text-center">
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-fg-subtle">{description}</p>
    </div>
  )
}
