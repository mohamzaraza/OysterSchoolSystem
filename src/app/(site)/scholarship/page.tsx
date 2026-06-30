"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  HeartHandshake,
  Mic,
  Sprout,
  Award,
  ClipboardCheck,
  X,
  ArrowRight,
  Mail,
  Maximize2,
} from "lucide-react";
import { PosterImage } from "@/components/PosterImage";

// ── Types ─────────────────────────────────────────────────────────────────────

type Accent = {
  eyebrow: string;
  bar: string;
  iconBg: string;
  icon: string;
  solid: string;
  award: string;
};

type Scholarship = {
  id: string;
  name: string;
  summary: string;
  fullDescription: string;
  eligibility: string;
  award: string;
  flyer: string;
  Icon: typeof HeartHandshake;
  accent: Accent;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const scholarships: Scholarship[] = [
  {
    id: "basheer-memorial",
    name: "Mohammed Basheer Memorial Opportunity Scholarship",
    summary: "For students facing the loss or disability of a primary earner",
    fullDescription:
      "Designed for brilliant minds facing immense personal hardships, this scholarship ensures that financial adversity never becomes a barrier to academic excellence. It honors resilience paired with merit.",
    eligibility:
      "Students who are orphaned or whose father is permanently disabled and unable to work, with no other stable financial source in the household. Must secure a minimum of 80% marks in the school's diagnostic assessment.",
    award: "100% fee waiver — full monthly tuition covered.",
    flyer: "/images/education/scholarships/Mohammed Basheer.jpeg",
    Icon: HeartHandshake,
    accent: {
      eyebrow: "text-blue-600",
      bar: "bg-blue-400",
      iconBg: "bg-blue-50",
      icon: "text-blue-500",
      solid: "bg-blue-600 hover:bg-blue-700 text-white",
      award: "bg-blue-50 text-blue-800 border-blue-200",
    },
  },
  {
    id: "asif-jah-bahadur",
    name: "Asif Jah Bahadur Excellence & Oratory Scholarship",
    summary: "For the school's brightest thought-leaders and communicators",
    fullDescription:
      "Awarded to students who can articulate complex ideas with clarity and confidence, this scholarship invests in the changemakers of tomorrow — it doesn't just cover fees, it builds future leaders.",
    eligibility:
      "90% or above marks in the school's diagnostic assessment. Must demonstrate exceptional oratory skills and deep conceptual understanding, assessed via a panel interview where the student teaches a concept back to the judges.",
    award:
      "100% fee waiver plus a 2000 PKR monthly academic stipend covering transportation, nutritious meals, advanced learning resources, and a dedicated savings fund for higher education.",
    flyer: "/images/education/scholarships/Asif Jah Bahadur.jpeg",
    Icon: Mic,
    accent: {
      eyebrow: "text-amber-700",
      bar: "bg-amber-400",
      iconBg: "bg-amber-50",
      icon: "text-amber-600",
      solid: "bg-amber-600 hover:bg-amber-700 text-white",
      award: "bg-amber-50 text-amber-900 border-amber-200",
    },
  },
  {
    id: "umeed-e-naseem",
    name: "Umeed e Naseem Scholarship Program",
    summary: "A radical inclusion program for street-connected and destitute children",
    fullDescription:
      "This program removes every financial barrier for our most vulnerable children, providing 100% free education, uniforms, and books — aiming to break the cycle of poverty and give street children a dignified, permanent place in the classroom.",
    eligibility:
      "Open exclusively to street-connected children or those in extreme destitution with no access to formal education. No minimum percentage requirement — only a willingness to learn, assessed during a basic interaction.",
    award:
      "100% fee waiver plus a full educational kit — free uniform, shoes, school bag, and all prescribed textbooks and workbooks provided annually.",
    flyer: "/images/education/scholarships/Umeed-e-Naseem.jpeg",
    Icon: Sprout,
    accent: {
      eyebrow: "text-emerald-700",
      bar: "bg-emerald-400",
      iconBg: "bg-emerald-50",
      icon: "text-emerald-600",
      solid: "bg-emerald-600 hover:bg-emerald-700 text-white",
      award: "bg-emerald-50 text-emerald-900 border-emerald-200",
    },
  },
];

const APPLY_MAILTO =
  "mailto:oysterschoolsystem@gmail.com?subject=Scholarship%20Application%20Enquiry";

// ── Animation helper ──────────────────────────────────────────────────────────

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Scholarship Card ──────────────────────────────────────────────────────────

function ScholarshipCard({
  scholarship,
  index,
  onViewFlyer,
}: {
  scholarship: Scholarship;
  index: number;
  onViewFlyer: () => void;
}) {
  const { accent, Icon } = scholarship;

  return (
    <FadeInUp delay={index * 0.1} className="h-full">
      <div className="relative h-full flex flex-col bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
        {/* Accent top bar */}
        <div className={`h-1.5 w-full ${accent.bar}`} />

        {/* Flyer — visible up front, click to enlarge */}
        <button
          type="button"
          onClick={onViewFlyer}
          aria-label={`Enlarge ${scholarship.name} flyer`}
          className="group relative flex items-center justify-center h-[420px] bg-cream border-b border-gold/30 p-4 overflow-hidden"
        >
          <PosterImage
            src={scholarship.flyer}
            alt={`${scholarship.name} — official scholarship flyer`}
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {/* Enlarge hint */}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-navy/80 text-white text-[11px] font-body font-semibold px-2.5 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Maximize2 size={12} />
            View Full Flyer
          </span>
        </button>

        {/* Content */}
        <div className="flex flex-col flex-1 p-7">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-sm flex items-center justify-center mb-5 ${accent.iconBg}`}
          >
            <Icon size={22} className={accent.icon} strokeWidth={1.8} />
          </div>

          {/* Name */}
          <h3 className="font-heading text-navy text-2xl font-semibold leading-snug">
            {scholarship.name}
          </h3>

          {/* Summary */}
          <p className="font-body text-gray-500 text-sm mt-3 leading-relaxed">
            {scholarship.summary}
          </p>

          {/* Full description */}
          <p className="font-body text-gray-600 text-sm mt-4 leading-[1.8]">
            {scholarship.fullDescription}
          </p>

          {/* Eligibility */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck size={15} className={accent.icon} />
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                Eligibility
              </p>
            </div>
            <p className="font-body text-gray-600 text-sm leading-[1.8]">
              {scholarship.eligibility}
            </p>
          </div>

          {/* Award */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <Award size={15} className={accent.icon} />
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                Award
              </p>
            </div>
            <div className={`font-body text-sm leading-[1.8] border rounded-sm px-4 py-3 ${accent.award}`}>
              {scholarship.award}
            </div>
          </div>

          {/* Apply Now — pinned to the bottom so all cards align,
              wrapped so the gap above is real space, not button padding */}
          <div className="mt-auto pt-6">
            <a
              href={APPLY_MAILTO}
              className={`w-full group/apply inline-flex items-center justify-center gap-2 font-body text-sm font-semibold rounded-sm px-4 py-3 transition-colors duration-200 ${accent.solid}`}
            >
              <Mail size={16} />
              Apply Now
              <ArrowRight
                size={15}
                className="group-hover/apply:translate-x-1 transition-transform duration-200"
              />
            </a>
          </div>
        </div>
      </div>
    </FadeInUp>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ScholarshipPage() {
  const [flyer, setFlyer] = useState<Scholarship | null>(null);

  return (
    <div className="min-h-screen">
      {/* ── Page Header ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="bg-navy py-28 text-center relative overflow-hidden"
      >
        {/* Subtle gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 80%, rgba(201,162,39,0.12) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
          className="relative px-4"
        >
          <p className="font-body text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-4">
            Financial Aid
          </p>
          <h1 className="font-heading text-white text-5xl md:text-6xl lg:text-7xl font-semibold">
            Scholarships
          </h1>
          <p className="font-body text-gray-300 text-lg mt-5 max-w-xl mx-auto">
            Removing financial barriers to excellence at Oyster School System
          </p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="w-16 h-0.5 bg-gold mx-auto mt-8 origin-center"
          />
        </motion.div>
      </motion.section>

      {/* ── Section — Our Scholarship Programs ─────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <FadeInUp className="text-center mb-14">
            <p className="font-body text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-3">
              What We Offer
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy font-semibold">
              Our Scholarship Programs
            </h2>
            <p className="font-body text-gray-500 text-lg mt-3 max-w-xl mx-auto">
              Three distinct programs, each built to support a different journey. Tap any flyer to
              view it in full.
            </p>
          </FadeInUp>

          {/* Cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {scholarships.map((scholarship, i) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                index={i}
                onViewFlyer={() => setFlyer(scholarship)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(201,162,39,0.14) 0%, transparent 70%)",
          }}
        />
        <FadeInUp className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-white text-4xl md:text-5xl font-semibold">
            Ready to Apply?
          </h2>
          <p className="font-body text-gray-300 text-lg mt-4">
            Our team will guide you through the right scholarship for your child&apos;s situation.
          </p>
          <a
            href={APPLY_MAILTO}
            className="inline-flex items-center gap-2 mt-8 btn-primary group"
          >
            <Mail size={16} />
            Contact Us to Apply
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </FadeInUp>
      </section>

      {/* ── Flyer Lightbox ─────────────────────────────────────── */}
      <AnimatePresence>
        {flyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-navy/80 backdrop-blur-sm"
            onClick={() => setFlyer(null)}
          >
            <button
              type="button"
              onClick={() => setFlyer(null)}
              aria-label="Close flyer"
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative max-w-3xl w-full max-h-[88vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <PosterImage
                src={flyer.flyer}
                alt={`${flyer.name} — official scholarship flyer`}
                priority
                className="w-full h-auto max-h-[88vh] object-contain rounded-sm shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
