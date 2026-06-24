"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/mock-osce", label: "Mock OSCE" },
  { href: "/faculty", label: "Faculty" },
  {
    label: "Resources",
    children: [
      { href: "/resources", label: "Study Materials" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ backgroundColor: "var(--navy)" }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="MRCPI OBGYN Unlocked — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MRCPI-OBGYN Unlocked" className="w-auto" style={{ height: "64px" }} />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) =>
            l.children ? (
              <div key={l.label} className="relative">
                <button
                  className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide"
                  onClick={() => setDropdown(dropdown === l.label ? null : l.label)}
                  onBlur={() => setTimeout(() => setDropdown(null), 150)}
                >
                  {l.label} <ChevronDown size={14} />
                </button>
                {dropdown === l.label && (
                  <div
                    className="absolute top-8 left-0 rounded-lg border shadow-xl py-2 min-w-[160px]"
                    style={{ backgroundColor: "var(--navy)", borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setDropdown(null)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href!}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide"
              >
                {l.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            <LogIn size={15} /> Sign In
          </Link>
          <Link
            href="/courses"
            className="px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Enroll Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white/80 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden border-t border-white/10 px-6 pb-6 pt-4 flex flex-col gap-1"
          style={{ backgroundColor: "var(--navy)" }}
        >
          {navLinks.map((l) =>
            l.children ? (
              <div key={l.label}>
                <p className="px-2 py-2.5 text-white/40 text-xs font-mono uppercase tracking-widest">{l.label}</p>
                {l.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block px-4 py-2 text-white/70 hover:text-white transition-colors text-base font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href!}
                className="px-2 py-2.5 text-white/70 hover:text-white transition-colors text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          )}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
            <Link href="/login" className="flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white text-sm font-medium" onClick={() => setOpen(false)}>
              <User size={15} /> Sign In
            </Link>
            <Link
              href="/courses"
              className="py-3 rounded text-sm font-semibold text-center transition-all"
              style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
              onClick={() => setOpen(false)}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
