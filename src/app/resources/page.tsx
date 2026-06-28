import Link from "next/link";
import { ArrowRight, FileText, Lightbulb } from "lucide-react";

const freeGuides = [
  { title: "MRCPI OBGYN OSCE Blueprint Overview", type: "PDF Guide", pages: "12 pages", desc: "A structured overview of the current MRCPI O&G OSCE format, domains, and marking criteria.", locked: true },
  { title: "OSCE Communication Framework", type: "PDF Guide", pages: "8 pages", desc: "A step-by-step consultation structure for communication and counselling stations.", locked: true },
  { title: "Antenatal History Taking Template", type: "PDF Template", pages: "4 pages", desc: "Structured antenatal history-taking guide aligned to the MRCPI OSCE mark scheme.", locked: true },
  { title: "Emergency Obstetrics Quick Reference", type: "PDF Reference", pages: "6 pages", desc: "Key management algorithms for common obstetric emergencies — PPH, eclampsia, cord prolapse.", locked: true },
  { title: "Gynaecological Examination Checklist", type: "PDF Checklist", pages: "5 pages", desc: "Systematic examination checklist with examiner mark-scheme checkpoints.", locked: true },
  { title: "OSCE Flashcard Pack — 100 Cards", type: "Digital Flashcards", pages: "100 cards", desc: "Rapid-revision flashcard set covering core clinical knowledge for all OSCE domains.", locked: true },
];

const osceTips = [
  { number: "01", tip: "Structure every consultation", body: "Examiners mark against a structured mark scheme. Begin with a clear introduction, set an agenda, and close with a safety-net. Never skip the structure, even under time pressure." },
  { number: "02", tip: "Know your time limit", body: "Most MRCPI OSCE stations are 8 minutes. Practice under timed conditions from day one. Candidates who run over time lose marks — it is treated as a professional competency, not just logistics." },
  { number: "03", tip: "Use the examiner brief", body: "Read the candidate brief carefully. The examiner brief tells you exactly what the examiner will be assessing. Identify the key tasks before you start the station." },
  { number: "04", tip: "Prioritise patient safety", body: "Safety-netting, red flags, escalation, and safeguarding are explicit mark-scheme points in most stations. Never omit a safety statement, even in a communication station." },
  { number: "05", tip: "Show empathy — not sympathy", body: "Examiners assess whether you acknowledge emotion and respond appropriately. Use ICE (Ideas, Concerns, Expectations), check understanding, and reflect feelings without being overly emotive." },
  { number: "06", tip: "Do not over-diagnose aloud", body: "State what you know, acknowledge uncertainty appropriately, and avoid premature closure. Showing structured clinical reasoning is often more important than the final diagnosis." },
];

const blogs = [
  { title: "How to Approach Communication Stations in the MRCPI OBGYN OSCE", date: "March 2025", readTime: "8 min read", tag: "Communication", excerpt: "Communication stations are among the highest-scoring components of the MRCPI OBGYN OSCE. Here's how to structure your consultation and meet every mark-scheme criterion..." },
  { title: "The 5 Most Common Mistakes in OSCE Stations — And How to Avoid Them", date: "February 2025", readTime: "6 min read", tag: "Exam Strategy", excerpt: "After observing hundreds of OSCE candidates, Dr. Einas Diab identifies the five most consistent errors that cost marks — and the corrections that make the difference..." },
  { title: "Breaking Bad News in OBGYN: A Structured SPIKES Framework for the OSCE", date: "January 2025", readTime: "10 min read", tag: "Clinical Skills", excerpt: "The SPIKES protocol is a reliable structure for breaking bad news stations. Learn how to apply it within the MRCPI OSCE time constraints and mark-scheme expectations..." },
  { title: "Emergency Obstetrics OSCE Stations: What Examiners Really Want to See", date: "December 2024", readTime: "7 min read", tag: "Emergency Care", excerpt: "Emergency stations are high-stakes and often high-anxiety. Here's how to demonstrate systematic clinical thinking, prioritisation, and safe escalation under pressure..." },
];

export default function ResourcesPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal-bright)" }}>Study Resources</p>
          <h1 className="font-serif text-white font-semibold mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Free study materials & OSCE guides
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Access free PDF guides, OSCE tips, and expert blog articles to support your MRCPI OBGYN OSCE preparation.
          </p>
        </div>
      </section>

      {/* FREE GUIDES */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>Study Guides</p>
              <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "var(--navy)" }}>Study materials & templates</h2>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
            >
              Unlock with Course <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {freeGuides.map((g, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 bg-white relative"
                style={{ borderColor: "rgba(15,76,92,0.15)", opacity: g.locked ? 0.75 : 1 }}
              >
                {g.locked && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "var(--gold)" }}>
                      Member Only
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--teal)" }}>{g.type}</p>
                    <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{g.pages}</p>
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-base mb-2" style={{ color: "var(--navy)" }}>{g.title}</h3>
                <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(26,26,26,0.6)" }}>{g.desc}</p>
                {!g.locked && (
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--teal)" }}>
                    View Guide <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OSCE TIPS */}
      <section id="tips" className="py-20 px-6" style={{ backgroundColor: "rgba(11,30,61,0.03)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>Expert Advice</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "var(--navy)" }}>
              6 essential OSCE tips from Dr. Diab
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {osceTips.map((t) => (
              <div key={t.number} className="rounded-xl border p-6 bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="font-serif text-5xl font-bold mb-4 leading-none" style={{ color: "rgba(21,176,151,0.15)" }}>{t.number}</div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={14} style={{ color: "var(--teal-bright)" }} />
                  <h3 className="font-serif font-semibold text-base" style={{ color: "var(--navy)" }}>{t.tip}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-20 px-6" style={{ backgroundColor: "var(--paper)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="font-mono-data text-xs uppercase tracking-widest mb-2" style={{ color: "var(--teal)" }}>Blog</p>
            <h2 className="font-serif font-semibold" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "var(--navy)" }}>
              Expert insights & preparation guides
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogs.map((b, i) => (
              <article key={i} className="rounded-xl border p-6 bg-white transition-shadow hover:shadow-sm" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                    {b.tag}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{b.date} · {b.readTime}</span>
                </div>
                <h3 className="font-serif font-semibold text-lg mb-3" style={{ color: "var(--navy)" }}>{b.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(26,26,26,0.65)" }}>{b.excerpt}</p>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--teal)" }}>
                  Read article <ArrowRight size={13} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
