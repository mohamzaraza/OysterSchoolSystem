'use client'

import { useRef, useState } from 'react'
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  CalendarClock,
  Smartphone,
  Banknote,
  Upload,
  FileCheck2,
  X,
  Check,
  ArrowLeft,
  Hourglass,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const EASYPAISA_NUMBER = '0336-5816350'
const RECEIPT_BUCKET = 'workshop-receipts'
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_RECEIPT_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']

type WorkshopForm = {
  full_name: string
  designation: string
  school_name: string
  city: string
  phone: string
  email: string
}

type PaymentMethod = 'easypaisa' | 'cash_on_arrival' | ''
type Step = 'details' | 'receipt' | 'done'

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [declared, setDeclared] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const receiptInputRef = useRef<HTMLInputElement>(null)

  // Steps shown in the progress indicator. Cash skips the receipt step.
  const steps = paymentMethod === 'cash_on_arrival'
    ? ['Your Details', 'Confirmation']
    : ['Your Details', 'Payment Receipt', 'Confirmation']
  const currentIndex = step === 'details' ? 0 : step === 'receipt' ? 1 : steps.length - 1

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function selectPaymentMethod(method: 'easypaisa' | 'cash_on_arrival') {
    setError(null)
    setPaymentMethod(method)
    if (method !== 'easypaisa') clearReceipt()
  }

  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_RECEIPT_TYPES.includes(file.type)) {
      setError('Please upload the receipt as an image (PNG/JPG) or a PDF.')
      clearReceipt()
      return
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setError('The receipt file is too large. Please upload a file under 5 MB.')
      clearReceipt()
      return
    }
    setReceiptFile(file)
  }

  function clearReceipt() {
    setReceiptFile(null)
    if (receiptInputRef.current) receiptInputRef.current.value = ''
  }

  function buildPayload(receiptUrl: string | null, status: string) {
    return {
      full_name: form.full_name.trim(),
      designation: form.designation,
      school_name: form.school_name.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      payment_method: paymentMethod,
      receipt_url: receiptUrl,
      status,
    }
  }

  // Best-effort email. A mail failure must never block a saved registration.
  async function notifySubmitted(payload: Record<string, unknown>) {
    try {
      await fetch('/api/workshop-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, stage: 'submitted' }),
      })
    } catch {
      // ignore — registration is saved regardless
    }
  }

  // Step 1 → validate details + payment method, then branch by method.
  async function handleDetailsSubmit(e: React.FormEvent) {
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

    // EasyPaisa: move to the dedicated receipt-upload screen (no DB write yet,
    // so abandoned registrations do not create orphan rows).
    if (paymentMethod === 'easypaisa') {
      setStep('receipt')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Cash on arrival: no receipt to review — save and confirm immediately.
    setSubmitting(true)
    const payload = buildPayload(null, 'registered')
    const { error: insertError } = await supabase.from('workshop_registrations').insert(payload)
    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }
    await notifySubmitted(payload)
    setSubmitting(false)
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Step 2 (EasyPaisa) → upload receipt, save as pending_verification, email.
  async function handleReceiptSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!receiptFile) {
      setError('Please upload your EasyPaisa payment receipt to complete your registration.')
      return
    }

    setSubmitting(true)

    const ext = receiptFile.name.split('.').pop()?.toLowerCase() || 'dat'
    const safeName = form.full_name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'registrant'
    const path = `${Date.now()}-${safeName}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(RECEIPT_BUCKET)
      .upload(path, receiptFile, { contentType: receiptFile.type, upsert: false })

    if (uploadError) {
      setError(`Could not upload your receipt: ${uploadError.message}. Please try again.`)
      setSubmitting(false)
      return
    }

    const { data: publicUrl } = supabase.storage.from(RECEIPT_BUCKET).getPublicUrl(path)
    const payload = buildPayload(publicUrl.publicUrl, 'pending_verification')

    const { error: insertError } = await supabase.from('workshop_registrations').insert(payload)
    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    await notifySubmitted(payload)
    setSubmitting(false)
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToDetails() {
    setError(null)
    setStep('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const detailsCtaLabel =
    paymentMethod === 'easypaisa'
      ? 'Continue to Payment Receipt'
      : paymentMethod === 'cash_on_arrival'
        ? submitting
          ? 'Submitting…'
          : 'Confirm Registration'
        : 'Continue'

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
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold shrink-0 transition-colors ${
                    i < currentIndex
                      ? 'bg-gold text-white'
                      : i === currentIndex
                        ? 'bg-navy text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i < currentIndex ? <Check size={16} /> : i + 1}
                </div>
                <span
                  className={`font-body text-sm hidden sm:inline ${
                    i === currentIndex ? 'text-navy font-semibold' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-3 transition-colors ${
                    i < currentIndex ? 'bg-gold' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Details */}
        {step === 'details' && (
          <form
            onSubmit={handleDetailsSubmit}
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
                  onClick={() => selectPaymentMethod('easypaisa')}
                  className={`text-left rounded-sm border-2 p-5 transition-colors ${
                    paymentMethod === 'easypaisa'
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-200 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone size={18} className="text-gold" />
                    <span className="font-heading text-navy text-lg font-semibold">EasyPaisa</span>
                  </div>
                  <p className="font-body text-gray-500 text-sm">
                    Send Rs. 20,000 to EasyPaisa number:
                    <br />
                    <span className="font-semibold text-navy">{EASYPAISA_NUMBER}</span>
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => selectPaymentMethod('cash_on_arrival')}
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
              {paymentMethod === 'easypaisa' && (
                <p className="font-body text-gray-500 text-sm bg-gold/5 border border-gold/20 rounded-sm px-4 py-3">
                  Next, you&apos;ll be asked to upload a screenshot or PDF of your EasyPaisa payment
                  receipt so our team can verify it.
                </p>
              )}
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
              {detailsCtaLabel}
            </button>
          </form>
        )}

        {/* STEP 2 — EasyPaisa receipt upload */}
        {step === 'receipt' && (
          <form
            onSubmit={handleReceiptSubmit}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
          >
            <button
              type="button"
              onClick={backToDetails}
              className="inline-flex items-center gap-1.5 font-body text-sm text-gray-500 hover:text-navy transition-colors"
            >
              <ArrowLeft size={16} /> Back to details
            </button>

            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Upload Payment Receipt</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                One last step, {form.full_name.split(' ')[0] || 'there'} — upload proof of your
                EasyPaisa payment.
              </p>
            </div>

            {/* Payment instructions */}
            <div className="bg-navy rounded-sm p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-gold shrink-0" />
                <span className="font-heading text-white text-lg font-semibold">EasyPaisa Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <dt className="font-body text-gray-300 text-sm w-24 shrink-0">Send</dt>
                <dd className="font-body text-white text-sm font-semibold">Rs. 20,000</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="font-body text-gray-300 text-sm w-24 shrink-0">To number</dt>
                <dd className="font-body text-white text-sm font-semibold">{EASYPAISA_NUMBER}</dd>
              </div>
            </div>

            {/* Upload control */}
            <div className="rounded-sm border-2 border-dashed border-gold/40 bg-gold/5 p-6 space-y-3">
              <p className="font-body text-navy text-sm font-semibold">
                Your payment receipt <span className="text-gold">*</span>
              </p>
              <p className="font-body text-gray-500 text-sm">
                Upload a screenshot or PDF of your EasyPaisa transaction receipt. Our team will
                review and verify it before confirming your seat.
              </p>

              <input
                ref={receiptInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleReceiptChange}
                className="hidden"
              />

              {receiptFile ? (
                <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-sm px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck2 size={18} className="text-emerald-600 shrink-0" />
                    <span className="font-body text-sm text-navy truncate">{receiptFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearReceipt}
                    title="Remove receipt"
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => receiptInputRef.current?.click()}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-navy font-semibold hover:border-gold transition-colors"
                >
                  <Upload size={18} className="text-gold" />
                  Choose receipt file
                </button>
              )}
              <p className="font-body text-gray-400 text-xs">PNG, JPG, WEBP or PDF · up to 5 MB</p>
            </div>

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
              {submitting ? 'Submitting…' : 'Submit Receipt & Register'}
            </button>
          </form>
        )}

        {/* STEP 3 — Done */}
        {step === 'done' && (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            {paymentMethod === 'easypaisa' ? (
              <>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Hourglass size={32} className="text-gold" />
                </div>
                <h2 className="font-heading text-navy text-3xl font-semibold mb-4">
                  Registration Received
                </h2>
                <p className="font-body text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
                  Thank you! We&apos;ve received your registration and your EasyPaisa payment receipt.
                  Our team will <strong>review and verify your payment</strong>. Once verified,
                  you&apos;ll receive a <strong>confirmation email</strong> which you can show to
                  attend the workshop.
                  {form.email && (
                    <>
                      {' '}
                      A holding confirmation has been sent to <strong>{form.email}</strong>.
                    </>
                  )}
                </p>
                <p className="font-body text-gray-400 text-sm mt-4">
                  Questions? Contact us at 0332-8308486.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-gold" />
                </div>
                <h2 className="font-heading text-navy text-3xl font-semibold mb-4">
                  Registration Confirmed
                </h2>
                <p className="font-body text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
                  Your registration has been confirmed! Please bring <strong>Rs. 20,000</strong> in
                  cash on the day of the workshop. Contact us at 0332-8308486 for any queries.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
