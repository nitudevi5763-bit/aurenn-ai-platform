import { createClient } from '@/lib/supabase/server'

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('monthly_fee, currency, status, next_billing_date')
    .maybeSingle()

  return (
    <main className="pt-4">
      <h1 className="mb-6 text-2xl font-semibold">Billing</h1>

      <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <p className="text-sm text-slate-400">AI Intake &amp; Lead Operations</p>
        <p className="mt-1 text-3xl font-semibold">
          ${subscription?.monthly_fee ?? '79'}
          <span className="text-base font-normal text-slate-400"> / month</span>
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-sm text-slate-400">Status</span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium capitalize text-emerald-400">
            {subscription?.status?.toLowerCase() ?? 'active'}
          </span>
        </div>

        {subscription?.next_billing_date && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Next billing</span>
            <span className="text-sm">{subscription.next_billing_date}</span>
          </div>
        )}
      </div>
    </main>
  )
}
