"use client";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function Hero() {
  const { lang } = useLang();
  const tx = useT(lang).hero;

  return (
    <section className="relative bg-navy min-h-[92vh] flex items-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/video.mp4"
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-body text-gold text-xs tracking-widest uppercase">
              {tx.badge}
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl text-white font-semibold leading-tight mb-6">
            {tx.heading1}{" "}
            <span className="text-gold italic">{tx.heading2}</span>{" "}
            {tx.heading3}
          </h1>

          <p className="font-body text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
            {tx.body}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="btn-primary">
              {tx.cta1}
            </Link>
            <Link href="/contact" className="btn-outline">
              {tx.cta2}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/10">
            {tx.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-4xl text-gold font-semibold">{stat.value}</p>
                <p className="font-body text-gray-400 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
