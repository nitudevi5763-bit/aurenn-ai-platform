export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-6 w-32 rounded bg-surface-2" />
      <div className="mb-6 h-4 w-64 rounded bg-surface-2" />
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="h-10 bg-surface" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 border-t border-border bg-surface/50" />
        ))}
      </div>
    </div>
  )
}
