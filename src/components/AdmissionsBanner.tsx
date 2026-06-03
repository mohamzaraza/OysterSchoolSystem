import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

export default function AdmissionsBanner() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-sm overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">

            {/* Left — icon + text */}
            <div className="px-10 py-12 md:px-14">
              <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center mb-6">
                <ClipboardList size={32} className="text-gold" />
              </div>
              <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-3">
                Now Open
              </p>
              <h2 className="font-heading text-white text-4xl md:text-5xl font-semibold leading-tight">
                Admissions 2026
              </h2>
              <p className="font-body text-gray-300 mt-4 text-base leading-relaxed max-w-sm">
                Secure your child&apos;s place at Oyster School System. Submit an online
                enquiry and our team will be in touch within 2 working days.
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

            {/* Right — decorative steps */}
            <div className="hidden md:flex flex-col gap-4 px-10 py-12 border-l border-white/10">
              {[
                { num: "01", label: "Student Details", desc: "Name, date of birth, level applying for" },
                { num: "02", label: "Parent / Guardian Info", desc: "Contact details and preferred campus" },
                { num: "03", label: "We Contact You", desc: "A representative reaches out within 2 working days" },
              ].map((s) => (
                <div key={s.num} className="flex items-start gap-4">
                  <span className="font-heading text-gold text-2xl font-semibold w-10 shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <p className="font-body text-white font-semibold text-sm">{s.label}</p>
                    <p className="font-body text-gray-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
