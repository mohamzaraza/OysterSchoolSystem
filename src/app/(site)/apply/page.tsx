'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type FormState = {
  full_name: string
  email: string
  phone: string
  position: string
  years_of_experience: string
  cover_letter: string
}

const initialForm: FormState = {
  full_name: '',
  email: '',
  phone: '',
  position: '',
  years_of_experience: '',
  cover_letter: '',
}

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors'

function ApplyForm() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState<FormState>(initialForm)
  const [positions, setPositions] = useState<string[]>([])
  const [positionsLoading, setPositionsLoading] = useState(true)
  const [resume, setResume] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('job_postings')
      .select('title')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const titles = (data ?? []).map((row) => row.title)
        setPositions(titles)
        const fromUrl = searchParams.get('position')
        if (fromUrl && titles.includes(fromUrl)) {
          setForm((prev) => ({ ...prev, position: fromUrl }))
        }
        setPositionsLoading(false)
      })
  }, [searchParams])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setResume(e.target.files?.[0] ?? null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      let resume_url: string | null = null

      if (resume) {
        const fileName = `${Date.now()}-${resume.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resume, { contentType: 'application/pdf' })

        if (uploadError) throw new Error('Resume upload failed: ' + uploadError.message)

        const { data } = supabase.storage.from('resumes').getPublicUrl(fileName)
        resume_url = data.publicUrl
      }

      const { error: insertError } = await supabase.from('applications').insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        position: form.position,
        years_of_experience: form.years_of_experience ? parseInt(form.years_of_experience) : null,
        cover_letter: form.cover_letter || null,
        resume_url,
      })

      if (insertError) throw new Error(insertError.message)
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
        <div className="bg-white border border-gold/30 rounded-sm p-12 max-w-md w-full text-center shadow-md">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-navy text-4xl font-semibold mb-3">
            Application Submitted
          </h2>
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            Thank you for applying to Oyster School System. We have received your application and
            will be in touch within 5–7 business days.
          </p>
          <a href="/jobs" className="btn-primary inline-block mt-8">
            View Other Positions
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-20 text-center">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Careers
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">Apply Now</h1>
        <p className="font-body text-gray-300 mt-3 max-w-lg mx-auto">
          Join our team and help shape the future of education at Oyster School System.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-sm shadow-sm p-8 md:p-12 space-y-8"
        >
          <div className="space-y-2">
            <label htmlFor="full_name" className="font-body text-navy font-semibold text-sm">
              Full Name <span className="text-gold">*</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="email" className="font-body text-navy font-semibold text-sm">
                Email Address <span className="text-gold">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="font-body text-navy font-semibold text-sm">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 300 0000000"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="font-body text-navy font-semibold text-sm">
              Position Applying For <span className="text-gold">*</span>
            </label>
            {positionsLoading ? (
              <p className="font-body text-gray-400 text-sm">Loading positions…</p>
            ) : positions.length === 0 ? (
              <p className="font-body text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-sm px-4 py-3">
                There are no open positions at the moment. Please check the careers page later.
              </p>
            ) : (
              <div className="relative">
                <select
                  id="position"
                  name="position"
                  required
                  value={form.position}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-10 bg-white`}
                >
                  <option value="" disabled>
                    Select a position
                  </option>
                  {positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="years_of_experience" className="font-body text-navy font-semibold text-sm">
              Years of Experience
            </label>
            <input
              id="years_of_experience"
              name="years_of_experience"
              type="number"
              min="0"
              max="50"
              value={form.years_of_experience}
              onChange={handleChange}
              placeholder="e.g. 3"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cover_letter" className="font-body text-navy font-semibold text-sm">
              Cover Letter
            </label>
            <textarea
              id="cover_letter"
              name="cover_letter"
              rows={6}
              value={form.cover_letter}
              onChange={handleChange}
              placeholder="Tell us about yourself, your teaching philosophy, and why you want to join Oyster School System…"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <span className="font-body text-navy font-semibold text-sm">Resume / CV</span>
            <label
              htmlFor="resume"
              className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-sm px-4 py-8 cursor-pointer transition-colors ${
                resume
                  ? 'border-gold bg-gold/5 text-navy'
                  : 'border-gray-200 hover:border-gold/50 text-gray-500'
              }`}
            >
              <svg
                className="w-5 h-5 text-gold flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="font-body text-sm truncate max-w-xs">
                {resume ? resume.name : 'Upload PDF resume — click to browse'}
              </span>
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFile}
                className="hidden"
              />
            </label>
            <p className="font-body text-xs text-gray-400">PDF files only. Maximum 5 MB.</p>
          </div>

          {error && (
            <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
              {error}
            </p>
          )}

          <div className="border-t border-gold/20" />

          <button
            type="submit"
            disabled={submitting || positions.length === 0}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  )
}
