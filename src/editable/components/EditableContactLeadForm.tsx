'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass =
  'h-12 w-full rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 text-[0.95rem] font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--iso-green)] focus:bg-white focus:ring-4 focus:ring-[var(--iso-green-soft)]'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks — your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="What is this about?" />
      </div>
      <label className="mt-4 grid gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-soft-muted-text)]">
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us a little about what you need…"
          className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-4 text-[0.95rem] font-medium leading-7 text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--iso-green)] focus:bg-white focus:ring-4 focus:ring-[var(--iso-green-soft)]"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {message ? (
        <div
          className={`mt-5 flex items-start gap-3 rounded-[1.25rem] px-4 py-3.5 text-sm font-semibold ${
            status === 'success'
              ? 'bg-[var(--iso-green-soft)] text-[var(--iso-green-deep)]'
              : 'bg-[var(--iso-coral-soft)] text-[#B3341F]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--iso-ink)] px-6 text-sm font-semibold text-[var(--iso-cream)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--iso-green)] hover:text-[#12210E] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
        <ArrowUpRight className="iso-arrow h-4 w-4" />
      </button>
    </form>
  )
}

function Field({ name, label, type = 'text', placeholder, required = false }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-soft-muted-text)]">
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} className={fieldClass} />
    </label>
  )
}
