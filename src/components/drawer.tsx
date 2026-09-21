'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function Drawer({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => router.back()}
      />
      <div className="animate-fade-in relative h-full w-full max-w-lg overflow-y-auto border-l border-border bg-canvas p-6 shadow-2xl">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-fg-subtle transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}
