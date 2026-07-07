'use client'

import { useState } from 'react'
import { CheckCircle, Calendar, Clock, MapPin, Wallet, CalendarClock, Smartphone, Banknote } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type WorkshopForm = {
  full_name: string
  designation: string
  school_name: string
  city: string
  phone: string
  email: string
}

const initialForm: WorkshopForm = {
  full_name: '',
  designation: '',
  school_name: '',
  city: '',
  phone: '',
  email: '',
}

const DESIGNATIONS = ['Teacher', 'Coordinator', 'Principal', 'School Head', 'School Owner']

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors bg-white'
const labelClass = 'font-body text-navy text-sm font-semibold'

const workshopDetails = [
  { icon: Calendar, label: 'Date', value: '24–25 July 2026' },
  { icon: Clock, label: 'Time', value: '9:00 AM – 2:00 PM' },
  { icon: MapPin, label: 'Venue', value: 'Oyster School System, Islamabad' },
  { icon: Wallet, label: 'Investment', value: 'Rs. 20,000' },
  { icon: CalendarClock, label: 'Registration Deadline', value: '23 July 2026' },
]

export default function WorkshopRegistrationPage() {
  const [form, setForm] = useState<WorkshopForm>(initialForm)
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'cash_on_arrival' | ''>('')
  const [declared, setDeclared] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!paymentMethod) {
      setError('Please select a payment method.')
      return
    }
    if (!declared) {
      setError('Please confirm the declaration to continue.')
      return
    }

    setSubmitting(true)

    const payload = {
      full_name: form.full_name.trim(),
      designation: form.designation,
      school_name: form.school_name.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      payment_method: paymentMethod,
    }

    const { error: insertError } = await supabase
      .from('workshop_registrations')
      .insert(payload)

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    // Best-effort confirmation + admin notification email. A mail failure must
    // not block the registration, which has already succeeded.
    try {
      await fetch('/api/workshop-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // ignore — registration is saved regardless
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-16 text-center px-4">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Workshop Registration
        </p>
        <h1 className="font-heading text-white text-4xl md:text-5xl font-semibold">
          School Leadership in Action
        </h1>
        <p className="font-body text-gray-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
          Workshop Registration — 24–25 July 2026
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {submitted ? (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-gold" />
            </div>
            <h2 className="font-heading text-navy text-3xl font-semibold mb-4">
              Registration Confirmed
            </h2>
            <p className="font-body text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
              Your registration has been confirmed! Please complete your payment before 23 July
              2026. For JazzCash payments send to 0332-8308486 and WhatsApp your payment screenshot
              to confirm. For cash payment bring Rs. 20,000 on the day. Contact us at 0332-8308486
              for any queries.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Register Now</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                Complete the form below to reserve your place at the workshop.
              </p>
            </div>

            {/* Personal details */}
            <div className="space-y-1.5">
              <label className={labelClass}>
                Full Name <span className="text-gold">*</span>
              </label>
              <input
                name="full_name"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Ahmed Ali"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Designation <span className="text-gold">*</span>
                </label>
                <select
                  name="designation"
                  required
                  value={form.designation}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select designation
                  </option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>
                  City <span className="text-gold">*</span>
                </label>
                <input
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Islamabad"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                School Name <span className="text-gold">*</span>
              </label>
              <input
                name="school_name"
                required
                value={form.school_name}
                onChange={handleChange}
                placeholder="e.g. Oyster School System"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Phone Number <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <label className={labelClass}>
                Payment Method <span className="text-gold">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jazzcash')}
                  className={`text-left rounded-sm border-2 p-5 transition-colors ${
                    paymentMethod === 'jazzcash'
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-200 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone size={18} className="text-gold" />
                    <span className="font-heading text-navy text-lg font-semibold">JazzCash</span>
                  </div>
                  <p className="font-body text-gray-500 text-sm">
                    Send to JazzCash number:
                    <br />
                    <span className="font-semibold text-navy">0332-8308486</span>
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_arrival')}
                  className={`text-left rounded-sm border-2 p-5 transition-colors ${
                    paymentMethod === 'cash_on_arrival'
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-200 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Banknote size={18} className="text-gold" />
                    <span className="font-heading text-navy text-lg font-semibold">
                      Cash on Arrival
                    </span>
                  </div>
                  <p className="font-body text-gray-500 text-sm">
                    Pay Rs. 20,000 at the venue on the day of the workshop.
                  </p>
                </button>
              </div>
            </div>

            {/* Workshop details summary */}
            <div className="bg-navy rounded-sm p-6">
              <p className="font-body text-gold text-xs tracking-widest uppercase font-semibold mb-4">
                Workshop Details
              </p>
              <dl className="space-y-3">
                {workshopDetails.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon size={18} className="text-gold shrink-0" />
                    <dt className="font-body text-gray-300 text-sm w-40 shrink-0">{label}</dt>
                    <dd className="font-body text-white text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Declaration */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declared}
                onChange={(e) => setDeclared(e.target.checked)}
                className="mt-1 h-4 w-4 accent-gold shrink-0"
              />
              <span className="font-body text-gray-600 text-sm leading-relaxed">
                I confirm my attendance and understand that the workshop investment is Rs. 20,000
              </span>
            </label>

            {error && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Confirm Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
