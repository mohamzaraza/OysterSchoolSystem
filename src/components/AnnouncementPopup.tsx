"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { POSTERS } from "@/lib/posters";
import { PosterImage } from "@/components/PosterImage";

const EASE = [0.22, 1, 0.36, 1] as const
const STORAGE_KEY = "announcementPopupShown";

const NAVY = "#0f2b4c";
const GOLD = "#c9a227";

const slides = [
  {
    poster: POSTERS.admissions,
    alt: "Admissions Open 2026–27 — Oyster School System",
    href: "/admissions",
    cta: "Start Enquiry",
  },
  {
    poster: POSTERS.summerProgram,
    alt: "Oyster School System Summer School Program",
    href: "/summer-program",
    cta: "Enrol Now",
  },
  {
    poster: POSTERS.upcomingTraining,
    alt: "School Leadership in Action — Workshop",
    href: "/news",
    cta: "Learn More",
  },
  {
    poster: POSTERS.fiveDayTraining,
    alt: "Oyster Pathways 5-Day Training Program — Teaching Fundamentals",
    href: "/news/five-day-training-registration",
    cta: "Register Now",
  },
];

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Show once per session, 1s after load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const paginate = useCallback((dir: number) => {
    setIndex((current) => (current + dir + slides.length) % slides.length);
  }, []);

  // Auto-advance every 4s while open.
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => paginate(1), 4000);
    return () => clearInterval(interval);
  }, [open, paginate]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const slide = slides[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Announcements"
        >
          <motion.div
            className="relative w-full max-w-[650px]"
            style={{
              backgroundColor: NAVY,
              backgroundImage:
                "radial-gradient(ellipse at center, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 60%)",
              border: `2px solid ${GOLD}`,
              borderRadius: "16px",
              boxShadow: "0 0 40px rgba(201, 162, 39, 0.3)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close announcement"
              className="group absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors"
              style={{ backgroundColor: NAVY, border: `1.5px solid ${GOLD}` }}
            >
              <span
                className="absolute inset-0 z-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: GOLD }}
              />
              <X
                size={18}
                style={{ color: GOLD }}
                className="relative z-10 transition-colors group-hover:!text-[#0f2b4c]"
              />
            </button>

            <div className="p-5 sm:p-6">
              {/* Slide viewport */}
              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden sm:min-h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex w-full flex-col items-center"
                  >
                    <div
                      style={{
                        border: `1px solid ${GOLD}`,
                        borderRadius: "8px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                        overflow: "hidden",
                        backgroundColor: NAVY,
                      }}
                    >
                      <PosterImage
                        src={slide.poster}
                        alt={slide.alt}
                        priority
                        className="block max-h-[52vh] w-auto max-w-full object-contain"
                      />
                    </div>
                    <Link
                      href={slide.href}
                      onClick={() => setOpen(false)}
                      className="mt-6 inline-block font-body text-sm font-bold uppercase tracking-widest transition-colors hover:brightness-110"
                      style={{
                        backgroundColor: GOLD,
                        color: NAVY,
                        borderRadius: "6px",
                        padding: "12px 28px",
                      }}
                    >
                      {slide.cta}
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Arrows */}
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous slide"
                  className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all hover:brightness-110"
                  style={{ backgroundColor: GOLD, color: NAVY }}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next slide"
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all hover:brightness-110"
                  style={{ backgroundColor: GOLD, color: NAVY }}
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Dots */}
              <div className="mt-6 flex items-center justify-center gap-2.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={
                      i === index
                        ? { width: "26px", backgroundColor: GOLD }
                        : {
                            width: "10px",
                            backgroundColor: "transparent",
                            border: "1px solid rgba(255,255,255,0.5)",
                          }
                    }
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
