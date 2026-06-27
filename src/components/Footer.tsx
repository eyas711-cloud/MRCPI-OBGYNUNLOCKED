import Link from "next/link";
import { Mail, Phone, Share2, Rss, Video } from "lucide-react";

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

export default function Footer() {
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
              <a href="https://wa.me/201559912306" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Phone size={13} /> WhatsApp: +20 155 991 2306
              </a>
              <a href="https://wa.me/966563618146" className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Phone size={13} /> WhatsApp: +966 563 618 146
              </a>
            </div>
            <div className="flex items-center gap-4 mt-5">
              {[
                { icon: <Share2 size={16} />, href: "#", label: "Instagram" },
                { icon: <Rss size={16} />, href: "#", label: "Facebook" },
                { icon: <Video size={16} />, href: "#", label: "YouTube" },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="text-white/40 hover:text-white transition-colors">
                  {s.icon}
                </a>
              ))}
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

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/35">
          <p>&copy; {new Date().getFullYear()} MRCPI-OBGYN Unlocked. Not affiliated with the Royal College of Physicians of Ireland.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Use</a>
          </div>
        </div>
        <div className="pt-4 text-center">
          <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", color: "#C9A84C", fontSize: "13px", letterSpacing: "0.02em" }}>
            Designed &amp; Developed by Diab Studios
          </p>
        </div>
      </div>
    </footer>
  );
}
