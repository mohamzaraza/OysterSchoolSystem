import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POSTERS } from "@/lib/posters";
import { PosterImage } from "@/components/PosterImage";

export default function AdmissionsBanner() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-sm overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="px-10 py-12 md:px-14">
              <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-3">
                Now Open — 2026–27
              </p>
              <h2 className="font-heading text-white text-4xl md:text-5xl font-semibold leading-tight">
                Admissions Open
              </h2>
              <p className="font-body text-gray-300 mt-4 text-base leading-relaxed max-w-sm">
                Early Years to Grade X. Special offers for Grade VII–X including no admission fee,
                no security fee, and free evening tuition.
              </p>
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 mt-8 btn-primary group"
              >
                Start Enquiry
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <Link
              href="/admissions"
              className="hidden md:block border-l border-white/10 overflow-hidden"
            >
              <PosterImage
                src={POSTERS.admissions}
                alt="Admissions Open 2026-27 — Oyster School System"
                className="w-full h-full min-h-[320px] object-cover object-center hover:scale-[1.02] transition-transform duration-500"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
