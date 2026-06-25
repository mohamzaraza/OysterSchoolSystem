'use client'

import { useState } from 'react'
import { CheckCircle, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { POSTERS } from '@/lib/posters'
import { PosterImage } from '@/components/PosterImage'

type SummerForm = {
  student_name: string
  grade: string
  parent_name: string
  phone: string
  email: string
  preferred_campus: string
  message: string
}

const initialForm: SummerForm = {
  student_name: '',
  grade: '',
  parent_name: '',
  phone: '',
  email: '',
  preferred_campus: '',
  message: '',
}

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors bg-white'
const labelClass = 'font-body text-navy text-sm font-semibold'

export default function SummerProgramPage() {
  const [form, setForm] = useState<SummerForm>(initialForm)
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
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('summer_enrollments').insert({
      student_name: form.student_name.trim(),
      grade: form.grade.trim(),
      parent_name: form.parent_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      preferred_campus: form.preferred_campus,
      message: form.message.trim() || null,
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-navy py-16 text-center px-4">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Summer 2026
        </p>
        <h1 className="font-heading text-white text-4xl md:text-5xl font-semibold">
          Oyster Summer School Program
        </h1>
        <p className="font-body text-gray-300 mt-3 max-w-2xl mx-auto text-sm md:text-base">
          Strengthen foundational skills and bridge learning gaps — give your child a confident
          headstart for the new academic year.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
              <PosterImage
                src={POSTERS.summerProgram}
                alt="Oyster School System Summer School Program — Enrol Now"
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="bg-navy rounded-sm p-6 text-white">
              <p className="font-heading text-gold text-lg font-semibold mb-2">Need help?</p>
              <p className="font-body text-gray-300 text-sm mb-4">
                Call us for more information about the summer program.
              </p>
              <a
                href="tel:+923328308486"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-gold hover:text-white transition-colors"
              >
                <Phone size={16} />
                +92 332 830 8486
              </a>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-gold" />
                </div>
                <h2 className="font-heading text-navy text-3xl font-semibold mb-4">
                  Enrollment Received
                </h2>
                <p className="font-body text-gray-500 text-base leading-relaxed">
                  Thank you for enrolling in the Oyster Summer School Program. Our team will contact
                  you shortly with next steps.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-5"
              >
                <div>
                  <h2 className="font-heading text-navy text-2xl font-semibold">Enrol Now</h2>
                  <p className="font-body text-gray-400 text-sm mt-1">
                    Complete the form and we will be in touch within 2 working days.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Student Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="student_name"
                    required
                    value={form.student_name}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed Ali"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Current Grade / Age <span className="text-gold">*</span>
                  </label>
                  <input
                    name="grade"
                    required
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="e.g. Grade 4 / 9 years"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Parent / Guardian Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="parent_name"
                    required
                    value={form.parent_name}
                    onChange={handleChange}
                    placeholder="e.g. Ali Hassan"
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
                      placeholder="parent@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Preferred Campus <span className="text-gold">*</span>
                  </label>
                  <select
                    name="preferred_campus"
                    required
                    value={form.preferred_campus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select campus
                    </option>
                    <option>Early Years Campus — Block D</option>
                    <option>High School Campus — Block C</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Additional Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Any questions or special requirements…"
                    className={`${inputClass} resize-none`}
                  />
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
                  {submitting ? 'Submitting…' : 'Submit Enrollment'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
