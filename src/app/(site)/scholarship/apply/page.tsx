'use client'

import { useState } from 'react'
import {
  HeartHandshake,
  Mic,
  Sprout,
  Users,
  CheckCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Scholarship config ──────────────────────────────────────────────────────

type DocColumn =
  | 'death_or_disability_cert_url'
  | 'residence_photo_url'
  | 'single_mother_proof_url'
  | 'report_card_url'
  | 'additional_documents_url'

type ScholarshipDoc = {
  label: string
  column: DocColumn
  hint: string
  required: boolean
}

type ScholarshipOption = {
  value: 'basheer_memorial' | 'asif_jah_bahadur' | 'umeed_e_naseem' | 'almas_asif_sole_grant'
  name: string
  tagline: string
  Icon: typeof HeartHandshake
  accent: { bar: string; iconBg: string; icon: string; ring: string }
  /** Whether to ask for report cards and certificates (skipped for street-connected children). */
  collectsAcademicRecords: boolean
  /** Documents asked for only by this scholarship, each saved to its own column. */
  docs: ScholarshipDoc[]
}

const SCHOLARSHIPS: ScholarshipOption[] = [
  {
    value: 'basheer_memorial',
    name: 'Mohammed Basheer Memorial Opportunity Scholarship',
    tagline: 'For students facing the loss or disability of a primary earner',
    Icon: HeartHandshake,
    accent: { bar: 'bg-blue-400', iconBg: 'bg-blue-50', icon: 'text-blue-500', ring: 'ring-blue-400' },
    collectsAcademicRecords: true,
    docs: [
      {
        label: 'Death Certificate or Disability Certificate',
        column: 'death_or_disability_cert_url',
        hint: 'Upload the death certificate or the disability certificate of the primary earner.',
        required: true,
      },
    ],
  },
  {
    value: 'asif_jah_bahadur',
    name: 'Asif Jah Bahadur Excellence & Oratory Scholarship',
    tagline: "For the school's brightest thought-leaders and communicators",
    Icon: Mic,
    accent: { bar: 'bg-amber-400', iconBg: 'bg-amber-50', icon: 'text-amber-600', ring: 'ring-amber-400' },
    collectsAcademicRecords: true,
    docs: [],
  },
  {
    value: 'umeed_e_naseem',
    name: 'Umeed e Naseem Scholarship Program',
    tagline: 'A radical inclusion program for street-connected and destitute children',
    Icon: Sprout,
    accent: { bar: 'bg-emerald-400', iconBg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-400' },
    collectsAcademicRecords: false,
    docs: [
      {
        label: 'Picture of Current Residence',
        column: 'residence_photo_url',
        hint: 'Upload a clear photo of the child’s current place of residence.',
        required: true,
      },
    ],
  },
  {
    value: 'almas_asif_sole_grant',
    name: 'Almas Asif Sole Grant Scholarship Program',
    tagline:
      'Supporting single mothers with limited financial means to give their children access to quality education',
    Icon: Users,
    accent: { bar: 'bg-purple-300', iconBg: 'bg-purple-50', icon: 'text-purple-500', ring: 'ring-purple-300' },
    // Report cards are collected below as a single optional upload, so the
    // shared academic-records block is skipped.
    collectsAcademicRecords: false,
    docs: [
      {
        label: 'Proof of Single Mother Status',
        column: 'single_mother_proof_url',
        hint: 'Upload a divorce certificate, court document, or any official document proving single mother status.',
        required: true,
      },
      {
        label: 'Student Report Card',
        column: 'report_card_url',
        hint: 'Upload the most recent report card if available.',
        required: false,
      },
      {
        label: 'Additional Supporting Documents',
        column: 'additional_documents_url',
        hint: 'Upload any additional documents that support your application such as financial statements, affidavits, or other relevant proof.',
        required: false,
      },
    ],
  },
]

/** Converts a Pakistani-format date (DD/MM/YYYY) to ISO (YYYY-MM-DD); null if invalid. */
function pkDateToISO(value: string): string | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, dd, mm, yyyy] = match
  const day = Number(dd)
  const month = Number(mm)
  const year = Number(yyyy)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return `${yyyy}-${mm}-${dd}`
}

const STEP_LABELS = ['Scholarship', 'Student Info', 'Guardian Info', 'Documents', 'About Child', 'Contact']
const STORAGE_BUCKET = 'scholarship-documents'
const FILE_ACCEPT = 'image/*,application/pdf,.pdf'

// ── Form state ──────────────────────────────────────────────────────────────

type FormState = {
  student_name: string
  father_name: string
  mother_name: string
  date_of_birth: string
  grade: string
  campus: string
  current_school: string
  guardian_name: string
  relationship: string
  guardian_phone: string
  eligibility_description: string
  email: string
  address: string
}

const initialForm: FormState = {
  student_name: '',
  father_name: '',
  mother_name: '',
  date_of_birth: '',
  grade: '',
  campus: '',
  current_school: '',
  guardian_name: '',
  relationship: '',
  guardian_phone: '',
  eligibility_description: '',
  email: '',
  address: '',
}

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors bg-white'
const labelClass = 'font-body text-navy text-sm font-semibold'

// ── File field ──────────────────────────────────────────────────────────────

// ── Multi-file field ────────────────────────────────────────────────────────

function MultiFileField({
  label,
  files,
  onChange,
  hint,
  required = false,
}: {
  label: string
  files: File[]
  onChange: (files: File[]) => void
  hint?: string
  required?: boolean
}) {
  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = e.target.files ? Array.from(e.target.files) : []
    if (incoming.length > 0) {
      // Append to whatever is already selected, skipping exact duplicates.
      const merged = [...files]
      for (const file of incoming) {
        const isDuplicate = merged.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        )
        if (!isDuplicate) merged.push(file)
      }
      onChange(merged)
    }
    // Reset so selecting the same file again (or re-opening) still fires onChange.
    e.target.value = ''
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <span className={labelClass}>
        {label} {required && <span className="text-gold">*</span>}
      </span>
      <label
        className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-sm px-4 py-8 cursor-pointer transition-colors ${
          files.length > 0
            ? 'border-gold bg-gold/5 text-navy'
            : 'border-gray-200 hover:border-gold/50 text-gray-500'
        }`}
      >
        <Upload size={18} className="text-gold flex-shrink-0" />
        <span className="font-body text-sm truncate max-w-xs">
          {files.length > 0
            ? 'Add more files — click to select'
            : 'Click to upload — you can add one or more files'}
        </span>
        <input
          type="file"
          accept={FILE_ACCEPT}
          multiple
          onChange={handleAdd}
          className="hidden"
        />
      </label>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${f.size}-${f.lastModified}-${i}`}
              className="flex items-center justify-between gap-3 bg-cream rounded-sm px-3 py-2"
            >
              <span className="font-body text-xs text-gray-600 truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove ${f.name}`}
                className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {hint && <p className="font-body text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ── Stepper ─────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-8">
      {/* Mobile: compact bar */}
      <div className="sm:hidden">
        <p className="font-body text-xs text-gray-400 font-semibold uppercase tracking-widest">
          Step {step} of {STEP_LABELS.length}
        </p>
        <p className="font-heading text-navy text-xl font-semibold mt-0.5">
          {STEP_LABELS[step - 1]}
        </p>
        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${(step / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: circles + connectors */}
      <div className="hidden sm:flex items-center gap-0">
        {STEP_LABELS.map((label, i) => {
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
                  className={`font-body text-[10px] mt-1.5 font-semibold whitespace-nowrap ${
                    active ? 'text-navy' : done ? 'text-gold' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: done ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ScholarshipApplyPage() {
  const [step, setStep] = useState(1)
  const [scholarshipType, setScholarshipType] = useState<ScholarshipOption['value'] | ''>('')
  const [form, setForm] = useState<FormState>(initialForm)
  const [guardianIds, setGuardianIds] = useState<File[]>([])
  const [reportCards, setReportCards] = useState<File[]>([])
  const [certificates, setCertificates] = useState<File[]>([])
  const [docFiles, setDocFiles] = useState<Partial<Record<DocColumn, File[]>>>({})
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [declaration, setDeclaration] = useState(false)

  const [stepError, setStepError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selected = SCHOLARSHIPS.find((s) => s.value === scholarshipType) ?? null
  const isAlmasAsif = selected?.value === 'almas_asif_sole_grant'

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function selectScholarship(value: ScholarshipOption['value']) {
    setScholarshipType(value)
    // The Sole Grant never asks about the father, so drop anything already
    // entered about him rather than carrying it over from another scholarship.
    if (value === 'almas_asif_sole_grant') {
      setForm((prev) => ({
        ...prev,
        father_name: '',
        relationship: prev.relationship === 'Father' ? '' : prev.relationship,
      }))
    }
  }

  function goNext() {
    setStepError(null)
    setStep((s) => Math.min(s + 1, STEP_LABELS.length))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setStepError(null)
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDobChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    let formatted = digits
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    setForm((prev) => ({ ...prev, date_of_birth: formatted }))
  }

  function continueFromStudent(e: React.FormEvent) {
    e.preventDefault()
    if (!pkDateToISO(form.date_of_birth)) {
      setStepError('Please enter the date of birth in DD/MM/YYYY format (e.g. 05/03/2014).')
      return
    }
    goNext()
  }

  function continueFromGuardian(e: React.FormEvent) {
    e.preventDefault()
    if (guardianIds.length === 0) {
      setStepError('Please upload the guardian’s ID card to continue.')
      return
    }
    goNext()
  }

  function continueFromDocuments(e: React.FormEvent) {
    e.preventDefault()
    const missing = (selected?.docs ?? []).find(
      (doc) => doc.required && (docFiles[doc.column]?.length ?? 0) === 0
    )
    if (missing) {
      setStepError(`Please upload the required document: ${missing.label}.`)
      return
    }
    goNext()
  }

  function continueFromAbout(e: React.FormEvent) {
    e.preventDefault()
    goNext()
  }

  async function uploadFile(file: File, folder: string): Promise<string> {
    const safeName = file.name.replace(/\s+/g, '_')
    const path = `${folder}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file)
    if (uploadError) throw new Error(`${folder} upload failed: ${uploadError.message}`)
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function uploadFiles(files: File[], folder: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      urls.push(await uploadFile(file, folder))
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || guardianIds.length === 0) return

    setSubmitting(true)
    setError(null)

    try {
      const guardian_id_url = await uploadFiles(guardianIds, 'guardian-id')

      // Academic records & certificates — only for scholarships that collect them.
      let academic_records: string[] = []
      let certificates_url: string[] = []
      if (selected.collectsAcademicRecords) {
        academic_records = await uploadFiles(reportCards, 'academic-records')
        certificates_url = await uploadFiles(certificates, 'certificates')
      }

      // Scholarship-specific documents → each into its own mapped column. Columns
      // belonging to other scholarships stay empty.
      const docUrls: Record<DocColumn, string[]> = {
        death_or_disability_cert_url: [],
        residence_photo_url: [],
        single_mother_proof_url: [],
        report_card_url: [],
        additional_documents_url: [],
      }
      for (const doc of selected.docs) {
        const files = docFiles[doc.column] ?? []
        if (files.length > 0) {
          docUrls[doc.column] = await uploadFiles(files, doc.column)
        }
      }

      // Supporting documents at the end — optional, multiple.
      const supporting_documents = await uploadFiles(supportingDocs, 'supporting-documents')

      const { error: insertError } = await supabase.from('scholarship_applications').insert({
        scholarship_type: selected.value,
        student_name: form.student_name.trim(),
        father_name: isAlmasAsif ? null : form.father_name.trim(),
        mother_name: form.mother_name.trim(),
        date_of_birth: pkDateToISO(form.date_of_birth),
        grade_applying_for: form.grade.trim(),
        campus: form.campus,
        current_school: form.current_school.trim() || null,
        guardian_name: form.guardian_name.trim(),
        relationship: form.relationship,
        guardian_phone: form.guardian_phone.trim(),
        guardian_id_url,
        academic_records,
        certificates_url,
        ...docUrls,
        supporting_documents,
        eligibility_description: form.eligibility_description.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      })

      if (insertError) throw new Error(insertError.message)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (submitted && selected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 py-20">
        <div className="bg-white border border-gold/30 rounded-sm p-12 max-w-lg w-full text-center shadow-md">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-gold" />
          </div>
          <h2 className="font-heading text-navy text-3xl md:text-4xl font-semibold mb-4">
            Application Received
          </h2>
          <p className="font-body text-gray-500 text-base leading-relaxed">
            Thank you for applying to the {selected.name}. Our team will review your application and
            contact you to schedule an interview if shortlisted.
          </p>
          <a href="/scholarship" className="btn-primary inline-block mt-8">
            Back to Scholarships
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-navy py-16 text-center px-4">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Financial Aid
        </p>
        <h1 className="font-heading text-white text-4xl md:text-5xl font-semibold">
          Scholarship Application
        </h1>
        <p className="font-body text-gray-300 mt-3 max-w-xl mx-auto text-sm md:text-base">
          Complete the steps below. Our team reviews every application and contacts shortlisted
          families for an interview.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <Stepper step={step} />

        {/* ── Step 1 — Choose Scholarship ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Choose a Scholarship</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                Select the program you would like to apply for. This determines the documents we ask
                for later.
              </p>
            </div>

            <div className="space-y-4">
              {SCHOLARSHIPS.map((s) => {
                const isSelected = scholarshipType === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => selectScholarship(s.value)}
                    className={`w-full text-left bg-white rounded-sm border overflow-hidden flex items-stretch transition-all duration-200 ${
                      isSelected
                        ? `border-transparent ring-2 ${s.accent.ring} shadow-md`
                        : 'border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-1.5 ${s.accent.bar}`} />
                    <div className="flex items-start gap-4 p-5 flex-1">
                      <div
                        className={`w-11 h-11 rounded-sm flex items-center justify-center flex-shrink-0 ${s.accent.iconBg}`}
                      >
                        <s.Icon size={20} className={s.accent.icon} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-navy text-lg font-semibold leading-snug">
                          {s.name}
                        </h3>
                        <p className="font-body text-gray-500 text-sm mt-1">{s.tagline}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-gold bg-gold' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <CheckCircle size={14} className="text-navy" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!scholarshipType}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Step 2 — Student Info ────────────────────────────── */}
        {step === 2 && (
          <form
            onSubmit={continueFromStudent}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-5"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Student Information</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                Tell us about the student applying for the scholarship.
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

            {/* The Almas Asif Sole Grant is for children of single mothers, so the
                father is never asked about. */}
            <div className={`grid grid-cols-1 gap-4 ${isAlmasAsif ? '' : 'sm:grid-cols-2'}`}>
              {!isAlmasAsif && (
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Father&apos;s Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="father_name"
                    required
                    value={form.father_name}
                    onChange={handleChange}
                    placeholder="Father's full name"
                    className={inputClass}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Mother&apos;s Name <span className="text-gold">*</span>
                </label>
                <input
                  name="mother_name"
                  required
                  value={form.mother_name}
                  onChange={handleChange}
                  placeholder="Mother's full name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Date of Birth <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  name="date_of_birth"
                  required
                  inputMode="numeric"
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  value={form.date_of_birth}
                  onChange={handleDobChange}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Grade Applying For <span className="text-gold">*</span>
                </label>
                <input
                  name="grade"
                  required
                  value={form.grade}
                  onChange={handleChange}
                  placeholder="e.g. Grade 6"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Campus <span className="text-gold">*</span>
              </label>
              <select
                name="campus"
                required
                value={form.campus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="" disabled>
                  Select campus
                </option>
                <option>Early Years Campus</option>
                <option>High School Campus</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Current / Last School Attended</label>
              <input
                name="current_school"
                value={form.current_school}
                onChange={handleChange}
                placeholder="Leave blank if none"
                className={inputClass}
              />
              <p className="font-body text-xs text-gray-400">
                Optional — the student&apos;s most recent school or form of education, if any.
              </p>
            </div>

            {stepError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {stepError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-outline flex-1 inline-flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3 — Guardian Info ───────────────────────────── */}
        {step === 3 && (
          <form
            onSubmit={continueFromGuardian}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-5"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Guardian Information</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                Details of the parent or guardian completing this application.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Guardian Full Name <span className="text-gold">*</span>
              </label>
              <input
                name="guardian_name"
                required
                value={form.guardian_name}
                onChange={handleChange}
                placeholder="e.g. Ali Hassan"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Relationship to Student <span className="text-gold">*</span>
                </label>
                <select
                  name="relationship"
                  required
                  value={form.relationship}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select relationship
                  </option>
                  {!isAlmasAsif && <option>Father</option>}
                  <option>Mother</option>
                  <option>Guardian</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Guardian Phone Number <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  name="guardian_phone"
                  required
                  value={form.guardian_phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className={inputClass}
                />
              </div>
            </div>

            <MultiFileField
              label="Guardian's ID Card"
              required
              files={guardianIds}
              onChange={setGuardianIds}
              hint="Upload clear photos or scans of the guardian's CNIC. You can add multiple files (e.g. front and back)."
            />

            {stepError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {stepError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-outline flex-1 inline-flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 4 — Academic Records & Documents ────────────── */}
        {step === 4 && selected && (
          <form
            onSubmit={continueFromDocuments}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-6"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">
                {selected.collectsAcademicRecords ? 'Academic Records & Documents' : 'Documents'}
              </h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                Upload the documents below. Images or PDFs are accepted.
              </p>
            </div>

            {selected.collectsAcademicRecords && (
              <>
                {/* Academic records */}
                <MultiFileField
                  label="Academic Records (Report Cards)"
                  files={reportCards}
                  onChange={setReportCards}
                  hint="Upload the student's report cards from the past 5 years — select all of them together. Upload as many as you have available."
                />

                {/* Certificates */}
                <div className="border-t border-gray-100 pt-6">
                  <MultiFileField
                    label="Certificates (if any)"
                    files={certificates}
                    onChange={setCertificates}
                    hint="Optional — upload any achievement, academic, sports, or oratory certificates. Multiple files allowed."
                  />
                </div>
              </>
            )}

            {/* Scholarship-specific documents */}
            {selected.docs.length > 0 && (
              <div className={selected.collectsAcademicRecords ? 'border-t border-gray-100 pt-6' : ''}>
                <p className="font-body text-[11px] uppercase tracking-[0.16em] text-gold font-semibold mb-3">
                  For the {selected.name}
                </p>
                <div className="space-y-6">
                  {selected.docs.map((doc) => (
                    <MultiFileField
                      key={doc.column}
                      label={doc.label}
                      required={doc.required}
                      files={docFiles[doc.column] ?? []}
                      onChange={(files) =>
                        setDocFiles((prev) => ({ ...prev, [doc.column]: files }))
                      }
                      hint={`${doc.required ? '' : 'Optional — '}${doc.hint} You can upload multiple files.`}
                    />
                  ))}
                </div>
              </div>
            )}

            {stepError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {stepError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-outline flex-1 inline-flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 5 — Tell Us About Your Child ────────────────── */}
        {step === 5 && (
          <form
            onSubmit={continueFromAbout}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-5"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">
                Tell Us About Your Child
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                {isAlmasAsif
                  ? 'Please describe your situation and why you need this grant (250 words)'
                  : 'Why does your child deserve this scholarship?'}{' '}
                <span className="text-gold">*</span>
              </label>
              <textarea
                name="eligibility_description"
                required
                rows={8}
                value={form.eligibility_description}
                onChange={handleChange}
                placeholder={
                  isAlmasAsif ? 'Share your situation…' : "Share your child's story…"
                }
                className={`${inputClass} resize-none`}
              />
              <p className="font-body text-xs text-gray-400">
                {isAlmasAsif ? (
                  <>
                    Explain your circumstances as a single mother and how this grant will impact your
                    child&apos;s education. Written by parent or guardian.
                  </>
                ) : (
                  <>
                    Please share your child&apos;s situation in your own words (around 200 words).
                    This should be filled out by the parent or guardian.
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={goBack} className="btn-outline flex-1 inline-flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 6 — Contact & Submit ────────────────────────── */}
        {step === 6 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-5"
          >
            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold">Contact &amp; Submit</h2>
              <p className="font-body text-gray-400 text-sm mt-1">
                How can we reach you about this application?
              </p>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Email Address <span className="text-gold">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="parent@email.com"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Home Address <span className="text-gold">*</span>
              </label>
              <textarea
                name="address"
                required
                rows={3}
                value={form.address}
                onChange={handleChange}
                placeholder="House #, street, area, city"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <MultiFileField
                label="Supporting Documents (if needed)"
                files={supportingDocs}
                onChange={setSupportingDocs}
                hint="Optional — attach any other documents that support this application."
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4 accent-gold flex-shrink-0"
              />
              <span className="font-body text-sm text-gray-600 leading-relaxed">
                I confirm that the information provided is accurate to the best of my knowledge.
              </span>
            </label>

            {error && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                disabled={submitting}
                className="btn-outline flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
