"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function SchoolUpdates() {
  const { lang } = useLang();
  const tx = useT(lang).updates;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Announcements */}
          <div>
            <div className="mb-8">
              <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-1">
                {tx.upcomingEyebrow}
              </p>
              <h2 className="font-heading text-navy text-4xl font-semibold">{tx.upcomingTitle}</h2>
            </div>

            <div className="space-y-4">
              {tx.announcements.map((ann, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm p-4 border border-gray-100 flex items-start gap-3 hover:border-gold/40 transition-colors"
                >
                  <span className="text-2xl mt-0.5">{ann.icon}</span>
                  <div>
                    <p className="font-heading text-navy text-lg font-semibold leading-tight">
                      {ann.title}
                    </p>
                    <p className="font-body text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Bell size={10} />
                      {ann.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admissions CTA */}
          <div className="flex flex-col justify-center">
            <div className="bg-navy rounded-sm p-8 text-center">
              <p className="font-heading text-white text-2xl font-semibold mb-2">
                {tx.admissionsTitle}
              </p>
              <p className="font-body text-gray-300 text-sm mb-6">{tx.admissionsBody}</p>
              <Link href="/admissions" className="btn-primary w-full block">
                {tx.applyNow}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
