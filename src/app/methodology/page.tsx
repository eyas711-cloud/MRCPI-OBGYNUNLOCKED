import MarkSchemeGrid from "@/components/MarkSchemeGrid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const blueprintRows = [
  { criterion: "History Taking", descriptor: "Systematic, structured history with appropriate prioritisation of presenting complaint and relevant obstetric/gynaecological context" },
  { criterion: "Clinical Examination", descriptor: "Safe, systematic examination technique with appropriate consent, chaperone, and patient communication throughout" },
  { criterion: "Data Interpretation", descriptor: "Accurate reading of investigations including CTGs, ultrasound reports, blood results, and swab findings" },
  { criterion: "Communication", descriptor: "Patient-centred communication including breaking bad news, obtaining informed consent, and managing difficult consultations" },
  { criterion: "Emergency Management", descriptor: "Structured, prioritised response to acute obstetric and gynaecological emergencies with appropriate team communication" },
  { criterion: "Counselling & Shared Decisions", descriptor: "Non-directive counselling, options discussion, and supporting the patient in making an informed, autonomous decision" },
];

const markSchemeRows = [
  {
    criterion: "Opening & Rapport",
    descriptor: "Introduces self appropriately; establishes patient identity; creates an environment conducive to disclosure",
    credit: "full" as const,
    marks: 2,
  },
  {
    criterion: "Presenting Complaint Elicited",
    descriptor: "Uses open questions initially; follows patient's lead before narrowing; does not interrupt prematurely",
    credit: "full" as const,
    marks: 3,
  },
  {
    criterion: "Relevant History Explored",
    descriptor: "Systematically covers obstetric, gynaecological, medical, surgical, family, social, and medication history as relevant",
    credit: "partial" as const,
    marks: 2,
  },
  {
    criterion: "Examination Proposed",
    descriptor: "Offers appropriate examination with consent and chaperone; does not proceed without consent",
    credit: "full" as const,
    marks: 2,
  },
  {
    criterion: "Management Summary",
    descriptor: "Provides clear, structured management plan appropriate to findings; safety-nets; documents plan",
    credit: "none" as const,
    marks: 0,
  },
];

const principles = [
  {
    label: "Structure mirrors the real OSCE",
    body: "Every station is formatted identically to the live exam: candidate task sheet, examiner instructions, simulated patient brief, and a domain-weighted mark scheme. There are no shortcuts or artificial question types.",
  },
  {
    label: "Feedback is mark-scheme driven",
    body: "After each station, feedback maps directly to the examiner mark scheme — not generic tips. You see which criteria you met, partially met, or missed, and why each criterion matters.",
  },
  {
    label: "Difficulty is calibrated by domain",
    body: "Foundation stations focus on structure and safety. Intermediate stations introduce clinical complexity. Advanced stations require integration across domains under time pressure. Each station's level is assigned editorially, not algorithmically.",
  },
  {
    label: "Communication stations are taken seriously",
    body: "Many platforms underweight communication. In the MRCPI O&G OSCE, communication stations are weighted equally with clinical stations. We treat them as such — with detailed mark schemes covering rapport, language, pacing, and closure.",
  },
  {
    label: "No affiliation claims",
    body: "This platform is an independent preparation resource. It is not affiliated with, endorsed by, or officially connected to the Royal College of Physicians of Ireland. The MRCPI examination is set and assessed by RCPI. We prepare candidates — we do not represent the exam board.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal-bright)" }}>
            Our Approach
          </p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Methodology &amp; Design
          </h1>
          <p className="text-base max-w-xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            How this platform is built, what it is based on, and what it does not claim to be.
          </p>
        </div>
      </section>

      {/* Blueprint section */}
      <section id="blueprint" className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
                OSCE Blueprint
              </p>
              <h2 className="font-serif font-semibold mb-5" style={{ fontSize: "1.8rem", color: "var(--navy)" }}>
                Built from the assessment framework, not around it
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>
                The MRCPI O&amp;G OSCE is a structured clinical assessment that tests candidates across six established domains of clinical competence. Stations last between 8 and 10 minutes and are assessed by trained examiners using standardised mark schemes.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(26,26,26,0.65)" }}>
                This platform was built by working backwards from those mark schemes — not from what candidates commonly ask about, or from a question bank of previous papers. The station design starts from: <em>what does an examiner look for in this domain, at this level?</em>
              </p>
              <p className="text-base leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
                The result is a platform where mark-scheme language, domain labelling, and station structure feel immediately familiar when you sit the live exam.
              </p>
            </div>
            <div>
              <MarkSchemeGrid
                title="OSCE Blueprint — Station Types"
                rows={blueprintRows}
                showCredit={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mark scheme section */}
      <section id="markscheme" className="py-20 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
              Mark Scheme Approach
            </p>
            <h2 className="font-serif font-semibold mb-4" style={{ fontSize: "1.8rem", color: "var(--navy)" }}>
              What a real mark scheme looks like
            </h2>
            <p className="text-base max-w-xl" style={{ color: "rgba(26,26,26,0.65)" }}>
              Below is an example of how a communication station is assessed on this platform — the same format used for every station. Each row represents a discrete, examinable behaviour with a clear descriptor and credit level.
            </p>
          </div>
          <MarkSchemeGrid
            title="Example Station: Gynaecological History"
            rows={markSchemeRows}
            showCredit={true}
          />
          <p className="mt-4 text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>
            This is an illustrative example. Credit levels shown above are for demonstration; in practice they reflect candidate performance on that attempt.
          </p>
        </div>
      </section>

      {/* Assessment domains */}
      <section id="domains" className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
              Assessment Domains
            </p>
            <h2 className="font-serif font-semibold mb-4" style={{ fontSize: "1.8rem", color: "var(--navy)" }}>
              Six domains, weighted equally
            </h2>
            <p className="text-base max-w-xl" style={{ color: "rgba(26,26,26,0.65)" }}>
              The MRCPI O&amp;G OSCE does not reward pure knowledge. Candidates are assessed across a balanced set of clinical, communication, and professional competencies.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Clinical Knowledge",
                body: "Accurate, up-to-date clinical knowledge applied to real scenarios — including investigations, differentials, and management principles.",
              },
              {
                label: "Communication",
                body: "Patient-centred language, active listening, appropriate checking of understanding, and management of emotional responses.",
              },
              {
                label: "Clinical Examination",
                body: "Systematic, safe examination technique with appropriate consent, exposure, and reporting of findings.",
              },
              {
                label: "Professionalism",
                body: "Ethical reasoning, recognition of limits of competence, appropriate escalation, and respect for patient autonomy.",
              },
              {
                label: "Time Management",
                body: "Completing station tasks within the time limit, with appropriate prioritisation of tasks and self-correction under pressure.",
              },
              {
                label: "Patient Safety",
                body: "Recognition of red-flag features, safety-netting, appropriate documentation, and safe prescribing principles.",
              },
            ].map((d, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border"
                style={{ borderColor: "rgba(15,76,92,0.18)", backgroundColor: "rgba(255,255,255,0.6)" }}
              >
                <div
                  className="w-8 h-1 rounded mb-4"
                  style={{ backgroundColor: "var(--teal-bright)" }}
                />
                <h3 className="font-serif font-semibold text-base mb-2" style={{ color: "var(--navy)" }}>
                  {d.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>
              Design Principles
            </p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "1.8rem", color: "var(--navy)" }}>
              What we believe about OSCE preparation
            </h2>
          </div>
          <div className="flex flex-col gap-6 max-w-3xl">
            {principles.map((p, i) => (
              <div
                key={i}
                className="flex gap-6 p-6 rounded-lg border"
                style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <div
                  className="font-mono-data text-xs pt-0.5 flex-shrink-0"
                  style={{ color: "var(--teal-bright)", minWidth: "2rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-base mb-2" style={{ color: "var(--navy)" }}>
                    {p.label}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-white font-semibold mb-5" style={{ fontSize: "2rem" }}>
            Ready to practise?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Browse the full station library or view access options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/stations"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
            >
              Browse Stations <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded font-semibold text-sm border transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
