"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Calendar, Clock, Video, CheckCircle, FileText, Globe, Bell, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SlotRow = { id: string; date_label: string; slots: string[] };

const sessionSteps = [
  { step: "01", title: "Choose a Date & Time", desc: "Select from available examiner slots. All times shown in Arabia Standard Time (AST, Riyadh)." },
  { step: "02", title: "Complete Your Booking", desc: "Secure your session with payment. Receive an instant confirmation email with session details and preparation guidance." },
  { step: "03", title: "Attend Your Mock OSCE", desc: "Join the secure video session at your scheduled time. Your examiner will conduct 3 timed OSCE stations in real exam format." },
  { step: "04", title: "Receive Your Feedback", desc: "Get your detailed written feedback report within 24 hours, including domain-level scores and personalised improvement recommendations." },
];

const feedbackComponents = [
  { icon: <FileText size={18} />, title: "Written Feedback Report", desc: "Comprehensive examiner feedback with domain-specific comments and scores" },
  { icon: <CheckCircle size={18} />, title: "Mark-Scheme Scoring", desc: "Your performance assessed against the official MRCPI OSCE mark-scheme criteria" },
  { icon: <Video size={18} />, title: "Session Recording", desc: "Optional session recording (if enabled) for self-review and learning" },
  { icon: <Bell size={18} />, title: "Improvement Plan", desc: "Personalised recommendations for areas of focus before your examination" },
];

export default function MockOscePage() {
  const [availableDates, setAvailableDates] = useState<SlotRow[]>([]);
  const [selected, setSelected] = useState<{ date: string; slot: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("mock_osce_slots")
      .select("id, date_label, slots")
      .eq("visible", true)
      .order("sort_order")
      .then(({ data }) => { if (data) setAvailableDates(data); });
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("osce_bookings").insert([{
      name: form.name,
      email: form.email,
      date: selected.date,
      time_slot: selected.slot,
      notes: form.notes,
    }]);
    setLoading(false);
    if (error) {
      setError("Something went wrong. Please try again or contact us directly.");
    } else {
      setBooked(true);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>
                Live Mock Examinations
              </p>
              <h1 className="font-serif text-white font-semibold mb-5" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
                One-to-one Mock OSCE Sessions
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Experience the real examination before exam day. Each session is conducted live between you and an experienced OBGYN examiner — timed stations, mark-scheme assessment, and structured feedback.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: <Clock size={14} />, text: "8 minutes per station" },
                  { icon: <Video size={14} />, text: "Secure video call" },
                  { icon: <Globe size={14} />, text: "International candidates" },
                  { icon: <FileText size={14} />, text: "Written report included" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-sm px-3 py-2 rounded-full border" style={{ borderColor: "rgba(21,176,151,0.25)", color: "rgba(255,255,255,0.7)" }}>
                    <span style={{ color: "var(--teal-bright)" }}>{b.icon}</span> {b.text}
                  </div>
                ))}
              </div>
              <Link
                href="#booking"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
              >
                Book a Session <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-xl border p-6" style={{ borderColor: "rgba(21,176,151,0.2)", backgroundColor: "rgba(255,255,255,0.04)" }}>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Session Structure</p>
              {[
                { phase: "0:00 – 2:00", label: "Candidate reads station brief", type: "Preparation" },
                { phase: "2:00 – 10:00", label: "Timed OSCE station (8 min)", type: "Live Station" },
                { phase: "10:00 – 12:00", label: "Examiner completes mark scheme", type: "Scoring" },
                { phase: "12:00 – 15:00", label: "Verbal debrief and feedback", type: "Feedback" },
                { phase: "×3", label: "Three stations per session", type: "Repeat" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="font-mono-data text-xs w-20 flex-shrink-0" style={{ color: "var(--teal-bright)" }}>{p.phase}</span>
                  <div>
                    <p className="text-sm text-white">{p.label}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>How It Works</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
              Four simple steps to your mock OSCE
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionSteps.map((s) => (
              <div key={s.step} className="relative">
                <div className="font-serif text-6xl font-bold mb-4 leading-none" style={{ color: "rgba(21,176,151,0.12)" }}>{s.step}</div>
                <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: "var(--navy)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE DATES */}
      <section id="booking" className="py-20 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Availability</p>
              <h2 className="font-serif font-semibold mb-8" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "var(--navy)" }}>
                Available session dates
              </h2>
              <div className="space-y-4">
                {availableDates.map((d) => (
                  <div key={d.id} className="rounded-xl border p-6 bg-white" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar size={16} style={{ color: "var(--teal)" }} />
                      <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{d.date_label}</p>
                    </div>
                    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={`Available times for ${d.date_label}`}>
                      {d.slots.map((slot) => {
                        const isActive = selected?.date === d.date_label && selected?.slot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => setSelected({ date: d.date_label, slot })}
                            className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
                            style={{
                              borderColor: isActive ? "var(--teal-bright)" : "rgba(15,76,92,0.2)",
                              backgroundColor: isActive ? "var(--teal-bright)" : "transparent",
                              color: "var(--navy)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>
                All times shown in Arabia Standard Time (AST — Riyadh, Saudi Arabia). Your local time will be displayed at checkout.
              </p>
            </div>

            {/* Booking card */}
            <div>
              <div className="rounded-xl border sticky top-24" style={{ borderColor: "rgba(15,76,92,0.2)", overflow: "hidden" }}>
                <div className="p-6" style={{ backgroundColor: "var(--navy)" }}>
                  <p className="font-mono-data text-xs uppercase tracking-widest mb-2" style={{ color: "var(--teal-bright)" }}>Book a Session</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>Contact us for current mock exam fees and enrolment details.</p>
                </div>
                <div className="p-6 bg-white">
                  {booked ? (
                    <div className="text-center py-4">
                      <CheckCircle size={36} className="mx-auto mb-3" style={{ color: "var(--teal-bright)" }} />
                      <p className="font-serif font-semibold text-lg mb-1" style={{ color: "var(--navy)" }}>Booking Request Sent!</p>
                      <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
                        We will confirm your session for <strong>{selected?.date}</strong> at <strong>{selected?.slot}</strong> within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleBook} className="space-y-4">
                      {selected ? (
                        <div className="rounded-lg px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "var(--navy)" }}>
                          <span style={{ color: "var(--teal)" }}>Selected: </span>{selected.date} · {selected.slot}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>← Select a date and time slot to book</p>
                      )}
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Full Name *</label>
                        <input
                          type="text" required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Dr. Jane Smith"
                          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Email Address *</label>
                        <input
                          type="email" required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Notes (optional)</label>
                        <textarea
                          rows={2}
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          placeholder="Any specific areas to focus on?"
                          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
                          style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                        />
                      </div>
                      {error && <p className="text-xs text-red-600">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading || !selected}
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                      >
                        <Send size={14} /> {loading ? "Sending…" : "Request Booking"}
                      </button>
                      <Link
                        href="/contact"
                        className="block w-full text-center py-3 rounded-lg font-semibold text-sm border transition-all"
                        style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }}
                      >
                        Ask a Question
                      </Link>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Examiner Feedback</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
              Structured feedback that drives improvement
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {feedbackComponents.map((f, i) => (
              <div key={i} className="rounded-xl border p-6 bg-white" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--navy)" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
