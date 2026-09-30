'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Drawer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Remember what was focused before the drawer opened, so we can return
    // focus there when it closes — otherwise the keyboard user's position on
    // the page is lost.
    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        router.back()
        return
      }

      // Trap Tab/Shift+Tab inside the drawer so focus can't silently move to
      // whatever is underneath it.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused.current?.focus()
    }
  }, [router])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        aria-hidden="true"
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => router.back()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Lead details"
        className="animate-fade-in relative h-full w-full max-w-lg overflow-y-auto border-l border-border bg-canvas p-6 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-fg-subtle transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  )
}
