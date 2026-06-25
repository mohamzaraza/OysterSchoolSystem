'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { formatJobPostedDate, type JobPosting } from '@/types/job-posting'

type Application = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  position: string
  years_of_experience: number | null
  cover_letter: string | null
  resume_url: string | null
  status: string
}

type AdminTab = 'applications' | 'admissions' | 'summer' | 'jobs'

type AdmissionEnquiry = {
  id: string
  created_at: string
  student_name: string
  level: string
  parent_name: string
  phone: string
  status: string
}

type SummerEnrollment = {
  id: string
  created_at: string
  student_name: string
  grade: string
  parent_name: string
  phone: string
  email: string | null
  preferred_campus: string
  message: string | null
  status: string
}

type JobFormState = {
  title: string
  campus: string
  employment_type: string
  description: string
  requirements: string
}

const emptyJobForm: JobFormState = {
  title: '',
  campus: '',
  employment_type: 'Full Time',
  description: '',
  requirements: '',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
}

const SUMMER_STATUS_STYLES: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
}

const ADMISSION_STATUS_STYLES: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  'Visit Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
}

const inputClass =
  'w-full border border-gray-200 rounded-sm px-4 py-3 font-body text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold transition-colors'

function Spinner({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`w-7 h-7 border-2 rounded-full animate-spin ${
        light ? 'border-white border-t-transparent' : 'border-gold border-t-transparent'
      }`}
    />
  )
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('applications')
  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobForm, setJobForm] = useState<JobFormState>(emptyJobForm)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [jobFormError, setJobFormError] = useState<string | null>(null)
  const [savingJob, setSavingJob] = useState(false)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null)
  const [appDeleteError, setAppDeleteError] = useState<string | null>(null)
  const [viewingCoverLetter, setViewingCoverLetter] = useState<Application | null>(null)
  const [admissions, setAdmissions] = useState<AdmissionEnquiry[]>([])
  const [admissionsLoading, setAdmissionsLoading] = useState(false)
  const [deletingEnquiryId, setDeletingEnquiryId] = useState<string | null>(null)
  const [summerEnrollments, setSummerEnrollments] = useState<SummerEnrollment[]>([])
  const [summerLoading, setSummerLoading] = useState(false)
  const [summerFetchError, setSummerFetchError] = useState<string | null>(null)
  const [deletingSummerId, setDeletingSummerId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthChecked(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchApplications()
      fetchJobPostings()
      fetchAdmissions()
      fetchSummerEnrollments()
    }
  }, [session])

  async function fetchApplications() {
    setAppsLoading(true)
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setApplications(data)
    setAppsLoading(false)
  }

  async function fetchAdmissions() {
    setAdmissionsLoading(true)
    const { data } = await supabase
      .from('admissions')
      .select('id, created_at, student_name, level, parent_name, phone, status')
      .order('created_at', { ascending: false })
    if (data) setAdmissions(data)
    setAdmissionsLoading(false)
  }

  async function handleAdmissionStatusChange(id: string, status: string) {
    setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    await supabase.from('admissions').update({ status }).eq('id', id)
  }

  async function handleDeleteEnquiry(id: string, name: string) {
    if (!window.confirm(`Remove ${name}'s enquiry? This cannot be undone.`)) return

    setDeletingEnquiryId(id)
    const { data, error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', id)
      .select('id')

    if (!error && data?.length) {
      setAdmissions((prev) => prev.filter((a) => a.id !== id))
    }

    setDeletingEnquiryId(null)
  }

  useEffect(() => {
    if (session && activeTab === 'summer') fetchSummerEnrollments()
  }, [session, activeTab])

  async function fetchSummerEnrollments() {
    setSummerLoading(true)
    setSummerFetchError(null)
    const { data, error } = await supabase
      .from('summer_enrollments')
      .select(
        'id, created_at, student_name, grade, parent_name, phone, email, preferred_campus, message, status'
      )
      .order('created_at', { ascending: false })

    if (error) {
      setSummerFetchError(error.message)
      setSummerEnrollments([])
    } else {
      setSummerEnrollments(data ?? [])
    }
    setSummerLoading(false)
  }

  async function handleSummerStatusChange(id: string, status: string) {
    setSummerEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    await supabase.from('summer_enrollments').update({ status }).eq('id', id)
  }

  async function handleDeleteSummer(id: string, name: string) {
    if (!window.confirm(`Remove ${name}'s summer enrollment? This cannot be undone.`)) return

    setDeletingSummerId(id)
    const { data, error } = await supabase
      .from('summer_enrollments')
      .delete()
      .eq('id', id)
      .select('id')

    if (!error && data?.length) {
      setSummerEnrollments((prev) => prev.filter((e) => e.id !== id))
    }
    setDeletingSummerId(null)
  }

  async function fetchJobPostings() {
    setJobsLoading(true)
    const { data } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setJobPostings(data)
    setJobsLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setLoggingIn(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setApplications([])
    setAdmissions([])
    setSummerEnrollments([])
    setJobPostings([])
    setJobForm(emptyJobForm)
    setEditingJobId(null)
  }

  async function handleStatusChange(id: string, status: string) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    await supabase.from('applications').update({ status }).eq('id', id)
  }

  async function handleDeleteApp(id: string, name: string) {
    if (!window.confirm(`Remove ${name}'s application? This cannot be undone.`)) return

    setDeletingAppId(id)
    setAppDeleteError(null)

    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .select('id')

    if (error) {
      setAppDeleteError(`Could not delete application: ${error.message}`)
    } else if (!data?.length) {
      setAppDeleteError(
        'Application was not deleted. Sign in as admin and ensure delete permissions are enabled in Supabase (see supabase/admin_delete_policies.sql).'
      )
    } else {
      setApplications((prev) => prev.filter((a) => a.id !== id))
    }

    setDeletingAppId(null)
  }

  function handleJobFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setJobForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function jobToForm(job: JobPosting): JobFormState {
    return {
      title: job.title,
      campus: job.campus,
      employment_type: job.employment_type,
      description: job.description,
      requirements: job.requirements.join('\n'),
    }
  }

  function parseRequirements(text: string): string[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }

  function handleStartEdit(job: JobPosting) {
    setEditingJobId(job.id)
    setJobForm(jobToForm(job))
    setJobFormError(null)
  }

  function handleCancelEdit() {
    setEditingJobId(null)
    setJobForm(emptyJobForm)
    setJobFormError(null)
  }

  async function handleSaveJob(e: React.FormEvent) {
    e.preventDefault()
    setSavingJob(true)
    setJobFormError(null)

    const payload = {
      title: jobForm.title.trim(),
      campus: jobForm.campus.trim(),
      employment_type: jobForm.employment_type.trim() || 'Full Time',
      description: jobForm.description.trim(),
      requirements: parseRequirements(jobForm.requirements),
    }

    if (editingJobId) {
      const { data, error } = await supabase
        .from('job_postings')
        .update(payload)
        .eq('id', editingJobId)
        .select()
        .single()

      if (error) {
        setJobFormError(error.message)
      } else if (data) {
        setJobPostings((prev) => prev.map((j) => (j.id === editingJobId ? data : j)))
        handleCancelEdit()
      }
    } else {
      const { data, error } = await supabase.from('job_postings').insert(payload).select().single()

      if (error) {
        setJobFormError(error.message)
      } else if (data) {
        setJobPostings((prev) => [data, ...prev])
        setJobForm(emptyJobForm)
      }
    }
    setSavingJob(false)
  }

  async function handleDeleteJob(id: string, title: string) {
    if (!window.confirm(`Remove the job posting "${title}"? This cannot be undone.`)) return

    setDeletingJobId(id)
    const { error } = await supabase.from('job_postings').delete().eq('id', id)
    if (!error) {
      setJobPostings((prev) => prev.filter((j) => j.id !== id))
      if (editingJobId === id) handleCancelEdit()
    }
    setDeletingJobId(null)
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Spinner light />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="bg-white rounded-sm shadow-xl w-full max-w-sm p-10">
          <div className="text-center mb-8">
            <div className="w-10 h-0.5 bg-gold mx-auto mb-5" />
            <h1 className="font-heading text-navy text-4xl font-semibold">Admin Portal</h1>
            <p className="font-body text-gray-400 text-sm mt-1">Oyster School System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="font-body text-navy text-sm font-semibold">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@oysterschool.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-body text-navy text-sm font-semibold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {loginError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total', value: applications.length, color: 'text-navy' },
    {
      label: 'Pending',
      value: applications.filter((a) => a.status === 'pending').length,
      color: 'text-amber-600',
    },
    {
      label: 'Shortlisted',
      value: applications.filter((a) => a.status === 'shortlisted').length,
      color: 'text-emerald-600',
    },
    {
      label: 'Rejected',
      value: applications.filter((a) => a.status === 'rejected').length,
      color: 'text-red-500',
    },
  ]

  const tabClass = (tab: AdminTab) =>
    `font-body text-sm font-semibold px-4 py-2 rounded-sm transition-colors inline-flex items-center gap-1 ${
      activeTab === tab
        ? 'bg-gold text-navy'
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-navy px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-body text-gold text-xs tracking-widest uppercase font-semibold">
            Oyster School System
          </p>
          <h1 className="font-heading text-white text-2xl font-semibold mt-0.5">Admin Portal</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex gap-2">
            <button type="button" onClick={() => setActiveTab('applications')} className={tabClass('applications')}>
              Applications
            </button>
            <button type="button" onClick={() => setActiveTab('admissions')} className={tabClass('admissions')}>
              Admissions
            </button>
            <button type="button" onClick={() => setActiveTab('summer')} className={tabClass('summer')}>
              Summer Enrollments
              {summerEnrollments.filter((e) => e.status === 'New').length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-navy text-gold text-[10px] font-bold">
                  {summerEnrollments.filter((e) => e.status === 'New').length}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setActiveTab('jobs')} className={tabClass('jobs')}>
              Job Postings
            </button>
          </nav>
          <button onClick={handleLogout} className="btn-outline text-xs">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'applications' && (
          <>
            {appDeleteError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3 mb-6">
                {appDeleteError}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-gray-100 rounded-sm shadow-sm px-6 py-5"
                >
                  <p className="font-body text-gray-400 text-xs uppercase tracking-widest">
                    {s.label}
                  </p>
                  <p className={`font-heading text-5xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {appsLoading ? (
              <div className="flex justify-center py-24">
                <Spinner />
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-24 text-center">
                <p className="font-heading text-navy text-3xl font-semibold">No applications yet</p>
                <p className="font-body text-gray-400 text-sm mt-2">
                  Submitted applications will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[980px]">
                    <thead>
                      <tr className="bg-navy">
                        {[
                          'Applicant',
                          'Contact',
                          'Position',
                          'Experience',
                          'Date Applied',
                          'Status',
                          'Cover Letter',
                          'Resume',
                          '',
                        ].map((h) => (
                          <th
                            key={h}
                            className="font-body text-xs tracking-widest uppercase font-semibold text-white px-5 py-4 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-cream/60 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-body font-semibold text-navy text-sm">
                              {app.full_name}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm">{app.email}</p>
                            {app.phone && (
                              <p className="font-body text-gray-400 text-xs mt-0.5">{app.phone}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm whitespace-nowrap">
                              {app.position}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-500 text-sm">
                              {app.years_of_experience != null
                                ? `${app.years_of_experience} yr${app.years_of_experience !== 1 ? 's' : ''}`
                                : '—'}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-body text-gray-500 text-sm">
                              {new Date(app.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative inline-block">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                className={`appearance-none border rounded-sm pl-3 pr-7 py-1.5 font-body text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold transition-colors ${
                                  STATUS_STYLES[app.status] ??
                                  'bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              <svg
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {app.cover_letter ? (
                              <button
                                type="button"
                                onClick={() => setViewingCoverLetter(app)}
                                className="font-body text-xs font-semibold text-gold hover:text-gold-dark transition-colors whitespace-nowrap"
                              >
                                Read letter
                              </button>
                            ) : (
                              <span className="font-body text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {app.resume_url ? (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-gold hover:text-gold-dark transition-colors whitespace-nowrap"
                              >
                                View PDF
                              </a>
                            ) : (
                              <span className="font-body text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteApp(app.id, app.full_name)}
                              disabled={deletingAppId === app.id}
                              title="Remove application"
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                            >
                              <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                                <rect width="10" height="2" rx="1" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'admissions' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total', value: admissions.length, color: 'text-navy' },
                { label: 'New', value: admissions.filter((a) => a.status === 'New').length, color: 'text-blue-600' },
                { label: 'Enrolled', value: admissions.filter((a) => a.status === 'Enrolled').length, color: 'text-emerald-600' },
                { label: 'Rejected', value: admissions.filter((a) => a.status === 'Rejected').length, color: 'text-red-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-sm shadow-sm px-6 py-5">
                  <p className="font-body text-gray-400 text-xs uppercase tracking-widest">{s.label}</p>
                  <p className={`font-heading text-5xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {admissionsLoading ? (
              <div className="flex justify-center py-24">
                <Spinner />
              </div>
            ) : admissions.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-24 text-center">
                <p className="font-heading text-navy text-3xl font-semibold">No enquiries yet</p>
                <p className="font-body text-gray-400 text-sm mt-2">
                  Submitted admissions enquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[860px]">
                    <thead>
                      <tr className="bg-navy">
                        {['Student Name', 'Level', 'Parent Name', 'Phone', 'Date Submitted', 'Status', ''].map((h) => (
                          <th
                            key={h}
                            className="font-body text-xs tracking-widest uppercase font-semibold text-white px-5 py-4 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admissions.map((enq) => (
                        <tr key={enq.id} className="hover:bg-cream/60 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-body font-semibold text-navy text-sm">
                              {enq.student_name}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm whitespace-nowrap">
                              {enq.level}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm">{enq.parent_name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-500 text-sm whitespace-nowrap">
                              {enq.phone}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-body text-gray-500 text-sm">
                              {new Date(enq.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative inline-block">
                              <select
                                value={enq.status}
                                onChange={(e) => handleAdmissionStatusChange(enq.id, e.target.value)}
                                className={`appearance-none border rounded-sm pl-3 pr-7 py-1.5 font-body text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold transition-colors ${
                                  ADMISSION_STATUS_STYLES[enq.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                              >
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Visit Scheduled</option>
                                <option>Enrolled</option>
                                <option>Rejected</option>
                              </select>
                              <svg
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enq.id, enq.student_name)}
                              disabled={deletingEnquiryId === enq.id}
                              title="Remove enquiry"
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                            >
                              <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                                <rect width="10" height="2" rx="1" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'summer' && (
          <>
            <div className="mb-8">
              <h2 className="font-heading text-navy text-3xl font-semibold">Summer Program Enrollments</h2>
              <p className="font-body text-gray-500 text-sm mt-1">
                Students who applied via the summer program form at /summer-program
              </p>
            </div>

            {summerFetchError && (
              <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3 mb-6">
                Could not load summer enrollments: {summerFetchError}. Run{' '}
                <code className="text-xs bg-red-100 px-1 py-0.5">supabase/summer_enrollments.sql</code> in
                the Supabase SQL editor if you have not created the table yet.
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total', value: summerEnrollments.length, color: 'text-navy' },
                { label: 'New', value: summerEnrollments.filter((e) => e.status === 'New').length, color: 'text-blue-600' },
                { label: 'Enrolled', value: summerEnrollments.filter((e) => e.status === 'Enrolled').length, color: 'text-emerald-600' },
                { label: 'Rejected', value: summerEnrollments.filter((e) => e.status === 'Rejected').length, color: 'text-red-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-100 rounded-sm shadow-sm px-6 py-5">
                  <p className="font-body text-gray-400 text-xs uppercase tracking-widest">{s.label}</p>
                  <p className={`font-heading text-5xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {summerLoading ? (
              <div className="flex justify-center py-24">
                <Spinner />
              </div>
            ) : summerEnrollments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-24 text-center">
                <p className="font-heading text-navy text-3xl font-semibold">No summer enrollments yet</p>
                <p className="font-body text-gray-400 text-sm mt-2 max-w-md mx-auto">
                  When parents submit the form at /summer-program, their applications will appear
                  here with student details, contact info, and campus preference.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[1000px]">
                    <thead>
                      <tr className="bg-navy">
                        {[
                          'Student',
                          'Grade / Age',
                          'Parent',
                          'Contact',
                          'Campus',
                          'Message',
                          'Date Applied',
                          'Status',
                          '',
                        ].map((h) => (
                          <th
                            key={h}
                            className="font-body text-xs tracking-widest uppercase font-semibold text-white px-5 py-4 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {summerEnrollments.map((enr) => (
                        <tr key={enr.id} className="hover:bg-cream/60 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-body font-semibold text-navy text-sm">{enr.student_name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm">{enr.grade}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm">{enr.parent_name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-700 text-sm">{enr.phone}</p>
                            {enr.email && (
                              <p className="font-body text-gray-400 text-xs mt-0.5">{enr.email}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body text-gray-500 text-sm whitespace-nowrap">
                              {enr.preferred_campus}
                            </p>
                          </td>
                          <td className="px-5 py-4 max-w-[200px]">
                            <p className="font-body text-gray-500 text-sm line-clamp-3">
                              {enr.message || '—'}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-body text-gray-500 text-sm">
                              {new Date(enr.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative inline-block">
                              <select
                                value={enr.status}
                                onChange={(e) => handleSummerStatusChange(enr.id, e.target.value)}
                                className={`appearance-none border rounded-sm pl-3 pr-7 py-1.5 font-body text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold transition-colors ${
                                  SUMMER_STATUS_STYLES[enr.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
                                }`}
                              >
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Enrolled</option>
                                <option>Rejected</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteSummer(enr.id, enr.student_name)}
                              disabled={deletingSummerId === enr.id}
                              title="Remove enrollment"
                              className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                            >
                              <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                                <rect width="10" height="2" rx="1" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div
              className={`bg-white border rounded-sm shadow-sm p-8 transition-colors ${
                editingJobId ? 'border-gold/50' : 'border-gray-100'
              }`}
            >
              <h2 className="font-heading text-navy text-2xl font-semibold mb-1">
                {editingJobId ? 'Edit Job Posting' : 'Post a New Job'}
              </h2>
              <p className="font-body text-gray-400 text-sm mb-6">
                {editingJobId
                  ? 'Update this posting on the careers page and apply form.'
                  : 'New postings appear on the public careers page and in the apply form.'}
              </p>

              <form onSubmit={handleSaveJob} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-body text-navy text-sm font-semibold">Job Title</label>
                  <input
                    name="title"
                    required
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    placeholder="e.g. Science Teacher"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-body text-navy text-sm font-semibold">Campus</label>
                    <input
                      name="campus"
                      required
                      value={jobForm.campus}
                      onChange={handleJobFormChange}
                      placeholder="e.g. High School Campus"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-body text-navy text-sm font-semibold">
                      Employment Type
                    </label>
                    <input
                      name="employment_type"
                      required
                      value={jobForm.employment_type}
                      onChange={handleJobFormChange}
                      placeholder="Full Time"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-body text-navy text-sm font-semibold">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    value={jobForm.description}
                    onChange={handleJobFormChange}
                    placeholder="Describe the role and what you are looking for…"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-body text-navy text-sm font-semibold">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    rows={5}
                    value={jobForm.requirements}
                    onChange={handleJobFormChange}
                    placeholder="One requirement per line"
                    className={`${inputClass} resize-none`}
                  />
                  <p className="font-body text-xs text-gray-400">Enter each requirement on its own line.</p>
                </div>

                {jobFormError && (
                  <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm px-4 py-3">
                    {jobFormError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={savingJob}
                    className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingJob
                      ? 'Saving…'
                      : editingJobId
                        ? 'Save Changes'
                        : 'Publish Job Posting'}
                  </button>
                  {editingJobId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={savingJob}
                      className="btn-outline flex-1 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h2 className="font-heading text-navy text-2xl font-semibold mb-4">
                Current Postings ({jobPostings.length})
              </h2>

              {jobsLoading ? (
                <div className="flex justify-center py-16">
                  <Spinner />
                </div>
              ) : jobPostings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-16 text-center">
                  <p className="font-heading text-navy text-xl font-semibold">No job postings</p>
                  <p className="font-body text-gray-400 text-sm mt-2">
                    Create a posting to show openings on the careers page.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <div
                      key={job.id}
                      className={`bg-white border rounded-sm shadow-sm p-6 transition-colors ${
                        editingJobId === job.id
                          ? 'border-gold/50 ring-1 ring-gold/20'
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-navy text-xl font-semibold">
                            {job.title}
                          </h3>
                          <p className="font-body text-gray-500 text-sm mt-1">
                            {job.campus} · {job.employment_type} · Posted{' '}
                            {formatJobPostedDate(job.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(job)}
                            disabled={deletingJobId === job.id || savingJob}
                            className="font-body text-xs font-semibold text-navy border border-gray-200 rounded-sm px-3 py-1.5 hover:border-gold/50 hover:bg-cream transition-colors disabled:opacity-50"
                          >
                            {editingJobId === job.id ? 'Editing…' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            disabled={deletingJobId === job.id || savingJob}
                            className="font-body text-xs font-semibold text-red-600 border border-red-200 rounded-sm px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {deletingJobId === job.id ? 'Removing…' : 'Remove'}
                          </button>
                        </div>
                      </div>
                      <p className="font-body text-gray-600 text-sm mt-3 line-clamp-6 whitespace-pre-line">
                        {job.description}
                      </p>
                      {job.requirements.length > 0 && (
                        <p className="font-body text-gray-400 text-xs mt-2">
                          {job.requirements.length} requirement
                          {job.requirements.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {viewingCoverLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
          onClick={() => setViewingCoverLetter(null)}
        >
          <div
            className="bg-white rounded-sm shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="font-body text-gold text-xs tracking-widest uppercase font-semibold">
                Cover Letter
              </p>
              <h3 className="font-heading text-navy text-xl font-semibold mt-1">
                {viewingCoverLetter.full_name}
              </h3>
              <p className="font-body text-gray-500 text-sm mt-0.5">
                {viewingCoverLetter.position}
              </p>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1">
              <p className="font-body text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {viewingCoverLetter.cover_letter}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingCoverLetter(null)}
                className="btn-primary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
