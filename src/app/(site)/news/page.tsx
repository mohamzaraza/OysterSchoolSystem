import Link from "next/link";
import { POSTERS } from "@/lib/posters";
import { PosterImage } from "@/components/PosterImage";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-navy py-20 text-center px-4">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Stay Informed
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">
          News & Announcements
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <Link
          href="/admissions"
          className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-gold/40 transition-colors group"
        >
          <PosterImage
            src={POSTERS.admissions}
            alt="Admissions Open 2026-27"
            className="w-full h-auto max-h-96 object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="p-6">
            <h2 className="font-heading text-navy text-2xl font-semibold">Admissions 2026–27</h2>
            <p className="font-body text-gray-500 text-sm mt-2">Early Years to Grade X — enquire now.</p>
          </div>
        </Link>

        <Link
          href="/summer-program"
          className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-gold/40 transition-colors group"
        >
          <PosterImage
            src={POSTERS.summerProgram}
            alt="Summer School Program"
            className="w-full h-auto max-h-96 object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="p-6">
            <h2 className="font-heading text-navy text-2xl font-semibold">Summer School Program</h2>
            <p className="font-body text-gray-500 text-sm mt-2">Enrol now for Summer 2026.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
