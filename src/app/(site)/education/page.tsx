"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Clock, BookOpen, Award } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Timing = { label?: string; time: string };

type Program = {
  id: string;
  name: string;
  image: string;
  ages: string;
  timings: Timing[];
  subjects?: string[];
  books?: string;
  examBoard?: string;
  description: [string, string];
};

type Activity = {
  id: string;
  title: string;
  image: string;
  description: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const programs: Program[] = [
  {
    id: "early-years",
    name: "Early Years",
    image: "/images/education/early-years.jpg",
    ages: "Ages 3–6",
    timings: [
      { label: "Reception", time: "8:00 am – 12:00 pm" },
      { label: "Stage 1 & 2", time: "8:00 am – 1:00 pm" },
    ],
    subjects: ["Language & Literacy", "Numeracy", "Art & Craft", "Knowledge of the World"],
    description: [
      "In our Early Years classrooms, learning is woven into every moment of play and discovery. We create rich, nurturing environments where children aged 3 to 6 develop their love of language, their curiosity about the world, and their confidence to explore freely. Our trained educators guide young learners through structured play, sensory activities, and hands-on experiences that lay the foundation for a lifetime of learning.",
      "Every child arrives at Oyster with a unique way of seeing the world, and our Early Years programme is designed to honour that individuality. Through storytelling, creative arts, numeracy games, and exploration of the natural world, we build not just knowledge, but character — igniting a curiosity that will carry each student through every stage of their education.",
    ],
  },
  {
    id: "junior-level",
    name: "Junior Level",
    image: "/images/education/junior-level.jpg",
    ages: "Ages 6–11",
    timings: [{ time: "8:00 am – 1:40 pm" }],
    subjects: ["English", "Urdu", "Math", "Science", "Islamiat", "Quran", "Social Studies", "Computers"],
    books: "Oxford",
    description: [
      "The Junior Level years are where academic foundations are built with care and precision. Students aged 6 to 11 engage with a broad and balanced curriculum designed to challenge, inspire, and develop strong intellectual habits. Our Oxford-based programme ensures world-class academic standards, while our teachers bring warmth and creativity to every lesson.",
      "Beyond the textbook, Junior students are encouraged to question, collaborate, and think critically. From English and Urdu literacy to Science experiments and Computer skills, every subject is taught with the goal of making learning meaningful — connecting classroom knowledge to the real world all around them.",
    ],
  },
  {
    id: "secondary-level",
    name: "Secondary Level",
    image: "/images/education/secondary-level.jpg",
    ages: "Ages 11–15",
    timings: [{ time: "8:00 am – 1:40 pm" }],
    subjects: ["English", "Urdu", "Math", "Science", "Islamiat", "Quran", "History", "Geography", "Computers"],
    books: "Oxford",
    description: [
      "Secondary Level is where students begin to chart their own academic path. Aged 11 to 15, they encounter a rich and rigorous curriculum that prepares them not just for examinations, but for the demands of higher education and modern life. With Oxford-published books and experienced subject specialists, the quality of learning at this stage is exceptional.",
      "Students at this level develop the discipline, analytical thinking, and independent study skills that define successful learners. History and Geography broaden their understanding of the world; Science and Computers equip them for the future; while English, Urdu, and Islamiat deepen their connection to both their heritage and the world at large.",
    ],
  },
  {
    id: "higher-secondary",
    name: "Higher Secondary",
    image: "/images/education/higher-secondary.jpg",
    ages: "Ages 15–17",
    timings: [{ time: "8:00 am – 1:40 pm" }],
    examBoard: "Federal Board",
    description: [
      "The Higher Secondary years are among the most significant of a student's life. Aged 15 to 17, our students embark on their chosen academic stream under the Federal Board examination system, with the goal of excelling in their final examinations and securing university placements of their choice.",
      "At Oyster, we understand that these years carry tremendous weight, and so we provide intensive academic support, expert subject teaching, and pastoral care to help every student navigate this critical period with confidence. Whether pursuing Sciences, Humanities, or Commerce, every student is surrounded by a community that believes in their potential and champions their success.",
    ],
  },
];

const activities: Activity[] = [
  {
    id: "sports",
    title: "Sports",
    image: "/images/activities/sports.jpg",
    description: "Cricket, football, badminton and more during school hours",
  },
  {
    id: "sports-day",
    title: "Annual Sports Day",
    image: "/images/activities/sports-day.jpg",
    description: "A celebration of athleticism and school spirit held every year",
  },
  {
    id: "clubs",
    title: "Clubs & Activities",
    image: "/images/activities/clubs.jpg",
    description: "Sports, IT, Language, Environment, Health & Safety clubs",
  },
  {
    id: "trips",
    title: "Educational Trips",
    image: "/images/activities/trips.jpg",
    description: "Trail, House of Wisdom, Farm House, Movies, Super Space and more",
  },
];

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

// ── Program Card ──────────────────────────────────────────────────────────────

function ProgramCard({
  program,
  index,
  isActive,
  onClick,
}: {
  program: Program;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <FadeInUp delay={index * 0.1}>
      <motion.div
        className={`group relative h-[440px] cursor-pointer rounded-sm overflow-hidden border-2 transition-colors duration-300 ${
          isActive ? "border-gold" : "border-transparent hover:border-gold"
        }`}
        whileHover={!isActive ? { rotate: 2.5 } : {}}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        onClick={onClick}
      >
        {/* Image */}
        <img
          src={program.image}
          alt={program.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/15" />

        {/* Active top bar */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute top-0 inset-x-0 h-1 bg-gold origin-left"
            />
          )}
        </AnimatePresence>

        {/* Text content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          <span className="font-body text-gold text-[11px] uppercase tracking-[0.18em] font-semibold mb-1.5">
            {program.ages}
          </span>
          <h3 className="font-heading text-white text-[2rem] leading-tight font-semibold">
            {program.name}
          </h3>

          <div className="flex items-center gap-2.5 mt-3">
            <motion.div
              className="h-[2px] bg-gold"
              animate={{ width: isActive ? 48 : 24 }}
              transition={{ duration: 0.35, ease: EASE }}
            />
            <span className="font-body text-white/50 text-xs">
              {isActive ? "Click to close" : "Click to explore"}
            </span>
          </div>
        </div>
      </motion.div>
    </FadeInUp>
  );
}

// ── Expanded Panel ────────────────────────────────────────────────────────────

function ExpandedPanel({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  return (
    <motion.div
      key={program.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="mt-4 bg-cream border-l-4 border-gold rounded-sm">
        <div className="p-8">
          {/* Panel header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="font-body text-gold text-xs uppercase tracking-[0.18em] font-semibold">
                {program.ages}
              </span>
              <h3 className="font-heading text-navy text-4xl font-semibold mt-0.5">
                {program.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-navy transition-colors duration-200 mt-1 group/close"
            >
              <X size={16} className="group-hover/close:rotate-90 transition-transform duration-200" />
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-10">
            {/* Description — wider column */}
            <div className="md:col-span-3">
              {program.description.map((para, i) => (
                <p key={i} className="font-body text-gray-600 text-sm leading-[1.85] mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Details — narrower column */}
            <div className="md:col-span-2 space-y-6">
              {/* Timings */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={13} className="text-gold" />
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                    School Hours
                  </p>
                </div>
                <div className="space-y-1">
                  {program.timings.map((t, i) => (
                    <p key={i} className="font-body text-sm text-navy">
                      {t.label && (
                        <span className="font-semibold text-navy/70">{t.label}: </span>
                      )}
                      {t.time}
                    </p>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              {program.subjects && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={13} className="text-gold" />
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                      Subjects
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {program.subjects.map((s) => (
                      <span
                        key={s}
                        className="font-body text-xs bg-white text-navy border border-navy/12 px-2.5 py-1 rounded-sm shadow-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              {program.books && (
                <p className="font-body text-sm text-navy">
                  <span className="font-semibold">Books: </span>
                  <span className="text-gold font-semibold">{program.books}</span>
                </p>
              )}

              {/* Exam Board */}
              {program.examBoard && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={13} className="text-gold" />
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                      Exam Board
                    </p>
                  </div>
                  <p className="font-body text-sm text-navy font-semibold">{program.examBoard}</p>
                  <p className="font-body text-xs text-gray-500 mt-1">
                    Subjects vary based on chosen stream
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Card ─────────────────────────────────────────────────────────────

function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  return (
    <FadeInUp delay={index * 0.1}>
      <motion.div
        className="group relative h-[380px] rounded-sm overflow-hidden border-2 border-transparent hover:border-gold transition-colors duration-300 cursor-default"
        whileHover={{ rotate: -2, y: -10 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
      >
        {/* Image */}
        <img
          src={activity.image}
          alt={activity.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />

        {/* Gold accent line on hover */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left" />

        {/* Text */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          <h3 className="font-heading text-white text-2xl font-semibold">{activity.title}</h3>
          <p className="font-body text-gray-300 text-sm mt-2 leading-relaxed">{activity.description}</p>
        </div>
      </motion.div>
    </FadeInUp>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EducationPage() {
  const [activeProgram, setActiveProgram] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function handleCardClick(i: number) {
    if (activeProgram === i) {
      setActiveProgram(null);
    } else {
      setActiveProgram(i);
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  }

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
            Our Programs
          </p>
          <h1 className="font-heading text-white text-5xl md:text-6xl lg:text-7xl font-semibold">
            Education at Oyster
          </h1>
          <p className="font-body text-gray-300 text-lg mt-5 max-w-xl mx-auto">
            Nurturing every learner from their first day to their final year
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

      {/* ── Section 1 — Education Programs ───────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <FadeInUp className="text-center mb-14">
            <p className="font-body text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-3">
              What We Teach
            </p>
            <h2 className="section-title">Education Programs</h2>
            <p className="section-subtitle mt-3 max-w-lg mx-auto">
              Click any programme card to explore subjects, timings, and curriculum details.
            </p>
          </FadeInUp>

          {/* Cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map((program, i) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={i}
                isActive={activeProgram === i}
                onClick={() => handleCardClick(i)}
              />
            ))}
          </div>

          {/* Expanded detail panel */}
          <div ref={panelRef}>
            <AnimatePresence mode="wait">
              {activeProgram !== null && (
                <ExpandedPanel
                  key={programs[activeProgram].id}
                  program={programs[activeProgram]}
                  onClose={() => setActiveProgram(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Gold Wave Divider ─────────────────────────────────── */}
      <div className="bg-white overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="80"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="block"
        >
          {/* Cream fill below the wave — bridges white → cream */}
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#f5f3ee" />
          {/* Gold accent line along the wave crest */}
          <path d="M0,40 C480,80 960,0 1440,40" fill="none" stroke="#c9a227" strokeWidth="3.5" />
        </svg>
      </div>

      {/* ── Section 2 — Life at Oyster ────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <FadeInUp className="text-center mb-14">
            <p className="font-body text-gold text-sm tracking-[0.2em] uppercase font-semibold mb-3">
              Co &amp; Extracurricular
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy font-semibold">
              Life at Oyster
            </h2>
            <p className="font-body text-gray-500 text-lg mt-3 max-w-lg mx-auto">
              Education extends far beyond the classroom — developing minds, bodies, and character.
            </p>
          </FadeInUp>

          {/* Activity cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
