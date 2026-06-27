import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Users, Video, FileText, Award, Star } from "lucide-react";

const courses = [
  {
    id: "complete-osce-prep",
    badge: "",
    title: "Complete MRCPI OBGYN OSCE Preparation",
    subtitle: "The all-in-one system to pass your MRCPI Part 2 OSCE",
    duration: "8–9 Weeks",
    format: "Online + Live Sessions",
    price: "£499",
    originalPrice: "£699",
    level: "Intermediate to Advanced",
    description:
      "Our flagship preparation programme covering every domain of the MRCPI OBGYN OSCE. Includes structured video lessons, 78 practice stations, live mock examinations, mark-scheme feedback, and ongoing mentor support from Dr. Einas Diab.",
    outcomes: [
      "Master all 6 MRCPI OBGYN OSCE domains",
      "Complete 78 structured practice stations",
      "Sit 2 full live mock OSCE examinations",
      "Receive detailed written feedback reports",
      "Access downloadable PDF study guides",
      "Earn a course completion certificate",
    ],
    curriculum: [
      { week: "Weeks 1–2", topic: "Examination Blueprint & Communication Framework" },
      { week: "Weeks 3–4", topic: "Obstetric History Taking & Antenatal Stations" },
      { week: "Weeks 5–6", topic: "Intrapartum & Emergency Obstetrics Stations" },
      { week: "Weeks 7–8", topic: "Gynaecological History & Examination Stations" },
      { week: "Weeks 9–10", topic: "Counselling, Consent & Communication Stations" },
      { week: "Weeks 11–12", topic: "Mock OSCEs, Feedback & Final Preparation" },
    ],
    highlight: true,
  },
  {
    id: "mock-osce-pack",
    badge: "High Demand",
    title: "Mock OSCE Session Pack",
    subtitle: "Live 1:1 mock examinations with expert feedback",
    duration: "Flexible",
    format: "Live Video Sessions",
    price: "£149",
    originalPrice: null,
    level: "All Levels",
    description:
      "Book individual or bundled live mock OSCE sessions with an experienced examiner. Each session replicates real exam conditions with timed stations, examiner mark schemes, and a written feedback report.",
    outcomes: [
      "Real exam format and conditions",
      "Detailed examiner scoring and written feedback",
      "Performance analytics by domain",
      "Personalised improvement recommendations",
      "Flexible session scheduling",
      "International time-zone support",
    ],
    curriculum: [
      { week: "Session 1", topic: "3 Timed OSCE Stations (candidate choice of domain)" },
      { week: "Session 2", topic: "Examiner mark-scheme scoring and verbal debrief" },
      { week: "Session 3", topic: "Written feedback report delivered within 24 hours" },
      { week: "Session 4", topic: "Domain-level performance analytics" },
    ],
    highlight: false,
  },
  {
    id: "foundation-course",
    badge: "Starter",
    title: "OSCE Foundation Course",
    subtitle: "Build your core knowledge and examination technique",
    duration: "4 Weeks",
    format: "Online Self-Paced",
    price: "£199",
    originalPrice: null,
    level: "Foundation",
    description:
      "An accessible entry-point for candidates beginning their MRCPI OBGYN OSCE preparation. Covers the examination blueprint, core clinical domains, and fundamental OSCE skills — with video lessons and guided practice materials.",
    outcomes: [
      "Understand the MRCPI O&G OSCE blueprint",
      "Learn examiner assessment criteria",
      "Master OSCE consultation structure",
      "Access 30 foundation practice stations",
      "Download essential study guides",
      "Complete knowledge-check quizzes",
    ],
    curriculum: [
      { week: "Week 1", topic: "OSCE Format, Blueprint & Examiner Perspective" },
      { week: "Week 2", topic: "Obstetric Domains: Core Knowledge & Station Types" },
      { week: "Week 3", topic: "Gynaecological Domains: Core Knowledge & Station Types" },
      { week: "Week 4", topic: "Communication Skills & OSCE Consultation Framework" },
    ],
    highlight: false,
  },
];

export const metadata = {
  title: "Courses | MRCPI-OBGYN Unlocked",
  description: "Explore our expert-led MRCPI OBGYN OSCE preparation courses — from foundation to complete exam preparation, including live mock sessions.",
};

export default function CoursesPage() {
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

      {/* COURSES */}
      <section id="osce-prep" className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto space-y-12">
          {courses.map((c) => (
            <div
              key={c.id}
              id={c.id}
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: c.highlight ? "var(--teal-bright)" : "rgba(15,76,92,0.15)",
                boxShadow: c.highlight ? "0 0 0 2px rgba(21,176,151,0.15)" : "none",
              }}
            >
              {c.highlight && (
                <div className="py-2 px-6 text-xs font-semibold text-center font-mono-data uppercase tracking-widest" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                  Recommended for Exam Candidates
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Main info */}
                <div className="lg:col-span-2 p-8 bg-white">
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    {c.badge && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif font-semibold text-2xl mb-2" style={{ color: "var(--navy)" }}>{c.title}</h2>
                  <p className="text-sm mb-5" style={{ color: "rgba(26,26,26,0.55)" }}>{c.subtitle}</p>
                  <div className="flex flex-wrap gap-5 mb-6 text-sm">
                    <div className="flex items-center gap-2" style={{ color: "rgba(26,26,26,0.6)" }}>
                      <Clock size={14} style={{ color: "var(--teal)" }} /> {c.duration}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: "rgba(26,26,26,0.6)" }}>
                      <Video size={14} style={{ color: "var(--teal)" }} /> {c.format}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(26,26,26,0.7)" }}>{c.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Learning Outcomes</p>
                      <ul className="space-y-2">
                        {c.outcomes.map((o, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(26,26,26,0.7)" }}>
                            <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--teal-bright)" }} /> {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Curriculum Overview</p>
                      <ul className="space-y-2">
                        {c.curriculum.map((cu, i) => (
                          <li key={i} className="text-sm">
                            <span className="font-semibold" style={{ color: "var(--navy)" }}>{cu.week}: </span>
                            <span style={{ color: "rgba(26,26,26,0.65)" }}>{cu.topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Enquiry panel */}
                <div className="p-8 flex flex-col justify-between" style={{ backgroundColor: c.highlight ? "var(--navy)" : "rgba(11,30,61,0.03)" }}>
                  <div>
                    <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: c.highlight ? "var(--teal-bright)" : "var(--teal)" }}>
                      Enrolment
                    </p>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: c.highlight ? "rgba(255,255,255,0.65)" : "rgba(26,26,26,0.65)" }}>
                      Contact us for current course fees, mock exam fees, and enrolment details.
                    </p>
                    <div className="my-6 border-t" style={{ borderColor: c.highlight ? "rgba(255,255,255,0.1)" : "rgba(15,76,92,0.12)" }} />
                    <ul className="space-y-3 mb-8">
                      {[
                        "Secure student dashboard",
                        "Certificate on completion",
                        "GDPR-compliant data handling",
                      ].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm" style={{ color: c.highlight ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.65)" }}>
                          <CheckCircle size={13} style={{ color: "var(--teal-bright)" }} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/contact"
                      className="block w-full text-center py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                    >
                      Enquire About Fees &amp; Enrolment →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
