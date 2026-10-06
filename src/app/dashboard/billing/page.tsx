import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/ui/page-header'
import EmptyState from '@/components/ui/empty-state'
import { CheckCircle2, AlertTriangle, XCircle, Calendar, type LucideIcon } from 'lucide-react'

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
    message: 'Your subscription needs to be renewed. Please send your payment to keep your assistant active.',
  },
  CANCELED: {
    icon: XCircle,
    tone: 'text-danger bg-danger/10',
    label: 'Inactive',
    message: 'Your subscription is inactive. Contact us to reactivate your assistant.',
  },
  EXPIRED: {
    icon: XCircle,
    tone: 'text-danger bg-danger/10',
    label: 'Inactive',
    message: 'Your subscription is inactive. Contact us to reactivate your assistant.',
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

  const daysLeft = subscription?.next_billing_date
    ? Math.ceil((new Date(subscription.next_billing_date).getTime() - Date.now()) / 86400000)
    : null
  const isExpired = daysLeft !== null && daysLeft <= 0

  const status = isExpired ? 'PAST_DUE' : subscription?.status ?? 'INCOMPLETE'
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.INCOMPLETE
  const Icon = config.icon
  const isActive = status === 'ACTIVE'

  return (
    <>
      <PageHeader title="Billing" subtitle="Your plan, subscription status, and payment history." />

      <div className="max-w-md rounded-xl border border-border-strong bg-surface-2 p-5 shadow-lg shadow-black/20 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm text-fg-subtle">
            {subscription?.plan_name ?? 'AI Intake & Lead Operations'}
          </p>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.tone}`}
          >
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
          <div className="mb-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-fg-subtle">
                <Calendar size={14} /> {isExpired ? 'Expired on' : 'Renews on'}
              </span>
              <span className="text-fg">{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-fg-subtle">Time remaining</span>
                <span
                  className={
                    isExpired
                      ? 'font-medium text-danger'
                      : daysLeft <= 7
                        ? 'font-medium text-warning'
                        : 'font-medium text-success'
                  }
                >
                  {isExpired ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago` : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                </span>
              </div>
            )}
          </div>
        )}

        <button
          disabled
          title="Payment management isn't connected yet — contact us to renew"
          className="w-full cursor-not-allowed rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg-subtle opacity-60"
        >
          {isActive ? 'Manage subscription' : 'Contact us to renew'}
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
