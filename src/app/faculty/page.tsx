import Link from "next/link";
import { ArrowRight, Award, BookOpen, Stethoscope } from "lucide-react";

const credentials = [
  { title: "Membership of Obstetrics and Gynaecology of the Royal College of Physicians of Ireland", date: "", institution: "Royal College of Physicians of Ireland", category: "MRCPI" },
  { title: "Sexual Health Diploma", date: "February 2023", institution: "American University of Science and Technology", category: "Clinical" },
  { title: "Mini Masters of Family Counselling & Mental Health", date: "January 2023", institution: "American University of Science and Technology", category: "Mental Health" },
  { title: "Infection Control Diploma", date: "December 2022", institution: "American University of Science and Technology", category: "Clinical" },
  { title: "Certified Professional Diploma – Aesthetic Gynecology", date: "November 2022", institution: "American Institute for Applied Education", category: "Gynecology" },
  { title: "Therapeutic Feeding Diploma", date: "October 2022", institution: "American University of Science and Technology", category: "Nutrition" },
  { title: "Occupational Safety and Health Diploma", date: "December 2022", institution: "American University of Science and Technology", category: "Safety" },
  { title: "Medical Quality Diploma", date: "December 2022", institution: "American University of Science and Technology", category: "Quality" },
  { title: "Hospital Management Diploma", date: "March 2023", institution: "American University of Science and Technology", category: "Management" },
];

const teachingAreas = [
  { icon: <Stethoscope size={20} />, area: "Obstetric Clinical Stations", desc: "Antenatal care, intrapartum management, and emergency obstetrics scenarios" },
  { icon: <BookOpen size={20} />, area: "Gynaecological History & Examination", desc: "Structured consultation technique and examination mark-scheme guidance" },
  { icon: <Award size={20} />, area: "Communication & Counselling", desc: "Breaking bad news, consent, and shared decision-making stations" },
  { icon: <Stethoscope size={20} />, area: "Mock OSCE Examination", desc: "One-to-one live examination sessions with structured scoring and feedback" },
];

export default function FacultyPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Our Faculty</p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Meet your educators
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            MRCPI-OBGYN Unlocked is led by an experienced clinician and educator committed to helping candidates achieve their MRCPI OBGYN OSCE ambitions.
          </p>
        </div>
      </section>

      {/* DR. EINAS DIAB */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Photo */}
            <div>
              <div
                className="rounded-2xl overflow-hidden relative mb-6"
                style={{ border: "2px solid rgba(201,162,39,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dr-einas-diab.jpg"
                  alt="Dr. Einas Diab — MRCPI OBGYN Specialist & Educator"
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: "3/4", display: "block" }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4" style={{ background: "linear-gradient(to top, rgba(61,10,20,0.92) 0%, transparent 100%)" }}>
                  <p className="font-serif font-semibold text-lg text-white">Dr. Einas Diab</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>MRCPI OBGYN Specialist</p>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--teal-bright)", opacity: 0.7 }} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--teal-bright)" }}>8 Postgraduate Diplomas</p>
                </div>
              </div>

              <div className="rounded-xl border p-5 bg-white" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal)" }}>Teaching Areas</p>
                <div className="space-y-3">
                  {teachingAreas.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                        {t.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-xs mb-0.5" style={{ color: "var(--navy)" }}>{t.area}</p>
                        <p className="text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <div className="mb-2">
                <span className="inline-block font-mono-data text-xs px-3 py-1 rounded-full border mb-4" style={{ color: "var(--teal)", borderColor: "rgba(15,76,92,0.2)" }}>
                  Lead Instructor & Examiner
                </span>
              </div>
              <h2 className="font-serif font-semibold mb-2" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
                Dr. Einas Diab
              </h2>
              <p className="text-base mb-6" style={{ color: "var(--teal)" }}>MRCPI OBGYN Specialist · Clinical Educator · OSCE Examiner</p>

              <div className="space-y-4 mb-8 text-base leading-relaxed" style={{ color: "rgba(26,26,26,0.7)" }}>
                <p>
                  Dr. Einas Diab is a highly experienced Obstetrics & Gynaecology clinician and medical educator. With extensive postgraduate training and a distinguished portfolio of clinical and academic achievements, she brings unparalleled expertise to MRCPI OBGYN OSCE preparation.
                </p>
                <p>
                  Dr. Diab has developed the MRCPI-OBGYN Unlocked curriculum from the ground up — drawing on her deep understanding of the examination format, examiner expectations, and the common pitfalls that candidates face. Her teaching approach is structured, evidence-based, and candidate-centred.
                </p>
                <p>
                  Her broad academic background spans women&apos;s health, aesthetic gynecology, mental health counselling, infection control, medical quality, and hospital management — giving her a uniquely comprehensive perspective on clinical practice and examination excellence.
                </p>
                <p>
                  Dr. Diab conducts all one-to-one mock OSCE sessions personally, providing candidates with direct access to her expertise and a truly individualised preparation experience.
                </p>
              </div>

              {/* Credentials */}
              <div>
                <p className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "var(--teal)" }}>Academic Credentials & Diplomas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {credentials.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
                      style={{ borderColor: "rgba(15,76,92,0.12)", backgroundColor: "white" }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm leading-snug" style={{ color: "var(--navy)" }}>{c.title}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.08)", color: "var(--teal)" }}>
                          {c.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--teal-bright)" }}>{c.date}</p>
                      <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{c.institution}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/mock-osce" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                  Book a Mock OSCE Session <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm border transition-all" style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--navy)" }}>
                  Contact Dr. Diab
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-white font-semibold text-2xl mb-4">Ready to learn from Dr. Diab?</h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Enroll in a course or book a one-to-one mock OSCE session — and benefit from personalised expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
              View Courses <ArrowRight size={15} />
            </Link>
            <Link href="/mock-osce" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm border transition-all hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}>
              Book Mock OSCE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
