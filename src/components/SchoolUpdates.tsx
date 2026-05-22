"use client";
import Link from "next/link";
import { Calendar, Briefcase, Bell, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function SchoolUpdates() {
  const { lang } = useLang();
  const tx = useT(lang).updates;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* School Updates - 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-1">
                  {tx.latestEyebrow}
                </p>
                <h2 className="font-heading text-navy text-4xl font-semibold">{tx.latestTitle}</h2>
              </div>
              <Link href="/news" className="btn-outline text-xs hidden sm:block">
                {tx.viewAll}
              </Link>
            </div>

            <div className="space-y-5">
              {tx.updates.map((update, i) => (
                <Link
                  key={i}
                  href={update.href}
                  className="group block bg-white rounded-sm p-6 shadow-sm border border-gray-100 hover:border-gold/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-navy text-gold text-xs font-body font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Briefcase size={10} />
                          {update.type}
                        </span>
                        <span className="font-body text-gray-400 text-xs flex items-center gap-1">
                          <Calendar size={10} />
                          {update.date}
                        </span>
                      </div>
                      <h3 className="font-heading text-navy text-xl font-semibold group-hover:text-gold transition-colors">
                        {update.title}
                      </h3>
                      <p className="font-body text-gray-500 text-sm mt-1 leading-relaxed">
                        {update.excerpt}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-gold mt-1 shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Announcements - 1 col */}
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

            {/* CTA */}
            <div className="mt-6 bg-navy rounded-sm p-6 text-center">
              <p className="font-heading text-white text-2xl font-semibold mb-2">
                {tx.admissionsTitle}
              </p>
              <p className="font-body text-gray-300 text-sm mb-4">{tx.admissionsBody}</p>
              <Link href="/contact" className="btn-primary w-full block">
                {tx.applyNow}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
