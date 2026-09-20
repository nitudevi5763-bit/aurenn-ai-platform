export default function KpiCard({
  label,
  value,
  emphasis = 'secondary',
}: {
  label: string
  value: React.ReactNode
  emphasis?: 'primary' | 'secondary'
}) {
  return (
    <div
      className={
        emphasis === 'primary'
          ? 'rounded-xl border border-border-strong bg-surface-2 p-5'
          : 'rounded-xl border border-border bg-surface p-5'
      }
    >
      <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{label}</p>
      <p
        className={
          emphasis === 'primary'
            ? 'mt-2 text-3xl font-semibold text-fg'
            : 'mt-2 text-2xl font-semibold text-fg-muted'
        }
      >
        {value}
      </p>
    </div>
  )
}
