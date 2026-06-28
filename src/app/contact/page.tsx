"use client";

import { useState } from "react";
import { Mail, Phone, Share2, Rss, Video, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("contact_submissions").insert([form]);
    setLoading(false);
    if (error) {
      setError("Something went wrong. Please try again or email us directly.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Get in Touch</p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Contact us
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Have a question about our courses, mock OSCE sessions, or the MRCPI examination? We are here to help.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-6" style={{ color: "var(--teal)" }}>Contact Information</p>
              <div className="space-y-5">
                <a
                  href="mailto:info@mrcpiobgynunlocked.com"
                  className="flex items-start gap-4 p-5 rounded-xl border bg-white transition-shadow hover:shadow-sm"
                  style={{ borderColor: "rgba(15,76,92,0.15)" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>Email</p>
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>info@mrcpiobgynunlocked.com</p>
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>adminmrcpi@gmail.com</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.4)" }}>Response within 24 hours</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/201559912306"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-xl border bg-white transition-shadow hover:shadow-sm"
                  style={{ borderColor: "rgba(15,76,92,0.15)" }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(37,211,102,0.1)", color: "#25D366" }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>WhatsApp</p>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.847L.057 23.882a.5.5 0 0 0 .611.611l6.086-1.476A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.893 9.893 0 0 1-5.031-1.371l-.36-.214-3.733.905.922-3.643-.235-.374A9.866 9.866 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/></svg>
                      <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>+20 155 991 2306</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.847L.057 23.882a.5.5 0 0 0 .611.611l6.086-1.476A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.893 9.893 0 0 1-5.031-1.371l-.36-.214-3.733.905.922-3.643-.235-.374A9.866 9.866 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/></svg>
                      <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>+966 563 618 146</p>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.4)" }}>For quick consultation enquiries</p>
                  </div>
                </a>

                <div className="p-5 rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                  <p className="font-semibold text-sm mb-4" style={{ color: "var(--navy)" }}>Follow us</p>
                  <div className="flex gap-4">
                    {[
                      { icon: <Share2 size={18} />, label: "Instagram", href: "#" },
                      { icon: <Rss size={18} />, label: "Facebook", href: "#" },
                      { icon: <Video size={18} />, label: "YouTube", href: "#" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all hover:border-teal"
                        style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--teal)" }}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl border" style={{ borderColor: "rgba(21,176,151,0.2)", backgroundColor: "rgba(21,176,151,0.04)" }}>
                  <p className="font-semibold text-sm mb-2" style={{ color: "var(--navy)" }}>Book a Consultation</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
                    Not sure which course is right for you? Book a free 15-minute consultation with Dr. Diab to discuss your preparation needs and examination timeline.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <p className="font-mono-data text-xs uppercase tracking-widest mb-6" style={{ color: "var(--teal)" }}>Send a Message</p>
              {submitted ? (
                <div className="rounded-2xl border p-12 bg-white text-center" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                  <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "var(--teal-bright)" }} />
                  <h2 className="font-serif font-semibold text-xl mb-3" style={{ color: "var(--navy)" }}>Message sent</h2>
                  <p className="text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>
                    Thank you for contacting MRCPI-OBGYN Unlocked. We will respond to your message within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border p-8 bg-white space-y-5" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                        className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                        style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors"
                        style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Subject *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors bg-white"
                      style={{ borderColor: "rgba(15,76,92,0.2)", color: form.subject ? "var(--ink)" : "rgba(26,26,26,0.4)" }}
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="course-enquiry">Course Enquiry</option>
                      <option value="mock-osce">Mock OSCE Booking</option>
                      <option value="consultation">Free Consultation Request</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you with your MRCPI OBGYN OSCE preparation..."
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors resize-none"
                      style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                  >
                    <Send size={15} /> {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
