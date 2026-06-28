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
                  href="https://wa.me/message"
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
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>Message us on WhatsApp</p>
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
