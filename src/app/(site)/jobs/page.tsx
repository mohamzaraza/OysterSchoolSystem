'use client'

import { useEffect, useState } from 'react'
import { Briefcase, MapPin, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatJobPostedDate, type JobPosting } from '@/types/job-posting'

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setJobs(data)
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
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm py-16 text-center">
            <p className="font-heading text-navy text-2xl font-semibold">No openings right now</p>
            <p className="font-body text-gray-400 text-sm mt-2">
              Please check back soon for new career opportunities.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-100 rounded-sm shadow-sm p-8 hover:border-gold/40 hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-navy text-3xl font-semibold">{job.title}</h2>
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
                <a
                  href={`/apply?position=${encodeURIComponent(job.title)}`}
                  className="btn-primary"
                >
                  Apply Now
                </a>
              </div>
              <p className="font-body text-gray-600 text-sm leading-relaxed mb-4">
                {job.description}
              </p>
              {job.requirements.length > 0 && (
                <div>
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
