"use client";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

const pillarMeta = [
  { emoji: "🎮", color: "bg-blue-50 border-blue-200", accent: "text-blue-600" },
  { emoji: "🔬", color: "bg-emerald-50 border-emerald-200", accent: "text-emerald-600" },
  { emoji: "🎨", color: "bg-amber-50 border-amber-200", accent: "text-amber-600" },
  { emoji: "🌿", color: "bg-green-50 border-green-200", accent: "text-green-600" },
  { emoji: "✨", color: "bg-purple-50 border-purple-200", accent: "text-purple-600" },
];

export default function LearningPhilosophy() {
  const { lang } = useLang();
  const tx = useT(lang).philosophy;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
            {tx.eyebrow}
          </p>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-subtitle max-w-xl mx-auto mt-3">{tx.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tx.pillars.map((p, i) => {
            const meta = pillarMeta[i];
            return (
              <div
                key={p.title}
                className={`border rounded-sm p-6 ${meta.color} hover:shadow-md transition-shadow duration-200 ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="text-4xl">{meta.emoji}</span>
                <h3 className="font-heading text-navy text-2xl font-semibold mt-3 mb-0.5">
                  {p.title}
                </h3>
                <p className={`font-body text-xs tracking-wide uppercase font-semibold mb-3 ${meta.accent}`}>
                  {p.subtitle}
                </p>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
