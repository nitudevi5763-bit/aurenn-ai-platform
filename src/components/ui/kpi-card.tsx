import type { LucideIcon } from 'lucide-react'

const TONE_STYLES: Record<string, string> = {
  accent: 'bg-accent/10 text-accent',
  accent2: 'bg-accent-2/10 text-accent-2',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-fg-subtle/10 text-fg-muted',
}

export default function KpiCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  emphasis = 'secondary',
}: {
  label: string
  value: React.ReactNode
  icon?: LucideIcon
  tone?: keyof typeof TONE_STYLES
  emphasis?: 'primary' | 'secondary'
}) {
  return (
    <div
      className={`group rounded-xl border p-5 transition-all duration-base hover:-translate-y-0.5 ${
        emphasis === 'primary'
          ? 'border-border-strong bg-surface-2 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-accent/5'
          : 'border-border bg-surface hover:shadow-lg hover:shadow-black/10'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{label}</p>
        {Icon && (
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${TONE_STYLES[tone]}`}>
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
      </div>
      <p
        className={
          emphasis === 'primary' ? 'text-3xl font-semibold text-fg' : 'text-2xl font-semibold text-fg-muted'
        }
      >
        {value}
      </p>
    </div>
  )
}
