import Link from "next/link";
import { CheckCircle, Clock, Video, Award } from "lucide-react";
import { createClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Courses | MRCPI-OBGYN Unlocked",
  description: "Explore our expert-led MRCPI OBGYN OSCE preparation courses — from foundation to complete exam preparation, including live mock sessions.",
};

const curriculum = [
  { week: "Weeks 1–2",   topic: "Examination Blueprint & Communication Framework" },
  { week: "Weeks 3–4",   topic: "Obstetric History Taking & Antenatal Stations" },
  { week: "Weeks 5–6",   topic: "Intrapartum & Emergency Obstetrics Stations" },
  { week: "Weeks 7–8",   topic: "Gynaecological History & Examination Stations" },
  { week: "Weeks 9–10",  topic: "Counselling, Consent & Communication Stations" },
  { week: "Weeks 11–12", topic: "Mock OSCEs, Feedback & Final Preparation" },
];

export default async function CoursesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["course_title", "course_subtitle", "course_price", "course_price_visible", "course_duration", "course_format", "course_description", "course_outcomes", "course_enrolment_open"]);

  const s: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { s[r.key] = r.value ?? ""; });

  const title = s.course_title || "Complete MRCPI OBGYN OSCE Preparation";
  const subtitle = s.course_subtitle || "The all-in-one system to pass your MRCPI Part 2 OSCE";
  const price = s.course_price || "Contact us";
  const duration = s.course_duration || "8–9 Weeks";
  const format = s.course_format || "Online + Live Sessions";
  const description = s.course_description || "";
  const outcomes = (s.course_outcomes || "").split("\n").map(o => o.trim()).filter(Boolean);
  const enrolmentOpen = s.course_enrolment_open !== "false";
  const priceVisible = s.course_price_visible !== "false";

  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>
            Courses & Programmes
          </p>
          <h1 className="font-serif text-white font-semibold mb-5" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Expert-led OSCE preparation courses
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Choose the programme that matches your preparation stage. All courses are guided by Dr. Einas Diab and aligned to the current MRCPI Obstetrics & Gynaecology OSCE blueprint.
          </p>
        </div>
      </section>

      {/* COURSE */}
      <section id="osce-prep" className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--teal-bright)", boxShadow: "0 0 0 2px rgba(21,176,151,0.15)" }}
          >
            <div className="py-2 px-6 text-xs font-semibold text-center font-mono-data uppercase tracking-widest"
              style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
              Recommended for Exam Candidates
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Main info */}
              <div className="lg:col-span-2 p-8 bg-white">
                <h2 className="font-serif font-semibold text-2xl mb-2" style={{ color: "var(--navy)" }}>{title}</h2>
                <p className="text-sm mb-5" style={{ color: "rgba(26,26,26,0.55)" }}>{subtitle}</p>
                <div className="flex flex-wrap gap-5 mb-6 text-sm">
                  <div className="flex items-center gap-2" style={{ color: "rgba(26,26,26,0.6)" }}>
                    <Clock size={14} style={{ color: "var(--teal)" }} /> {duration}
                  </div>
                  <div className="flex items-center gap-2" style={{ color: "rgba(26,26,26,0.6)" }}>
                    <Video size={14} style={{ color: "var(--teal)" }} /> {format}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(26,26,26,0.7)" }}>{description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Learning Outcomes</p>
                    <ul className="space-y-2">
                      {outcomes.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(26,26,26,0.7)" }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--teal-bright)" }} /> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Curriculum Overview</p>
                    <ul className="space-y-2">
                      {curriculum.map((cu, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-semibold" style={{ color: "var(--navy)" }}>{cu.week}: </span>
                          <span style={{ color: "rgba(26,26,26,0.65)" }}>{cu.topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enrolment panel */}
              <div className="p-8 flex flex-col justify-between" style={{ backgroundColor: "var(--navy)" }}>
                <div>
                  <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Enrolment</p>
                  {priceVisible && price && (
                    <p className="font-serif font-bold text-3xl mb-2 text-white">{price}</p>
                  )}
                  {!priceVisible && (
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--teal-bright)" }}>Email us for fees enquiry</p>
                  )}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {enrolmentOpen
                      ? "Contact us for enrolment details and to secure your place."
                      : "Enrolment is currently closed. Join our waitlist by contacting us."}
                  </p>
                  <div className="space-y-1 mb-4">
                    <a href="mailto:info@mrcpiobgynunlocked.com" className="block text-xs hover:underline" style={{ color: "rgba(255,255,255,0.55)" }}>info@mrcpiobgynunlocked.com</a>
                    <a href="mailto:adminmrcpi@gmail.com" className="block text-xs hover:underline" style={{ color: "rgba(255,255,255,0.55)" }}>adminmrcpi@gmail.com</a>
                  </div>
                  <div className="my-6 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  <ul className="space-y-3 mb-8">
                    {["Secure student dashboard", "Certificate on completion", "GDPR-compliant data handling"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <CheckCircle size={13} style={{ color: "var(--teal-bright)" }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  {enrolmentOpen ? (
                    <Link
                      href="/contact"
                      className="block w-full text-center py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                    >
                      Enquire About Enrolment →
                    </Link>
                  ) : (
                    <div
                      className="block w-full text-center py-3.5 rounded-lg font-semibold text-sm"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                    >
                      Enrolment Closed — Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section id="pricing" className="py-16 px-6" style={{ backgroundColor: "rgba(21,176,151,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <Award size={32} className="mx-auto mb-4" style={{ color: "var(--teal)" }} />
          <h2 className="font-serif font-semibold text-2xl mb-3" style={{ color: "var(--navy)" }}>Our Promise</h2>
          <p className="text-base" style={{ color: "rgba(26,26,26,0.65)" }}>
            Every course is built on rigorous clinical content aligned to the current MRCPI OBGYN OSCE blueprint. If you are not satisfied within 7 days of enrolment, contact us for a full refund — no questions asked.
          </p>
        </div>
      </section>
    </>
  );
}
