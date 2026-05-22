"use client";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

const campusMeta = [
  { color: "from-emerald-600 to-emerald-800", emoji: "🌱" },
  { color: "from-navy to-navy-dark", emoji: "🏛️" },
];

export default function Campuses() {
  const { lang } = useLang();
  const tx = useT(lang).campuses;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
            {tx.eyebrow}
          </p>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-subtitle">{tx.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tx.campuses.map((campus, i) => {
            const meta = campusMeta[i];
            return (
              <div
                key={campus.name}
                className="rounded-sm overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`bg-gradient-to-r ${meta.color} p-8 text-white`}>
                  <span className="text-5xl">{meta.emoji}</span>
                  <h3 className="font-heading text-3xl font-semibold mt-4">{campus.name}</h3>
                  <p className="font-body text-sm opacity-70 tracking-wide mt-1">{campus.subtitle}</p>
                </div>
                <div className="bg-cream p-6">
                  <p className="font-body text-gray-600 text-sm leading-relaxed mb-4">
                    {campus.description}
                  </p>
                  <div className="flex items-start gap-2 text-navy">
                    <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                    <p className="font-body text-sm">{campus.address}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-navy">
                    <Phone size={16} className="text-gold shrink-0" />
                    <a href="tel:+923328308486" className="font-body text-sm hover:text-gold">
                      +92 332 830 8486
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail size={16} className="text-gold shrink-0" />
                    <a
                      href="mailto:oysterschoolsystem@gmail.com"
                      className="font-body text-sm text-navy hover:text-gold"
                    >
                      oysterschoolsystem@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
