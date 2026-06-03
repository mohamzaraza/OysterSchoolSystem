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

type ActivityDetail = { label: string; value: string };

type Activity = {
  id: string;
  title: string;
  image: string;
  description: string;
  fullDescription: string;
  details: ActivityDetail[];
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
      "Our Early Years program lays the foundation for a lifelong love of learning. Spanning three classes — Early Years Reception, Early Years Stage 1, and Early Years Stage 2 — this program welcomes children aged 3 to 6 into a warm, nurturing environment where curiosity is celebrated.",
      "Learning happens through play, creative exploration, and hands-on discovery rather than rigid instruction. Our early years teachers are specially trained to guide young minds gently, building confidence alongside core skills.",
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
      "The Junior Level program spans five stages — Junior Level Stage 1 through Stage 5 — covering primary school years for children aged 6 to 11. This is where students build the core academic skills that will carry them through their entire education.",
      "Following the Oxford curriculum, our Junior Level teachers create engaging, structured lessons that balance academic rigour with creativity. Students develop strong foundations in literacy, numeracy, science and Islamic studies while also discovering their individual strengths and interests.",
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
      "The Secondary Level program consists of three stages — Secondary Level Stage 1, Stage 2, and Stage 3 — serving students aged 11 to 15. This is a critical period of academic development where students go deeper into core subjects and begin developing independent thinking and research skills.",
      "Following the Oxford curriculum, our secondary teachers challenge students to think critically, engage with complex ideas and take ownership of their learning. Students also begin exploring history and geography giving them a broader understanding of the world around them.",
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
      "The Higher Secondary program consists of two stages — Higher Secondary Stage 1 and Stage 2 — preparing students aged 15 to 17 for university and professional life. Following the Federal Board curriculum, this program is designed to challenge students academically while helping them discover their passions and career direction.",
      "Our experienced teachers provide focused guidance and exam preparation to help every student achieve their best results. Graduates of Oyster's Higher Secondary program leave with the knowledge, discipline and confidence to succeed in whatever path they choose.",
    ],
  },
];

const activities: Activity[] = [
  {
    id: "sports",
    title: "Sports",
    image: "/images/activities/sports.jpg",
    description: "Cricket, football, badminton and more during school hours",
    fullDescription:
      "At Oyster School System we believe physical activity is just as important as academic achievement. Students enjoy cricket, football, badminton and other sports during school hours as part of their regular timetable. Sport teaches teamwork, discipline and resilience — values that extend far beyond the playing field. Both campuses encourage active participation and a healthy competitive spirit among students.",
    details: [
      { label: "Sports Offered", value: "Cricket, Football, Badminton" },
      { label: "Available At", value: "Both campuses" },
    ],
  },
  {
    id: "sports-day",
    title: "Annual Sports Day",
    image: "/images/activities/sports-day.jpg",
    description: "A celebration of athleticism and school spirit held every year",
    fullDescription:
      "One of the most anticipated events in the Oyster School calendar, our Annual Sports Day brings together students, parents and staff for a full day of athletic competition and celebration. Students compete in track and field events, team sports and relay races. It is a day that celebrates effort, sportsmanship and school spirit. Parents are invited to cheer on their children and share in the excitement.",
    details: [
      { label: "Frequency", value: "Held once every academic year" },
      { label: "Open To", value: "All students across both campuses" },
    ],
  },
  {
    id: "clubs",
    title: "Clubs & Activities",
    image: "/images/activities/clubs.jpg",
    description: "Sports, IT, Language, Environment, Health & Safety clubs",
    fullDescription:
      "Oyster School System runs a vibrant club programme that gives students the opportunity to explore their interests beyond the classroom. Each club is led by a dedicated student ambassador and a supervising teacher. Clubs meet regularly and participate in school events and competitions throughout the year.",
    details: [
      {
        label: "Our Clubs",
        value:
          "Sports Club, IT Club, Language and Literacy Club, Environment Club, Health and Safety Club, Student Ambassadors",
      },
      { label: "Open To", value: "All students" },
    ],
  },
  {
    id: "trips",
    title: "Educational Trips",
    image: "/images/activities/trips.jpg",
    description: "Trail, House of Wisdom, Farm House, Movies, Super Space and more",
    fullDescription:
      "Learning does not stop at the classroom door. Throughout the academic year Oyster students go on multiple educational trips that bring their studies to life and broaden their understanding of the world. From nature trails to science centres, each trip is carefully selected to complement the curriculum and inspire curiosity. These experiences create lasting memories and give students a deeper appreciation for the world around them.",
    details: [
      { label: "Recent Trips Include", value: "Trail, House of Wisdom, Farm House, Movies, Super Space" },
      { label: "Frequency", value: "Multiple trips per academic year" },
    ],
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

// ── Expanded Activity Panel ───────────────────────────────────────────────────

function ExpandedActivityPanel({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  return (
    <motion.div
      key={activity.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="mt-4 bg-cream border-l-4 border-gold rounded-sm">
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <h3 className="font-heading text-navy text-4xl font-semibold">{activity.title}</h3>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 font-body text-xs text-gray-400 hover:text-navy transition-colors duration-200 mt-1 group/close"
            >
              <X size={16} className="group-hover/close:rotate-90 transition-transform duration-200" />
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3">
              <p className="font-body text-gray-600 text-sm leading-[1.85]">
                {activity.fullDescription}
              </p>
            </div>
            <div className="md:col-span-2 space-y-5">
              {activity.details.map((d) => (
                <div key={d.label}>
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold mb-1">
                    {d.label}
                  </p>
                  <p className="font-body text-sm text-navy">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Card ─────────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  index,
  isActive,
  onClick,
}: {
  activity: Activity;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <FadeInUp delay={index * 0.1}>
      <motion.div
        className={`group relative h-[380px] rounded-sm overflow-hidden border-2 transition-colors duration-300 cursor-pointer ${
          isActive ? "border-gold" : "border-transparent hover:border-gold"
        }`}
        whileHover={!isActive ? { rotate: -2, y: -10 } : {}}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        onClick={onClick}
      >
        {/* Image */}
        <img
          src={activity.image}
          alt={activity.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />

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

        {/* Gold accent line on hover */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-left" />

        {/* Text */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          <h3 className="font-heading text-white text-2xl font-semibold">{activity.title}</h3>
          <p className="font-body text-gray-300 text-sm mt-2 leading-relaxed">{activity.description}</p>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EducationPage() {
  const [activeProgram, setActiveProgram] = useState<number | null>(null);
  const [activeActivity, setActiveActivity] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activityPanelRef = useRef<HTMLDivElement>(null);

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

  function handleActivityClick(i: number) {
    if (activeActivity === i) {
      setActiveActivity(null);
    } else {
      setActiveActivity(i);
      setTimeout(() => {
        activityPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={i}
                isActive={activeActivity === i}
                onClick={() => handleActivityClick(i)}
              />
            ))}
          </div>

          {/* Expanded activity panel */}
          <div ref={activityPanelRef}>
            <AnimatePresence mode="wait">
              {activeActivity !== null && (
                <ExpandedActivityPanel
                  key={activities[activeActivity].id}
                  activity={activities[activeActivity]}
                  onClose={() => setActiveActivity(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
}
