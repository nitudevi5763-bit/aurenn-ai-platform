'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyReminderButton({
  clientName,
  monthlyFee,
  daysLeft,
  endDate,
}: {
  clientName: string
  monthlyFee: number
  daysLeft: number
  endDate: string
}) {
  const [copied, setCopied] = useState(false)

  const message = daysLeft > 0
    ? `Hi ${clientName}, just a quick reminder — your Aurenn AI subscription renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'} (on ${endDate}). Please send your payment of $${monthlyFee}/month at your convenience to keep your AI assistant active. Thank you!`
    : `Hi ${clientName}, your Aurenn AI subscription expired on ${endDate}. Please send your payment of $${monthlyFee}/month to reactivate your AI assistant. Let us know once it's done and we'll turn it back on right away.`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API can fail in some contexts — fail silently, button
      // stays clickable for another attempt.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg"
    >
      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy reminder message'}
    </button>
  )
}
