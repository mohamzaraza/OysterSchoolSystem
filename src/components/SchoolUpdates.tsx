"use client";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";
import { POSTERS } from "@/lib/posters";
import { PosterImage } from "@/components/PosterImage";

export default function SchoolUpdates() {
  const { lang } = useLang();
  const tx = useT(lang).updates;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-1">
            {tx.upcomingEyebrow}
          </p>
          <h2 className="font-heading text-navy text-4xl font-semibold">{tx.upcomingTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-gold/40 transition-colors group">
            <Link href="/admissions" className="block overflow-hidden">
              <PosterImage
                src={POSTERS.admissions}
                alt={tx.admissionsPosterAlt}
                className="w-full h-auto max-h-80 object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-heading text-navy text-xl font-semibold leading-tight">
                    {tx.admissionsAnnouncement}
                  </p>
                  <p className="font-body text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Bell size={10} />
                    {tx.admissionsAnnouncementDate}
                  </p>
                </div>
              </div>
              <p className="font-body text-gray-500 text-sm mb-5">{tx.admissionsBody}</p>
              <Link
                href="/admissions"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {tx.applyNow}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-gold/40 transition-colors group">
            <Link href="/summer-program" className="block overflow-hidden">
              <PosterImage
                src={POSTERS.summerProgram}
                alt={tx.summerPosterAlt}
                className="w-full h-auto max-h-80 object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="font-heading text-navy text-xl font-semibold leading-tight">
                    {tx.summerAnnouncement}
                  </p>
                  <p className="font-body text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Bell size={10} />
                    {tx.summerAnnouncementDate}
                  </p>
                </div>
              </div>
              <p className="font-body text-gray-500 text-sm mb-5">{tx.summerBody}</p>
              <Link
                href="/summer-program"
                className="btn-outline w-full flex items-center justify-center gap-2 border-navy text-navy hover:bg-navy hover:text-white"
              >
                {tx.summerCta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
