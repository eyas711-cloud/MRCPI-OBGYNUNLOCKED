"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu, X, ChevronDown, LogIn, LogOut,
  LayoutDashboard, Shield,
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const publicLinks = [
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
  const { user, profile, loading, signOut } = useAuth();
  const isAdmin = profile?.role === "admin" || profile?.role === "instructor";
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0] ?? "?").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

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
        <Link
          href="/"
          className="flex items-center"
          aria-label="MRCPI OBGYN Unlocked — Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="MRCPI-OBGYN Unlocked"
            className="w-auto"
            style={{ height: "64px" }}
          />
        </Link>

        {/* Desktop links — public links always shown */}
        <div className="hidden lg:flex items-center gap-6">
          {publicLinks.map((l) =>
            l.children ? (
              <div key={l.label} className="relative">
                <button
                  className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide"
                  onClick={() => setDropdown(dropdown === l.label ? null : l.label)}
                  onBlur={() => setTimeout(() => setDropdown(null), 150)}
                  onKeyDown={(e) => { if (e.key === "Escape") setDropdown(null); }}
                  aria-expanded={dropdown === l.label}
                  aria-haspopup="true"
                >
                  {l.label} <ChevronDown size={14} aria-hidden="true" />
                </button>
                {dropdown === l.label && (
                  <div
                    className="absolute top-8 left-0 rounded-lg border shadow-xl py-2 min-w-[160px]"
                    style={{
                      backgroundColor: "var(--navy)",
                      borderColor: "rgba(255,255,255,0.15)",
                    }}
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

          {/* Admin link — only visible to admins/instructors */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--teal-bright)" }}
            >
              <Shield size={13} /> Admin
            </Link>
          )}
        </div>

        {/* Desktop right-side CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {!loading && !user ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                <LogIn size={15} /> Sign In
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
              >
                Enquire Now
              </Link>
            </>
          ) : !loading && user ? (
            <div className="flex items-center gap-3">
              {/* Dashboard shortcut */}
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                <LayoutDashboard size={15} />
                {isAdmin ? "Dashboard" : "My Dashboard"}
              </Link>

              {/* Avatar + sign out */}
              <div className="relative group">
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--teal)" }}
                  aria-label={`Account menu for ${profile?.full_name || user?.email}`}
                >
                  {initials}
                </button>
                {/* Dropdown on hover or focus-within */}
                <div
                  className="absolute right-0 top-12 rounded-lg border shadow-xl py-2 min-w-[180px] hidden group-hover:block group-focus-within:block"
                  style={{
                    backgroundColor: "var(--navy)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-xs font-semibold text-white truncate">{profile?.full_name || user.email}</p>
                    <p className="text-xs capitalize mt-0.5" style={{ color: "var(--teal-bright)" }}>
                      {profile?.role ?? "student"}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : null}
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
          {publicLinks.map((l) =>
            l.children ? (
              <div key={l.label}>
                <p className="px-2 py-2.5 text-white/40 text-xs font-mono uppercase tracking-widest">
                  {l.label}
                </p>
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

          {isAdmin && (
            <Link
              href="/admin"
              className="px-2 py-2.5 text-sm font-medium flex items-center gap-2"
              style={{ color: "var(--teal-bright)" }}
              onClick={() => setOpen(false)}
            >
              <Shield size={14} /> Admin Panel
            </Link>
          )}

          {/* Mobile auth controls */}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
            {!loading && !user ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  <LogIn size={15} /> Sign In
                </Link>
                <Link
                  href="/contact"
                  className="py-3 rounded text-sm font-semibold text-center transition-all"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                  onClick={() => setOpen(false)}
                >
                  Enquire Now
                </Link>
              </>
            ) : user ? (
              <>
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold text-white">{profile?.full_name || user.email}</p>
                  <p className="text-xs capitalize" style={{ color: "var(--teal-bright)" }}>
                    {profile?.role ?? "student"}
                  </p>
                </div>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={15} /> My Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); handleSignOut(); }}
                  className="flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white text-sm font-medium text-left"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
