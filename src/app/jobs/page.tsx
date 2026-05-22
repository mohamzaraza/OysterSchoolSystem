import { Briefcase, MapPin, Clock } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Math & Physics Teacher",
    campus: "High School Campus",
    type: "Full Time",
    posted: "May 2026",
    description:
      "We are seeking a qualified and enthusiastic Math and Physics teacher to join our High School faculty. The ideal candidate will have a strong academic background and a passion for inspiring students.",
    requirements: [
      "Bachelor's or Master's degree in relevant subject",
      "Minimum 2 years teaching experience",
      "Strong communication skills in Urdu and English",
      "Ability to engage and motivate students",
    ],
  },
  {
    id: 2,
    title: "Urdu Language Teacher",
    campus: "Early Years Campus",
    type: "Full Time",
    posted: "April 2026",
    description:
      "We are looking for an experienced Urdu language teacher for our Early Years campus. The role involves teaching foundational Urdu literacy and language skills to young learners.",
    requirements: [
      "Degree in Urdu Literature or Education",
      "Experience with early years / primary age groups",
      "Patient, nurturing teaching style",
      "Familiarity with modern teaching methods",
    ],
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
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

      {/* Jobs list */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {jobs.map((job) => (
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
                    <Briefcase size={14} className="text-gold" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1 font-body text-sm text-gray-500">
                    <Clock size={14} className="text-gold" /> Posted {job.posted}
                  </span>
                </div>
              </div>
              <a
                href="mailto:oysterschoolsystem@gmail.com"
                className="btn-primary"
              >
                Apply Now
              </a>
            </div>
            <p className="font-body text-gray-600 text-sm leading-relaxed mb-4">
              {job.description}
            </p>
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
          </div>
        ))}
      </div>
    </div>
  );
}
