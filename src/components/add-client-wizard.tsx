'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { createClientAction } from '@/app/admin/actions'
import SubmitButton from '@/components/submit-button'
import { Check } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Business' },
  { id: 2, label: 'Client Access' },
  { id: 3, label: 'Assistant' },
  { id: 4, label: 'Billing' },
  { id: 5, label: 'Review' },
]

type FormState = {
  name: string
  website: string
  industry: string
  country: string
  contact_email: string
  login_email: string
  login_password: string
  assistant_name: string
  assistant_url: string
  setup_fee: string
  monthly_fee: string
}

const INITIAL: FormState = {
  name: '',
  website: '',
  industry: '',
  country: '',
  contact_email: '',
  login_email: '',
  login_password: '',
  assistant_name: '',
  assistant_url: '',
  setup_fee: '999',
  monthly_fee: '79',
}

export default function AddClientWizard() {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<FormState>(INITIAL)
  const [state, formAction] = useActionState(createClientAction, { error: null as string | null })

  function update(field: keyof FormState, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return values.name.trim() !== ''
    if (step === 2) return values.login_email.includes('@') && values.login_password.trim().length >= 4
    return true
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="mb-6 inline-block text-sm text-fg-subtle transition-colors duration-fast hover:text-fg"
      >
        &larr; Back to clients
      </Link>

      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors duration-base ${
                  step > s.id
                    ? 'bg-accent text-white'
                    : step === s.id
                      ? 'border-2 border-accent text-accent'
                      : 'border border-border text-fg-subtle'
                }`}
              >
                {step > s.id ? <Check size={14} /> : s.id.toString().padStart(2, '0')}
              </div>
              <span className={`text-xs whitespace-nowrap ${step === s.id ? 'text-fg' : 'text-fg-subtle'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-px flex-1 ${step > s.id ? 'bg-accent' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <form action={formAction} className="rounded-xl border border-border bg-surface p-8">
        <div className={step === 1 ? 'block' : 'hidden'}>
          <h2 className="mb-1 text-lg font-semibold text-fg">Business details</h2>
          <p className="mb-5 text-sm text-fg-subtle">Who is this workspace for?</p>
          <div className="space-y-4">
            <Field label="Business name" name="name" value={values.name} onChange={(v) => update('name', v)} required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Website" name="website" value={values.website} onChange={(v) => update('website', v)} />
              <Field
                label="Industry"
                name="industry"
                value={values.industry}
                onChange={(v) => update('industry', v)}
                placeholder="e.g. Law Firm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country" name="country" value={values.country} onChange={(v) => update('country', v)} />
              <Field
                label="Contact email"
                name="contact_email"
                type="email"
                value={values.contact_email}
                onChange={(v) => update('contact_email', v)}
              />
            </div>
          </div>
        </div>

        <div className={step === 2 ? 'block' : 'hidden'}>
          <h2 className="mb-1 text-lg font-semibold text-fg">Client login credentials</h2>
          <p className="mb-5 text-sm text-fg-subtle">
            This is the email and password the client will use to log into their own dashboard. Share
            it with them yourself after creating it — it won&apos;t be shown again here.
          </p>
          <div className="space-y-4">
            <Field
              label="Login email"
              name="login_email"
              type="email"
              value={values.login_email}
              onChange={(v) => update('login_email', v)}
              required
            />
            <Field
              label="Login password"
              name="login_password"
              value={values.login_password}
              onChange={(v) => update('login_password', v)}
              required
            />
          </div>
        </div>

        <div className={step === 3 ? 'block' : 'hidden'}>
          <h2 className="mb-1 text-lg font-semibold text-fg">Assistant connection</h2>
          <p className="mb-5 text-sm text-fg-subtle">
            Leave this blank if the assistant isn&apos;t built yet — you can add it later from the
            client&apos;s detail page.
          </p>
          <div className="space-y-4">
            <Field
              label="Assistant name"
              name="assistant_name"
              value={values.assistant_name}
              onChange={(v) => update('assistant_name', v)}
              placeholder="e.g. Smith Law Receptionist"
            />
            <Field
              label="Assistant URL"
              name="assistant_url"
              value={values.assistant_url}
              onChange={(v) => update('assistant_url', v)}
              placeholder="https://client-bot-name.vercel.app"
            />
          </div>
        </div>

        <div className={step === 4 ? 'block' : 'hidden'}>
          <h2 className="mb-1 text-lg font-semibold text-fg">Billing</h2>
          <p className="mb-5 text-sm text-fg-subtle">
            The setup fee is never shown on the client&apos;s billing page — only the monthly fee is.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Setup fee (USD)"
              name="setup_fee"
              type="number"
              value={values.setup_fee}
              onChange={(v) => update('setup_fee', v)}
            />
            <Field
              label="Monthly fee (USD)"
              name="monthly_fee"
              type="number"
              value={values.monthly_fee}
              onChange={(v) => update('monthly_fee', v)}
            />
          </div>
        </div>

        <div className={step === 5 ? 'block' : 'hidden'}>
          <h2 className="mb-1 text-lg font-semibold text-fg">Review</h2>
          <p className="mb-5 text-sm text-fg-subtle">Confirm everything before creating the workspace.</p>
          <div className="space-y-4 text-sm">
            <ReviewSection title="Business">
              <ReviewRow label="Name" value={values.name} />
              <ReviewRow label="Website" value={values.website} />
              <ReviewRow label="Industry" value={values.industry} />
              <ReviewRow label="Country" value={values.country} />
              <ReviewRow label="Contact email" value={values.contact_email} />
            </ReviewSection>
            <ReviewSection title="Client access">
              <ReviewRow label="Login email" value={values.login_email} />
              <ReviewRow
                label="Login password"
                value={values.login_password ? '•'.repeat(Math.max(values.login_password.length, 4)) : ''}
              />
            </ReviewSection>
            <ReviewSection title="Assistant">
              <ReviewRow label="Name" value={values.assistant_name} />
              <ReviewRow label="URL" value={values.assistant_url} />
            </ReviewSection>
            <ReviewSection title="Billing">
              <ReviewRow label="Setup fee" value={`$${values.setup_fee}`} />
              <ReviewRow label="Monthly fee" value={`$${values.monthly_fee}`} />
            </ReviewSection>
          </div>

          {state.error && (
            <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={
              step === 1
                ? 'invisible'
                : 'rounded-lg border border-border px-4 py-2 text-sm text-fg-muted transition-colors duration-fast hover:bg-surface-2 hover:text-fg'
            }
          >
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <SubmitButton
              pendingLabel="Creating client…"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-accent-hover disabled:opacity-50"
            >
              Create client workspace
            </SubmitButton>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-fg-muted" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-fg outline-none transition-colors duration-fast focus:border-accent"
      />
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-fg-subtle uppercase">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-subtle">{label}</span>
      <span className="text-fg">{value || '—'}</span>
    </div>
  )
}
