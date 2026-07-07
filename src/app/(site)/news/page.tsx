'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { POSTERS } from '@/lib/posters'
import { PosterImage } from '@/components/PosterImage'

const EASE = [0.22, 1, 0.36, 1] as const

export default function NewsPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-navy py-20 text-center px-4">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Stay Informed
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">
          News &amp; Events
        </h1>
        <p className="font-body text-gray-300 mt-4 max-w-2xl mx-auto text-base md:text-lg">
          Stay up to date with the latest from Oyster School System
        </p>
      </div>

      {/* Event Card */}
      <div className="max-w-[600px] mx-auto px-4 py-16">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 44 }}
          animate={cardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Label tag */}
            <span className="inline-block bg-gold/10 text-gold font-body text-xs tracking-widest uppercase font-semibold px-4 py-1.5 rounded-full mb-6">
              Upcoming Event
            </span>

            {/* Poster */}
            <div className="border-2 border-gold rounded-sm shadow-2xl overflow-hidden bg-white w-full">
              <PosterImage
                src={POSTERS.upcomingTraining}
                alt="School Leadership in Action — Workshop"
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* Details */}
            <h2 className="font-heading text-navy text-2xl md:text-3xl font-semibold mt-8">
              School Leadership in Action — Workshop
            </h2>

            <div className="mt-5 space-y-2.5 font-body text-gray-600 text-sm md:text-base">
              <p className="flex items-center justify-center gap-2">
                <Calendar size={18} className="text-gold shrink-0" />
                24–25 July 2026
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock size={18} className="text-gold shrink-0" />
                9:00 AM – 2:00 PM
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin size={18} className="text-gold shrink-0" />
                Oyster School System, Islamabad
              </p>
            </div>

            <Link href="/news/workshop-registration" className="btn-primary mt-8">
              Register Now
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
