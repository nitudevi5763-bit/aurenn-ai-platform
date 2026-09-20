const TONE_MAP: Record<string, string> = {
  active: 'bg-success/10 text-success',
  connected: 'bg-success/10 text-success',
  completed: 'bg-success/10 text-success',
  done: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  trial: 'bg-warning/10 text-warning',
  requested: 'bg-warning/10 text-warning',
  new: 'bg-accent-2/10 text-accent-2',
  inactive: 'bg-danger/10 text-danger',
  error: 'bg-danger/10 text-danger',
  cancelled: 'bg-danger/10 text-danger',
  disqualified: 'bg-danger/10 text-danger',
}

export default function StatusBadge({ status }: { status: string }) {
  const tone = TONE_MAP[status.toLowerCase()] ?? 'bg-fg-subtle/10 text-fg-muted'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${tone}`}>
      {status}
    </span>
  )
}
