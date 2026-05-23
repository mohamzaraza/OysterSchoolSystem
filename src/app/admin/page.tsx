'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

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

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
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
  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)

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
    if (session) fetchApplications()
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
  }

  async function handleStatusChange(id: string, status: string) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    await supabase.from('applications').update({ status }).eq('id', id)
  }

  // Auth loading
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Spinner light />
      </div>
    )
  }

  // Login screen
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

  // Stats
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

  // Dashboard
  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-body text-gold text-xs tracking-widest uppercase font-semibold">
            Oyster School System
          </p>
          <h1 className="font-heading text-white text-2xl font-semibold mt-0.5">
            Applications Dashboard
          </h1>
        </div>
        <button onClick={handleLogout} className="btn-outline text-xs">
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 rounded-sm shadow-sm px-6 py-5"
            >
              <p className="font-body text-gray-400 text-xs uppercase tracking-widest">{s.label}</p>
              <p className={`font-heading text-5xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
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
              <table className="w-full text-left min-w-[860px]">
                <thead>
                  <tr className="bg-navy">
                    {[
                      'Applicant',
                      'Contact',
                      'Position',
                      'Experience',
                      'Date Applied',
                      'Status',
                      'Resume',
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
                        <p className="font-body font-semibold text-navy text-sm">{app.full_name}</p>
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
                              STATUS_STYLES[app.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'
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
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-gold hover:text-gold-dark transition-colors whitespace-nowrap"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View PDF
                          </a>
                        ) : (
                          <span className="font-body text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
