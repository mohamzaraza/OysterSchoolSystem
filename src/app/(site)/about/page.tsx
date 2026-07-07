'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { POSTERS } from '@/lib/posters'
import { PosterImage } from '@/components/PosterImage'

const EASE = [0.22, 1, 0.36, 1] as const

export default function AboutPage() {
  const posterRef = useRef<HTMLDivElement>(null)
  const posterInView = useInView(posterRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-navy py-20 text-center">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Who We Are
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">About Us</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-heading text-navy text-4xl font-semibold mb-6">
          A School Built on Purpose
        </h2>
        <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
          Oyster School System was founded with a clear and singular purpose: to prepare young
          Pakistanis not just for exams, but for life. We believe that education must evolve to
          meet the demands of a rapidly changing world.
        </p>
        <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
          With two campuses in the PWD area of Islamabad — one dedicated to Early Years education
          and one to High School — we provide a seamless, consistent learning journey from a child's
          first classroom experience to their final year of school.
        </p>
        <p className="font-body text-gray-600 text-lg leading-relaxed">
          Our approach combines academic rigour with practical, skills-based learning. We nurture
          curiosity, reward creativity, and hold every student to the belief that they are capable
          of extraordinary things.
        </p>
      </div>

      {/* Why Oyster Poster */}
      <div className="bg-cream py-16">
        <motion.div
          ref={posterRef}
          initial={{ opacity: 0, y: 44 }}
          animate={posterInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-[600px] mx-auto px-4 flex flex-col items-center text-center"
        >
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-6">
            Why Choose Oyster?
          </p>

          <div className="border-2 border-gold rounded-sm shadow-2xl overflow-hidden bg-white">
            <PosterImage
              src={POSTERS.whyOyster}
              alt="Why choose Oyster School System"
              className="w-full h-auto object-contain"
            />
          </div>

          <Link href="/admissions" className="btn-primary mt-8">
            Apply Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
