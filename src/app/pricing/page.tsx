import Link from "next/link";
import { MessageCircle, Mail, Phone } from "lucide-react";

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal-bright)" }}>
            Fees &amp; Enrolment
          </p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Course &amp; Mock Exam Fees
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            We keep our fees personal. Reach out and we&apos;ll provide full details on current fees and how to enrol.
          </p>
        </div>
      </section>

      {/* Main CTA */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-2xl mx-auto text-center">

          <div
            className="rounded-2xl border p-10 mb-10"
            style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "white" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}
            >
              <MessageCircle size={28} />
            </div>
            <h2 className="font-serif font-semibold text-2xl mb-4" style={{ color: "var(--navy)" }}>
              Contact Us for Current Fees &amp; Enrolment Details
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(26,26,26,0.6)" }}>
              For current course fees, mock exam fees, and enrolment details — get in touch directly. We respond to all enquiries within 24 hours.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
            >
              <MessageCircle size={18} />
              Enquire About Fees &amp; Enrolment
            </Link>
          </div>

          {/* Quick contact options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/201559912306"
              className="flex items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-sm"
              style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "white" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                <Phone size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>WhatsApp</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>+20 155 991 2306</p>
              </div>
            </a>
            <a
              href="mailto:info@mrcpiobgynunlocked.com"
              className="flex items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-sm"
              style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "white" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(11,30,61,0.06)", color: "var(--navy)" }}>
                <Mail size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Email</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>info@mrcpiobgynunlocked.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
