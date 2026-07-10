import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POSTERS } from "@/lib/posters";
import { PosterImage } from "@/components/PosterImage";

const cards = [
  {
    href: "/summer-program",
    poster: POSTERS.summerProgram,
    alt: "Oyster School System Summer School Program",
    title: "Summer School Program",
    subtitle: "Enrolling now for Summer 2026",
    description:
      "Strengthen foundational skills and give your child a confident headstart for the new academic year.",
    cta: "Enrol Now",
  },
  {
    href: "/news",
    poster: POSTERS.upcomingTraining,
    alt: "School Leadership in Action — Workshop",
    title: "School Leadership in Action — Workshop",
    subtitle: "24–25 July 2026 · Oyster School System",
    description:
      "A two-day workshop on strengthening leadership through complexity, not crisis. By Prof. Abbas Husain.",
    cta: "Learn More",
  },
  {
    href: "/news/five-day-training-registration",
    poster: POSTERS.fiveDayTraining,
    alt: "Oyster Pathways 5-Day Training Program — Teaching Fundamentals",
    title: "5-Day Training Program — Teaching Fundamentals",
    subtitle: "27–31 July 2026 · Trainer: Abida Ashar",
    description:
      "A hands-on 5-day training covering lesson planning, classroom management, assessment and more. Seats are limited.",
    cta: "Register Now",
  },
];

export default function UpcomingAtOyster() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-1">
            What&apos;s Next
          </p>
          <h2 className="font-heading text-navy text-4xl font-semibold">Upcoming at Oyster</h2>
          <p className="font-body text-gray-500 mt-3 text-base max-w-2xl">
            Stay up to date with what&apos;s happening at Oyster School System
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-gold/40 transition-colors group flex flex-col"
            >
              <Link
                href={card.href}
                className="flex items-center justify-center min-h-[420px] bg-cream border border-gold/40 p-4 overflow-hidden"
              >
                <PosterImage
                  src={card.poster}
                  alt={card.alt}
                  className="max-w-full max-h-[420px] w-auto h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500"
                />
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <p className="font-heading text-navy text-xl font-semibold leading-tight">
                  {card.title}
                </p>
                <p className="font-body text-gold text-sm font-semibold mt-1">{card.subtitle}</p>
                <p className="font-body text-gray-500 text-sm mt-3 mb-6">{card.description}</p>
                <Link
                  href={card.href}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-auto"
                >
                  {card.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
