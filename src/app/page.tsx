import Link from "next/link";
import {
  ArrowRight, CheckCircle, Star, Award, BookOpen,
  Users, Video, FileText, Calendar, MessageSquare, ShieldCheck
} from "lucide-react";

const credentials = [
  { title: "Sexual Health Diploma", date: "Feb 2023", institution: "American University of Science and Technology" },
  { title: "Mini Masters of Family Counselling & Mental Health", date: "Jan 2023", institution: "American University of Science and Technology" },
  { title: "Infection Control Diploma", date: "Dec 2022", institution: "American University of Science and Technology" },
  { title: "Certified Professional Diploma – Aesthetic Gynecology", date: "Nov 2022", institution: "American Institute for Applied Education" },
  { title: "Therapeutic Feeding Diploma", date: "Oct 2022", institution: "American University of Science and Technology" },
  { title: "Occupational Safety and Health Diploma", date: "Dec 2022", institution: "American University of Science and Technology" },
  { title: "Medical Quality Diploma", date: "Dec 2022", institution: "American University of Science and Technology" },
  { title: "Hospital Management Diploma", date: "Mar 2023", institution: "American University of Science and Technology" },
];

const whyChoose = [
  { icon: <Award size={22} />, title: "Expert-Led Preparation", body: "Learn directly from Dr. Einas Diab — an experienced OBGYN clinician with a distinguished academic portfolio and proven OSCE teaching record." },
  { icon: <Video size={22} />, title: "Structured Video Lessons", body: "High-quality, domain-specific video lectures covering every OSCE station type, mark-scheme criteria, and clinical communication skills." },
  { icon: <Users size={22} />, title: "Live Mock OSCE Sessions", body: "One-to-one live mock examinations with structured examiner feedback, scoring sheets, and personalised improvement recommendations." },
  { icon: <FileText size={22} />, title: "Comprehensive Study Materials", body: "Downloadable PDF guides, flashcard libraries, and practice station scripts — all aligned to the current MRCPI O&G OSCE blueprint." },
  { icon: <Calendar size={22} />, title: "Flexible Scheduling", body: "Book mock examinations at times that suit your schedule. International time-zone support for candidates worldwide." },
  { icon: <ShieldCheck size={22} />, title: "Trusted & Secure Platform", body: "Secure login, protected content, progress tracking, and certificate generation — everything you need in one professional learning environment." },
];

const courseHighlights = [
  { label: "OSCE Station Library", value: "78+", desc: "Structured practice stations across all domains" },
  { label: "Video Lessons", value: "50+", desc: "High-quality recorded lectures and tutorials" },
  { label: "Mock OSCE Sessions", value: "1:1", desc: "Live sessions with examiner feedback" },
  { label: "Pass Rate", value: "94%", desc: "Of enrolled candidates report improved confidence" },
];

const faqs = [
  { q: "What is the MRCPI OBGYN OSCE?", a: "The MRCPI Part 2 OSCE (Objective Structured Clinical Examination) is a practical assessment for doctors specialising in Obstetrics & Gynaecology under the Royal College of Physicians of Ireland pathway." },
  { q: "Who is this course designed for?", a: "This platform is designed for OBGYN trainees, international medical graduates, and any doctor preparing for the MRCPI Part 2 OSCE examination." },
  { q: "How do the live mock OSCE sessions work?", a: "You book a one-to-one session with an experienced examiner. The session is conducted via secure video call, follows real OSCE format, and includes structured feedback and scoring." },
  { q: "Can I access course materials on mobile?", a: "Yes — the platform is fully responsive and optimised for desktop, tablet, and mobile devices." },
  { q: "Is the course content regularly updated?", a: "Yes. All materials are reviewed and updated regularly to reflect the current MRCPI O&G OSCE blueprint and any changes to examination format." },
];

const testimonials = [
  { name: "Dr. Sarah M.", role: "OBGYN Trainee, Egypt", quote: "Dr. Einas's structured approach completely transformed my preparation. The mock sessions were invaluable — I passed first time.", stars: 5 },
  { name: "Dr. Rania K.", role: "IMg, Jordan", quote: "The video lessons and mark-scheme guides helped me understand exactly what examiners are looking for. Highly recommended.", stars: 5 },
  { name: "Dr. Ahmed T.", role: "OBGYN Resident, UAE", quote: "The live mock OSCE with feedback is worth every penny. Real exam conditions, expert guidance, and clear improvement areas.", stars: 5 },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="min-h-[92vh] flex items-center relative overflow-hidden"
        style={{ backgroundColor: "var(--navy)" }}
        aria-labelledby="hero-headline"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, var(--teal-bright) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <span className="inline-block font-mono-data text-xs px-3 py-1.5 rounded-full border mb-6 uppercase tracking-widest" style={{ color: "var(--teal-bright)", borderColor: "rgba(21,176,151,0.3)", backgroundColor: "rgba(21,176,151,0.08)" }}>
                MRCPI OBGYN OSCE PREPARATION
              </span>
              <h1
                id="hero-headline"
                className="font-serif text-white font-semibold leading-tight mb-6"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
              >
                Pass the MRCPI OBGYN OSCE{" "}
                <span style={{ color: "var(--teal-bright)" }}>with Confidence</span>
              </h1>
              <p className="text-base leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.65)" }}>
                Expert-led, structured preparation for the MRCPI Part 2 Obstetrics &amp; Gynaecology OSCE. Live mock sessions, video lessons, and a comprehensive station library — guided by Dr. Einas Diab.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                >
                  Enroll Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}
                >
                  Book a Consultation
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  "Blueprint-aligned content",
                  "Live 1:1 mock examinations",
                  "Structured mark-scheme feedback",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <CheckCircle size={14} style={{ color: "var(--teal-bright)" }} /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {courseHighlights.map((h) => (
                <div
                  key={h.label}
                  className="rounded-xl border p-6"
                  style={{ borderColor: "rgba(21,176,151,0.2)", backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <p className="font-serif text-white font-bold mb-1" style={{ fontSize: "2.2rem", color: "var(--teal-bright)" }}>
                    {h.value}
                  </p>
                  <p className="font-semibold text-white text-sm mb-1">{h.label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ backgroundColor: "var(--teal)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-center">
          {[
            "MRCPI O&G OSCE Blueprint-Aligned",
            "Live Examiner Feedback",
            "International Candidates Welcome",
            "Secure & Protected Platform",
          ].map((t) => (
            <p key={t} className="font-mono-data text-xs tracking-wide text-white/80">{t}</p>
          ))}
        </div>
      </section>

      {/* MEET THE MENTOR */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Photo placeholder */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ border: "2px solid rgba(201,162,39,0.2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dr-einas-diab.jpg"
                  alt="Dr. Einas Diab — MRCPI OBGYN Specialist & Educator"
                  className="w-full h-full object-cover object-top"
                  style={{ aspectRatio: "4/5", display: "block" }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-6 py-4" style={{ background: "linear-gradient(to top, rgba(61,10,20,0.92) 0%, transparent 100%)" }}>
                  <p className="font-mono-data text-xs uppercase tracking-widest mb-1" style={{ color: "var(--teal-bright)" }}>Your Mentor</p>
                  <p className="font-serif font-semibold text-xl text-white">Dr. Einas Diab</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>MRCPI OBGYN Specialist &amp; Educator</p>
                </div>
              </div>
              {/* Credential badge */}
              <div
                className="absolute -bottom-4 -right-4 rounded-xl border p-4 shadow-lg hidden sm:block"
                style={{ backgroundColor: "white", borderColor: "rgba(15,76,92,0.15)" }}
              >
                <p className="font-mono-data text-xs uppercase tracking-widest mb-1" style={{ color: "var(--teal)" }}>Qualifications</p>
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>8 Diplomas &amp; Certifications</p>
                <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>2022 – 2023</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, letterSpacing: "0.12em", color: "var(--teal)" }}>
                Who is Who
              </p>
              <h2 className="font-serif font-semibold mb-4" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
                Meet Dr. Einas Diab
              </h2>
              <p className="leading-relaxed mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.2rem", fontWeight: 400, color: "rgba(26,26,26,0.75)" }}>
                Dr. Einas Diab is a distinguished OBGYN clinician and medical educator with extensive clinical and academic experience. She brings a rigorous, structured, and empathetic approach to OSCE coaching — helping candidates not just pass the examination, but develop lasting clinical competence.
              </p>
              <p className="leading-relaxed mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.2rem", fontWeight: 400, color: "rgba(26,26,26,0.75)" }}>
                With a broad portfolio of postgraduate diplomas spanning women&apos;s health, aesthetic gynecology, mental health counselling, and hospital management, Dr. Diab offers a uniquely comprehensive perspective on clinical practice and examination excellence.
              </p>

              {/* Credentials grid */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, letterSpacing: "0.12em", color: "var(--teal)" }}>Academic Credentials</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {credentials.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-lg border p-3.5"
                      style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(255,255,255,0.6)" }}
                    >
                      <p className="mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", fontWeight: 600, color: "var(--navy)" }}>{c.title}</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--teal)" }}>{c.date}</p>
                      <p className="mt-0.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.85rem", fontWeight: 400, color: "rgba(26,26,26,0.5)" }}>{c.institution}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/faculty"
                className="inline-flex items-center gap-2 mt-8 font-semibold text-sm"
                style={{ color: "var(--teal)" }}
              >
                Full Faculty Profile <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Why Choose Us</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
              Everything you need to pass
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-base" style={{ color: "rgba(26,26,26,0.6)" }}>
              MRCPI-OBGYN Unlocked combines clinical expertise, structured pedagogy, and a premium learning platform to give you the best possible chance of success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((w, i) => (
              <div
                key={i}
                className="rounded-xl border p-7 transition-shadow hover:shadow-md"
                style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(255,255,255,0.7)" }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                  {w.icon}
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: "var(--navy)" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSE OVERVIEW */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Course Overview</p>
              <h2 className="font-serif font-semibold mb-5" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
                A complete OSCE preparation system
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(26,26,26,0.65)" }}>
                From foundational knowledge to exam-day confidence — our structured curriculum covers every domain of the MRCPI OBGYN OSCE, with live coaching and detailed mark-scheme guidance at every stage.
              </p>
              <div className="space-y-4">
                {[
                  { label: "History Taking & Communication Stations", desc: "Structured consultations, breaking bad news, and shared decision-making" },
                  { label: "Clinical Examination Stations", desc: "Obstetric and gynaecological examination with examiner mark schemes" },
                  { label: "Emergency Obstetrics Stations", desc: "PPH, pre-eclampsia, cord prolapse, and shoulder dystocia scenarios" },
                  { label: "Procedural & Practical Stations", desc: "Speculum, bimanual, episiotomy repair, and instrument assessment" },
                  { label: "Counselling & Data Interpretation", desc: "Results explanation, consent, and structured management discussions" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(21,176,151,0.15)", color: "var(--teal-bright)" }}>
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--navy)" }}>{item.label}</p>
                      <p className="text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--navy)", color: "white" }}
              >
                View All Courses <ArrowRight size={16} />
              </Link>
            </div>
            {/* Course card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(15,76,92,0.2)" }}
            >
              <div className="p-6" style={{ background: "linear-gradient(135deg, var(--navy), var(--teal))" }}>
                <p className="font-mono-data text-xs uppercase tracking-widest text-white/60 mb-2">Featured Course</p>
                <h3 className="font-serif text-white text-xl font-semibold mb-2">Complete MRCPI OBGYN OSCE Preparation</h3>
                <p className="text-white/65 text-sm">The most comprehensive preparation course available for the MRCPI Part 2 OSCE</p>
              </div>
              <div className="p-6 bg-white">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Duration", value: "12 Weeks" },
                    { label: "Format", value: "Online + Live" },
                    { label: "Stations", value: "78 Practice" },
                    { label: "Mock OSCEs", value: "Included" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-lg p-3" style={{ backgroundColor: "var(--paper)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(26,26,26,0.5)" }}>{d.label}</p>
                      <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{d.value}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/courses"
                  className="block w-full text-center py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                >
                  View Course Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOCK OSCE SECTION */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal-bright)" }}>Mock OSCE Preparation</p>
              <h2 className="font-serif font-semibold mb-5 text-white" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>
                Experience the real exam before exam day
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
                Our one-to-one live mock OSCE sessions replicate the real examination conditions. You&apos;ll be assessed by an experienced examiner, receive a structured scoring report, and leave with a clear improvement plan.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Real exam format — timed stations, examiner brief, mark schemes",
                  "Live video session with experienced OBGYN examiner",
                  "Detailed written feedback report within 24 hours",
                  "Performance analytics and recommended study focus areas",
                  "International time-zone support — book from anywhere",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <CheckCircle size={15} style={{ color: "var(--teal-bright)", flexShrink: 0 }} /> {t}
                  </div>
                ))}
              </div>
              <Link
                href="/mock-osce"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
              >
                Book a Mock OSCE <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-xl border p-8" style={{ borderColor: "rgba(21,176,151,0.2)", backgroundColor: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono-data text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>MOCK SESSION FEEDBACK</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(21,176,151,0.15)", color: "var(--teal-bright)" }}>Complete</span>
              </div>
              {[
                { domain: "Clinical Knowledge", score: 8, max: 10 },
                { domain: "Communication Skills", score: 7, max: 10 },
                { domain: "Examination Technique", score: 9, max: 10 },
                { domain: "Patient Safety", score: 8, max: 10 },
                { domain: "Time Management", score: 7, max: 10 },
              ].map((s) => (
                <div key={s.domain} className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{s.domain}</span>
                    <span className="font-mono-data" style={{ color: "var(--teal-bright)" }}>{s.score}/{s.max}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.score * 10}%`, backgroundColor: "var(--teal-bright)" }} />
                  </div>
                </div>
              ))}
              <p className="mt-6 text-sm italic" style={{ color: "rgba(255,255,255,0.45)" }}>
                &ldquo;Strong examination skills. Recommend focus on time management in communication stations.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Success Stories</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
              Candidates who passed with us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-xl border p-7"
                style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(255,255,255,0.7)" }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--gold)" style={{ color: "var(--gold)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "rgba(26,26,26,0.7)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/testimonials" className="inline-flex items-center gap-2 font-medium text-sm" style={{ color: "var(--teal)" }}>
              Read all success stories <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>FAQ</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "var(--navy)" }}>
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-xl border group"
                style={{ borderColor: "rgba(15,76,92,0.15)" }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-sm list-none" style={{ color: "var(--navy)" }}>
                  {f.q}
                  <span className="ml-4 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-transform group-open:rotate-45" style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--teal)" }}>+</span>
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/faq" className="inline-flex items-center gap-2 font-medium text-sm" style={{ color: "var(--teal)" }}>
              View all FAQs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Begin Your Preparation</p>
          <h2 className="font-serif text-white font-semibold mb-5" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            Your MRCPI OBGYN OSCE success starts here
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Join candidates who have transformed their exam preparation with expert-led structured coaching and live mock sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
            >
              Enroll Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm border transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}
            >
              <MessageSquare size={16} /> Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
