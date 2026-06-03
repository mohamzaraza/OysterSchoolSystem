"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ClipboardList } from "lucide-react";
import logoImg from "@/assets/website-logo-one.png";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, toggle } = useLang();
  const tx = useT(lang).nav;

  const navLinks = [
    { label: tx.home, href: "/" },
    { label: tx.about, href: "/about" },
    { label: tx.education, href: "/education" },
    { label: tx.scholarship, href: "/scholarship" },
    { label: tx.news, href: "/news" },
    { label: tx.jobs, href: "/jobs" },
  ];

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src={logoImg}
              alt="Oyster School System Logo"
              width={40}
              height={40}
              className="rounded-sm object-contain"
            />
            <div className="leading-tight">
              <p className="font-heading text-white text-lg font-semibold leading-none">
                Oyster
              </p>
              <p className="font-body text-gold text-xs tracking-widest uppercase">
                School System
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-gray-300 hover:text-gold px-3 py-2 rounded transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admissions" className="btn-primary ml-4 flex items-center gap-1.5">
              <ClipboardList size={15} />
              Online Admissions
            </Link>
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="ml-3 border border-gold/50 text-gold hover:bg-gold hover:text-navy font-body text-sm font-semibold px-3 py-1.5 rounded-sm transition-colors duration-200 tracking-wide"
              aria-label="Toggle language"
            >
              {lang === "en" ? "اردو" : "EN"}
            </button>
          </nav>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              className="border border-gold/50 text-gold font-body text-sm font-semibold px-2.5 py-1 rounded-sm transition-colors duration-200"
              aria-label="Toggle language"
            >
              {lang === "en" ? "اردو" : "EN"}
            </button>
            <button
              className="text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-navy-light px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block font-body text-gray-300 hover:text-gold py-2.5 border-b border-navy-light text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admissions" className="btn-primary flex items-center justify-center gap-1.5 mt-4">
            <ClipboardList size={15} />
            Online Admissions
          </Link>
        </div>
      )}
    </header>
  );
}
