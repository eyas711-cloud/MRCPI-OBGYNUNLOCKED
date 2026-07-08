"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const footerGroups = [
  {
    heading: "Courses",
    links: [
      { href: "/courses", label: "All Courses" },
      { href: "/courses#osce-prep", label: "OSCE Preparation" },
      { href: "/mock-osce", label: "Mock OSCE Sessions" },
      { href: "/contact", label: "Fees & Enrolment" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/resources", label: "Study Materials" },
      { href: "/resources#tips", label: "OSCE Tips" },
      { href: "/resources#blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { href: "/faculty", label: "Meet the Faculty" },
      { href: "/testimonials", label: "Success Stories" },
      { href: "/login", label: "Student Login" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

type SocialLinks = { instagram_url: string; facebook_url: string; tiktok_url: string; twitter_url: string };

export default function Footer() {
  const [social, setSocial] = useState<SocialLinks>({ instagram_url: "", facebook_url: "", tiktok_url: "", twitter_url: "" });

  useEffect(() => {
    supabase.from("site_settings").select("key, value").in("key", ["instagram_url", "facebook_url", "tiktok_url", "twitter_url"]).then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value ?? ""; });
      setSocial({ instagram_url: map.instagram_url ?? "", facebook_url: map.facebook_url ?? "", tiktok_url: map.tiktok_url ?? "", twitter_url: map.twitter_url ?? "" });
    });
  }, []);

  const socialItems = [
    { key: "instagram_url" as const, label: "Instagram", icon: <InstagramIcon /> },
    { key: "facebook_url" as const, label: "Facebook", icon: <FacebookIcon /> },
    { key: "tiktok_url" as const, label: "TikTok", icon: <TikTokIcon /> },
    { key: "twitter_url" as const, label: "X / Twitter", icon: <XIcon /> },
  ].filter(s => !!social[s.key]);

  return (
    <footer style={{ backgroundColor: "var(--navy)" }} className="text-white/70">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="MRCPI-OBGYN Unlocked" className="w-auto mb-4" style={{ height: "80px" }} />
            <p className="font-serif text-white font-semibold text-lg mb-2">
              MRCPI-OBGYN <span style={{ color: "var(--teal-bright)" }}>Unlocked</span>
            </p>
            <p className="text-sm leading-relaxed text-white/55 mb-5">
              Expert-led OSCE preparation for the MRCPI Obstetrics &amp; Gynaecology examination. Guided by Dr. Einas Diab.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:info@mrcpiobgynunlocked.com" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Mail size={13} /> info@mrcpiobgynunlocked.com
              </a>
              <a href="mailto:adminmrcpi@gmail.com" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Mail size={13} /> adminmrcpi@gmail.com
              </a>
              <a href="https://wa.me/201559912306" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Phone size={13} /> WhatsApp: +20 155 991 2306
              </a>
              <a href="https://wa.me/966563618146" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Phone size={13} /> WhatsApp: +966 563 618 146
              </a>
            </div>
          </div>

          {footerGroups.map((g) => (
            <div key={g.heading}>
              <h3 className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>
                {g.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social media bar */}
        {socialItems.length > 0 && (
          <div className="pt-8 pb-4 flex flex-col items-center gap-4 border-b border-white/10">
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--teal-bright)" }}>Follow Us</p>
            <div className="flex items-center gap-5">
              {socialItems.map(s => (
                <a key={s.key} href={social[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center border border-white/15 group-hover:border-white/40 transition-colors">
                    {s.icon}
                  </span>
                  <span className="text-sm hidden sm:inline">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/35">
          <p>&copy; {new Date().getFullYear()} MRCPI-OBGYN Unlocked. Not affiliated with the Royal College of Physicians of Ireland.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Use</a>
          </div>
        </div>
        <div className="pt-6 flex flex-col items-center gap-3">
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: "#C9A84C", fontSize: "15px", letterSpacing: "0.03em" }}>
            Designed &amp; Developed by Diab Studios
          </p>
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "12px 32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/DIABSTUDIOS Logo.png" alt="Diab Studios" style={{ height: "160px", width: "auto", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
