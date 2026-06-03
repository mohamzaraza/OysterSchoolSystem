'use client'

import { useEffect, useState } from 'react'
import { Briefcase, MapPin, Clock, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatJobPostedDate, type JobPosting } from '@/types/job-posting'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setFetchError(error.message)
        else setJobs(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen">
      <div className="bg-navy py-20 text-center">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Join Our Team
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">
          Career Opportunities
        </h1>
        <p className="font-body text-gray-300 mt-3 max-w-lg mx-auto">
          Help us shape the next generation of thinkers, leaders, and innovators.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="bg-white border border-red-100 rounded-sm shadow-sm py-16 text-center px-6">
            <p className="font-heading text-navy text-2xl font-semibold">Unable to load openings</p>
            <p className="font-body text-gray-500 text-sm mt-2 max-w-md mx-auto">
              The careers list could not be loaded. If you manage the site, run the grant lines in{' '}
              <code className="text-xs bg-gray-100 px-1 py-0.5">supabase/job_postings.sql</code> in
              the Supabase SQL editor.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-16 text-center">
            <p className="font-heading text-navy text-2xl font-semibold">No openings right now</p>
            <p className="font-body text-gray-400 text-sm mt-2">
              Please check back soon for new career opportunities.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const isOpen = expandedId === job.id
            return (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-sm shadow-sm hover:border-gold/40 hover:shadow-md transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : job.id)}
                  className="w-full text-left px-8 py-6 flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <h2 className="font-heading text-navy text-2xl font-semibold">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 font-body text-sm text-gray-500">
                        <MapPin size={14} className="text-gold" /> {job.campus}
                      </span>
                      <span className="flex items-center gap-1 font-body text-sm text-gray-500">
                        <Briefcase size={14} className="text-gold" /> {job.employment_type}
                      </span>
                      <span className="flex items-center gap-1 font-body text-sm text-gray-500">
                        <Clock size={14} className="text-gold" /> Posted{' '}
                        {formatJobPostedDate(job.created_at)}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gold flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-8 pb-8 border-t border-gray-100 pt-6">
                    <p className="font-body text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {job.description}
                    </p>
                    {job.requirements.length > 0 && (
                      <div className="mb-6">
                        <p className="font-body text-navy font-semibold text-sm mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="font-body text-gray-500 text-sm flex items-start gap-2">
                              <span className="text-gold mt-1">✓</span> {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <a
                      href={`/apply?position=${encodeURIComponent(job.title)}`}
                      className="btn-primary inline-block"
                    >
                      Apply Now
                    </a>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
