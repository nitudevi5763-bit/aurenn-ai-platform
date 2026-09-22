import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/ui/page-header'
import EmptyState from '@/components/ui/empty-state'
import { CheckCircle2, AlertTriangle, XCircle, type LucideIcon } from 'lucide-react'

const STATUS_CONFIG: Record<string, { icon: LucideIcon; tone: string; label: string; message: string }> = {
  ACTIVE: {
    icon: CheckCircle2,
    tone: 'text-success bg-success/10',
    label: 'Active',
    message: 'Your plan is active and your assistant is running normally.',
  },
  PAST_DUE: {
    icon: AlertTriangle,
    tone: 'text-warning bg-warning/10',
    label: 'Payment due',
    message: "Your last payment didn't go through. Update your payment method to avoid interruption.",
  },
  CANCELED: {
    icon: XCircle,
    tone: 'text-danger bg-danger/10',
    label: 'Inactive',
    message: 'Your subscription is inactive. Reactivate to bring your assistant back online.',
  },
  EXPIRED: {
    icon: XCircle,
    tone: 'text-danger bg-danger/10',
    label: 'Inactive',
    message: 'Your subscription is inactive. Reactivate to bring your assistant back online.',
  },
  INCOMPLETE: {
    icon: AlertTriangle,
    tone: 'text-warning bg-warning/10',
    label: 'Setting up',
    message: 'Billing is still being set up for your account.',
  },
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_name, monthly_fee, currency, status, next_billing_date')
    .maybeSingle()

  const status = subscription?.status ?? 'INCOMPLETE'
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.INCOMPLETE
  const Icon = config.icon
  const isActive = status === 'ACTIVE'

  return (
    <>
      <PageHeader title="Billing" subtitle="Your plan, subscription status, and payment history." />

      <div className="max-w-md rounded-xl border border-border-strong bg-surface-2 p-6 shadow-lg shadow-black/20">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-fg-subtle">{subscription?.plan_name ?? 'AI Intake & Lead Operations'}</p>
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.tone}`}>
            <Icon size={13} strokeWidth={2} />
            {config.label}
          </span>
        </div>

        <p className="mb-1 text-3xl font-semibold text-fg">
          ${subscription?.monthly_fee ?? '79'}
          <span className="text-base font-normal text-fg-subtle"> / month</span>
        </p>

        <p className="mb-5 text-sm text-fg-muted">{config.message}</p>

        {subscription?.next_billing_date && (
          <div className="mb-5 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-fg-subtle">Next billing</span>
            <span className="text-fg">{subscription.next_billing_date}</span>
          </div>
        )}

        <button
          disabled
          title="Payment management isn't connected yet"
          className="w-full cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-subtle opacity-60"
        >
          {isActive ? 'Manage subscription' : 'Reactivate plan'}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-fg-muted">Payment history</h2>
        <EmptyState
          title="No payment history yet"
          description="Once billing is connected, your payment history will appear here."
        />
      </div>
    </>
  )
}
