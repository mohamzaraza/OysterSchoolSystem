"use client";
import Image from "next/image";
import dirImg from "@/assets/dir.png";
import pirImg from "@/assets/pir.png";
import adnImg from "@/assets/adn.png";
import headImg from "@/assets/head.png";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

const photos = [dirImg, pirImg, adnImg, headImg];

export default function SchoolManagement() {
  const { lang } = useLang();
  const tx = useT(lang).management;

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
            {tx.eyebrow}
          </p>
          <h2 className="section-title">{tx.title}</h2>
          <p className="section-subtitle">{tx.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {tx.team.map((name, i) => (
            <div key={name} className="flex flex-col items-center text-center group">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gold shadow-lg mb-4 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={photos[i]}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-heading text-xl text-navy font-semibold">{name}</h3>
              <p className="font-body text-gold text-xs tracking-widest uppercase mt-1">
                {tx.school}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
