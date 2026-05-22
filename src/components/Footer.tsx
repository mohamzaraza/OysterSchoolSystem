"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import logoImg from "@/assets/website-logo-one.png";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/translations";

export default function Footer() {
  const { lang } = useLang();
  const tx = useT(lang).footer;

  return (
    <footer className="bg-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logoImg}
                alt="Oyster School System Logo"
                width={36}
                height={36}
                className="rounded-sm object-contain"
              />
              <div>
                <p className="font-heading text-white text-xl font-semibold leading-none">Oyster</p>
                <p className="font-body text-gold text-xs tracking-widest uppercase">School System</p>
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed text-gray-400">{tx.tagline}</p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-navy-light hover:bg-gold hover:text-navy p-2 rounded-sm transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white text-xl mb-4 font-semibold">{tx.quickLinks}</h4>
            <ul className="space-y-2">
              {tx.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-gray-400 hover:text-gold transition-colors"
                  >
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campuses */}
          <div>
            <h4 className="font-heading text-white text-xl mb-4 font-semibold">{tx.campusesTitle}</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-white">{tx.early.name}</p>
                  <p className="font-body text-xs text-gray-400">{tx.early.address}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={16} className="text-gold mt-1 shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-white">{tx.high.name}</p>
                  <p className="font-body text-xs text-gray-400">{tx.high.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-white text-xl mb-4 font-semibold">{tx.contactTitle}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-gold shrink-0" />
                <a href="mailto:oysterschoolsystem@gmail.com" className="font-body text-xs text-gray-400 hover:text-gold break-all">
                  oysterschoolsystem@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-gold shrink-0" />
                <a href="tel:+923328308486" className="font-body text-sm text-gray-400 hover:text-gold">
                  +92 332 830 8486
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-light mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-gray-500">{tx.copyright}</p>
          <p className="font-body text-xs text-gray-500">{tx.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
