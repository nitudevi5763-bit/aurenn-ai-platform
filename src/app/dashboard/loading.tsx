export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-6 w-32 rounded bg-surface-2" />
      <div className="mb-8 h-4 w-64 rounded bg-surface-2" />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="h-24 rounded-xl border border-border bg-surface" />
    </div>
  )
}
