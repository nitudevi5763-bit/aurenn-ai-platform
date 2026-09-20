'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function ClientsToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [, startTransition] = useTransition()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) params.set('search', search)
      else params.delete('search')
      startTransition(() => router.replace(`${pathname}?${params.toString()}`))
    }, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') params.delete(key)
    else params.set(key, value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={15}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-subtle"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-sm text-fg outline-none transition-colors duration-fast focus:border-accent sm:w-64"
        />
      </div>

      <select
        defaultValue={searchParams.get('status') ?? 'all'}
        onChange={(e) => updateParam('status', e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors duration-fast focus:border-accent"
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="trial">Trial</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        defaultValue={searchParams.get('sort') ?? 'created_desc'}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors duration-fast focus:border-accent"
      >
        <option value="created_desc">Newest first</option>
        <option value="created_asc">Oldest first</option>
        <option value="name_asc">Name A–Z</option>
        <option value="name_desc">Name Z–A</option>
      </select>
    </div>
  )
}
