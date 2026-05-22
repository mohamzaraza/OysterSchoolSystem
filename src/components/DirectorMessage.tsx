"use client";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function DirectorMessage() {
  const { lang } = useLang();
  const tx = useT(lang).director;

  return (
    <section className="bg-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Quote block */}
          <div className="relative">
            <span className="font-heading text-[120px] text-gold/20 leading-none absolute -top-8 -left-4 select-none">
              "
            </span>
            <div className="relative">
              <p className="font-heading text-2xl md:text-3xl text-navy leading-relaxed italic font-medium">
                {tx.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-1 bg-gold" />
                <div>
                  <p className="font-heading text-navy text-lg font-semibold">{tx.role}</p>
                  <p className="font-body text-gray-500 text-sm">{tx.school}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4">
            {tx.cards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-sm p-5 shadow-sm border border-gray-100 hover:border-gold/40 transition-colors duration-200"
              >
                <span className="text-2xl">{card.icon}</span>
                <h4 className="font-heading text-navy text-lg font-semibold mt-2 mb-1">
                  {card.title}
                </h4>
                <p className="font-body text-gray-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
