'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

type StudentForm = {
  student_name: string
  date_of_birth: string
  gender: string
  level: string
  class: string
  previous_school: string
}

type ParentForm = {
  parent_name: string
  relationship: string
  phone: string
  email: string
  preferred_campus: string
  heard_from: string
}

const initialStudent: StudentForm = {
  student_name: '',
  date_of_birth: '',
  gender: '',
  level: '',
  class: '',
  previous_school: '',
}

const initialParent: ParentForm = {
  parent_name: '',
  relationship: '',
  phone: '',
  email: '',
  preferred_campus: '',
  heard_from: '',
}

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors bg-white'
const labelClass = 'font-body text-navy text-sm font-semibold'

const LEVELS = ['Early Years', 'Junior Level', 'Secondary Level', 'Higher Secondary']

const STEPS = ['Student Info', 'Parent Info']

export default function AdmissionsPage() {
  const [step, setStep] = useState(1)
  const [student, setStudent] = useState<StudentForm>(initialStudent)
  const [parent, setParent] = useState<ParentForm>(initialParent)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleStudentChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleParentChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setParent((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error } = await supabase.from('admissions').insert({
      student_name: student.student_name,
      date_of_birth: student.date_of_birth || null,
      gender: student.gender,
      level: student.level,
      class: student.class,
      previous_school: student.previous_school || null,
      parent_name: parent.parent_name,
      relationship: parent.relationship,
      phone: parent.phone,
      email: parent.email || null,
      preferred_campus: parent.preferred_campus,
      heard_from: parent.heard_from,
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setStep(3)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-navy py-20 text-center">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Admissions 2026
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">
          Enquire Now
        </h1>
        <p className="font-body text-gray-300 mt-3 max-w-lg mx-auto">
          Fill in your details and our team will be in touch within 2 working days.
        </p>
      </div>

      <div className="bg-cream py-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">

          {/* Progress bar — steps 1 & 2 only */}
          {step < 3 && (
            <div className="mb-10">
              <div className="flex items-center gap-0 mb-4">
                {STEPS.map((label, i) => {
                  const num = i + 1
                  const done = step > num
                  const active = step === num
                  return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-all duration-300 ${
                            done
                              ? 'bg-gold text-navy'
                              : active
                              ? 'bg-navy text-white ring-2 ring-gold ring-offset-2 ring-offset-cream'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {done ? '✓' : num}
                        </div>
                        <span
                          className={`font-body text-xs mt-1.5 font-semibold whitespace-nowrap ${
                            active ? 'text-navy' : done ? 'text-gold' : 'text-gray-400'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-0.5 mx-3 mb-5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold transition-all duration-500"
                            style={{ width: step > 1 ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 1: Student Info ── */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setStep(2)
              }}
              className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div>
                <h2 className="font-heading text-navy text-2xl font-semibold">
                  Student Information
                </h2>
                <p className="font-body text-gray-400 text-sm mt-1">
                  Tell us about the student applying.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Student Full Name <span className="text-gold">*</span>
                </label>
                <input
                  name="student_name"
                  required
                  value={student.student_name}
                  onChange={handleStudentChange}
                  placeholder="e.g. Ahmed Ali"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Date of Birth <span className="text-gold">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    value={student.date_of_birth}
                    onChange={handleStudentChange}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Gender <span className="text-gold">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    value={student.gender}
                    onChange={handleStudentChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Level Applying For <span className="text-gold">*</span>
                  </label>
                  <select
                    name="level"
                    required
                    value={student.level}
                    onChange={handleStudentChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Specific Class <span className="text-gold">*</span>
                  </label>
                  <input
                    name="class"
                    required
                    value={student.class}
                    onChange={handleStudentChange}
                    placeholder="e.g. Grade 3 / EYR"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Previous School Name</label>
                <input
                  name="previous_school"
                  value={student.previous_school}
                  onChange={handleStudentChange}
                  placeholder="Leave blank if none"
                  className={inputClass}
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Continue to Parent Info →
              </button>
            </form>
          )}

          {/* ── Step 2: Parent Info ── */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div>
                <h2 className="font-heading text-navy text-2xl font-semibold">
                  Parent / Guardian Information
                </h2>
                <p className="font-body text-gray-400 text-sm mt-1">
                  We&apos;ll use these details to contact you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Parent Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="parent_name"
                    required
                    value={parent.parent_name}
                    onChange={handleParentChange}
                    placeholder="e.g. Ali Hassan"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Relationship <span className="text-gold">*</span>
                  </label>
                  <select
                    name="relationship"
                    required
                    value={parent.relationship}
                    onChange={handleParentChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select relationship
                    </option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                  </select>
                </div>
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
                    value={parent.phone}
                    onChange={handleParentChange}
                    placeholder="+92 300 1234567"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={parent.email}
                    onChange={handleParentChange}
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
                  value={parent.preferred_campus}
                  onChange={handleParentChange}
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
                <label className={labelClass}>
                  How did you hear about us? <span className="text-gold">*</span>
                </label>
                <select
                  name="heard_from"
                  required
                  value={parent.heard_from}
                  onChange={handleParentChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option>Google</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                </select>
              </div>

              {error && (
                <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting…' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-gold" />
              </div>
              <h2 className="font-heading text-navy text-3xl font-semibold mb-4">
                Enquiry Received
              </h2>
              <p className="font-body text-gray-500 text-base leading-relaxed max-w-md mx-auto">
                Thank you for your interest in Oyster School System. Your enquiry has been received
                and a school representative will contact you within 2 working days.
              </p>
              <div className="w-12 h-0.5 bg-gold mx-auto mt-8" />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
