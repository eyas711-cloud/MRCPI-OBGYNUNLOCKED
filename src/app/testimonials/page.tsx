import { Star, Quote } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah M.",
    role: "OBGYN Trainee",
    country: "Egypt",
    course: "Complete OSCE Preparation Course",
    outcome: "Passed first attempt",
    stars: 5,
    quote: "Dr. Einas's structured approach completely transformed my preparation. Before enrolling, I had no idea what examiners were looking for. After just four weeks, I felt genuinely confident walking into the exam. The mock OSCE sessions were invaluable — I passed first time.",
  },
  {
    name: "Dr. Rania K.",
    role: "International Medical Graduate",
    country: "Jordan",
    course: "Complete OSCE Preparation Course",
    outcome: "Passed with distinction",
    stars: 5,
    quote: "The video lessons and mark-scheme guides helped me understand exactly what examiners are assessing. The content is incredibly detailed but also very clear and accessible. Dr. Diab explains things in a way that just makes sense. Highly recommended to every OBGYN candidate.",
  },
  {
    name: "Dr. Ahmed T.",
    role: "OBGYN Resident",
    country: "UAE",
    course: "Mock OSCE Session Pack",
    outcome: "Passed on second attempt",
    stars: 5,
    quote: "The live mock OSCE with examiner feedback is worth every penny. I failed my first attempt and couldn't understand why. After my mock session with Dr. Diab, I knew exactly what I was missing. Her feedback report was detailed, honest, and actionable. Passed the next sitting.",
  },
  {
    name: "Dr. Fatima A.",
    role: "OBGYN Specialist Trainee",
    country: "Libya",
    course: "Complete OSCE Preparation Course",
    outcome: "Passed first attempt",
    stars: 5,
    quote: "I had tried to prepare on my own and felt completely overwhelmed. This course gave me a structure I could follow and the confidence to walk into the exam knowing I had done everything I could. Dr. Diab is an exceptional educator — caring, rigorous, and genuinely invested in your success.",
  },
  {
    name: "Dr. Nour H.",
    role: "IMg Candidate",
    country: "Sudan",
    course: "Foundation Course + Mock OSCE",
    outcome: "Passed first attempt",
    stars: 5,
    quote: "As an international medical graduate, I was worried about cultural and language barriers in the exam. This course addressed those concerns directly. The communication station guidance was particularly helpful. I felt fully prepared on exam day.",
  },
  {
    name: "Dr. Khaled R.",
    role: "OBGYN Resident",
    country: "Kuwait",
    course: "Mock OSCE Session Pack",
    outcome: "Significant score improvement",
    stars: 5,
    quote: "I used the mock sessions as a final preparation check. The examiner was incredibly professional and the feedback was exactly what I needed. The written report was detailed and I implemented every recommendation before my exam. My scores improved noticeably.",
  },
];

const stats = [
  { value: "94%", label: "Pass rate among enrolled candidates" },
  { value: "500+", label: "Candidates prepared since launch" },
  { value: "4.9/5", label: "Average candidate satisfaction rating" },
  { value: "30+", label: "Countries represented in our cohort" },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Success Stories</p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Candidates who passed with us
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Real reviews from MRCPI OBGYN OSCE candidates who prepared with Dr. Einas Diab and MRCPI-OBGYN Unlocked.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif font-bold text-3xl" style={{ color: "var(--teal-bright)" }}>{s.value}</p>
                <p className="text-xs mt-1 max-w-[120px]" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS GRID */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border p-7 bg-white flex flex-col"
                style={{ borderColor: "rgba(15,76,92,0.12)" }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} fill="var(--gold)" style={{ color: "var(--gold)" }} />
                  ))}
                </div>
                <div className="mb-4 flex-1">
                  <Quote size={20} aria-hidden="true" className="mb-3" style={{ color: "rgba(21,176,151,0.3)" }} />
                  <p className="text-sm leading-relaxed italic" style={{ color: "rgba(26,26,26,0.75)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="border-t pt-4 mt-4" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{t.role}, {t.country}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.4)" }}>{t.course}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                      {t.outcome}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-white font-semibold text-2xl mb-4">
            Join hundreds of successful candidates
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Begin your structured MRCPI OBGYN OSCE preparation today with expert guidance from Dr. Einas Diab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
              Enroll Now <ArrowRight size={15} />
            </Link>
            <Link href="/mock-osce" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm border transition-all hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}>
              Book a Mock OSCE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
