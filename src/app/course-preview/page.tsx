import Link from "next/link";

export const metadata = {
  title: "Course Preview | MRCPI-OBGYN Unlocked",
  description: "Get a glimpse of what's inside — recorded sessions, clinical PDFs, flashcards, and the student dashboard.",
};

export default function CoursePreviewPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-20 px-6"
        style={{ background: "var(--navy)" }}
      >
        {/* radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(21,176,151,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--teal-bright)" }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 2,
                background: "var(--teal-bright)",
                borderRadius: 1,
              }}
            />
            Course Preview
          </span>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ color: "#F8F7F4", fontFamily: "Georgia, serif" }}
          >
            See What&apos;s Inside
          </h1>
          <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(248,247,244,0.6)" }}>
            A glimpse of the structured material waiting for you — recorded sessions,
            clinical PDFs, flashcards, and a walkthrough of your student dashboard.
          </p>
        </div>
      </section>

      {/* ── MATERIAL PREVIEWS ── */}
      <section className="py-16 px-6" style={{ background: "var(--navy)" }}>
        <div className="max-w-5xl mx-auto">

          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-8"
            style={{ color: "rgba(248,247,244,0.4)" }}
          >
            Sample Material
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

            {/* Recorded Session card */}
            <PreviewCard
              icon="🎙️"
              iconBg="rgba(21,176,151,0.15)"
              type="Recorded Session"
              title="Antepartum Haemorrhage — Sept 2026"
              hint="Sign up to listen →"
              content={
                <div className="flex flex-col gap-3 p-4 h-full" style={{ filter: "blur(5px)", userSelect: "none" }}>
                  {/* waveform */}
                  <div className="flex items-center gap-0.5 h-10 mt-2">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          background: "rgba(21,176,151,0.5)",
                          height: `${30 + Math.sin(i * 0.9) * 25 + Math.cos(i * 1.4) * 15}%`,
                        }}
                      />
                    ))}
                  </div>
                  <FakeLine width="80%" />
                  <FakeLine width="65%" />
                  <FakeLine width="92%" />
                  <FakeLine width="55%" />
                </div>
              }
            />

            {/* Flashcard */}
            <PreviewCard
              icon="🗂️"
              iconBg="rgba(245,158,11,0.15)"
              type="Flashcard"
              title="OSCE Station — Ectopic Pregnancy"
              hint="Sign up to study →"
              content={
                <div className="flex flex-col gap-2 p-4 h-full" style={{ filter: "blur(5px)", userSelect: "none" }}>
                  <div className="flex-1 rounded-lg p-3" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                    <FakeLine width="60%" color="rgba(245,158,11,0.35)" />
                    <div className="mt-2 flex flex-col gap-2">
                      <FakeLine width="90%" /><FakeLine width="75%" /><FakeLine width="50%" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1 py-1">
                    <div style={{ width: 18, height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
                    <div style={{ width: 18, height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
                  </div>
                  <div className="flex-1 rounded-lg p-3" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                    <FakeLine width="75%" /><div className="mt-2 flex flex-col gap-2"><FakeLine width="88%" /><FakeLine width="60%" /></div>
                  </div>
                </div>
              }
            />

            {/* PDF */}
            <PreviewCard
              icon="📄"
              iconBg="rgba(239,68,68,0.15)"
              type="Clinical PDF"
              title="Pre-eclampsia — Key Definitions & Management"
              hint="Sign up to read →"
              content={
                <div className="p-4 h-full" style={{ filter: "blur(5px)", userSelect: "none" }}>
                  <div className="h-full rounded-lg p-3 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <FakeLine width="45%" color="rgba(239,68,68,0.35)" />
                    <FakeLine width="90%" /><FakeLine width="78%" /><FakeLine width="92%" /><FakeLine width="60%" />
                    <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />
                    <FakeLine width="72%" /><FakeLine width="88%" /><FakeLine width="55%" />
                  </div>
                </div>
              }
            />
          </div>

          {/* Dashboard walkthrough */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#12285A",
              border: "1px solid rgba(21,176,151,0.2)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(21,176,151,0.15)",
                    color: "var(--teal-bright)",
                    border: "1px solid rgba(21,176,151,0.3)",
                  }}
                >
                  Walkthrough
                </span>
                <span className="text-sm font-semibold" style={{ color: "#F8F7F4" }}>
                  See the student dashboard in action
                </span>
              </div>
              <span
                className="text-xs font-mono tabular-nums"
                style={{ color: "rgba(248,247,244,0.4)" }}
              >
                0:45
              </span>
            </div>

            {/* Fake screen */}
            <div
              className="relative w-full"
              style={{ aspectRatio: "16/7", background: "#07111f", overflow: "hidden" }}
            >
              {/* sidebar */}
              <div
                className="absolute left-0 top-0 bottom-0 flex flex-col gap-1.5 p-3"
                style={{
                  width: "17%",
                  background: "#0d1e35",
                  borderRight: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ height: 8, width: "70%", background: "rgba(21,176,151,0.6)", borderRadius: 3, marginBottom: 8 }} />
                {[90, 100, 75, 80, 60, 85].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: 6,
                      width: `${w}%`,
                      background: i === 1 ? "rgba(21,176,151,0.35)" : "rgba(255,255,255,0.08)",
                      borderRadius: 3,
                    }}
                  />
                ))}
              </div>

              {/* main area */}
              <div className="absolute top-0 bottom-0 flex flex-col gap-2 p-3" style={{ left: "17%", right: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                  {[14, 22].map((w, i) => (
                    <div key={i} style={{ height: 7, width: `${w}%`, background: i === 1 ? "rgba(21,176,151,0.4)" : "rgba(255,255,255,0.1)", borderRadius: 3 }} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {[true, false, false].map((hi, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1.5 p-2 rounded-lg"
                      style={{
                        background: hi ? "rgba(21,176,151,0.07)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${hi ? "rgba(21,176,151,0.4)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <div style={{ height: 6, width: "75%", background: hi ? "rgba(21,176,151,0.4)" : "rgba(255,255,255,0.12)", borderRadius: 3 }} />
                      <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3 }} />
                      <div style={{ height: 5, width: "60%", background: "rgba(255,255,255,0.07)", borderRadius: 3 }} />
                    </div>
                  ))}
                  <div
                    className="col-span-3 flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(21,176,151,0.2)", flexShrink: 0 }} />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div style={{ height: 6, width: "50%", background: "rgba(255,255,255,0.12)", borderRadius: 3 }} />
                      <div style={{ height: 5, width: "80%", background: "rgba(255,255,255,0.07)", borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* play overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(7,17,31,0.5)" }}>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 60,
                    height: 60,
                    background: "rgba(21,176,151,0.9)",
                    boxShadow: "0 0 0 12px rgba(21,176,151,0.15), 0 0 0 24px rgba(21,176,151,0.07)",
                  }}
                >
                  <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid #0B1E3D", marginLeft: 4 }} />
                </div>
                <p className="mt-4 text-xs font-medium" style={{ color: "rgba(248,247,244,0.6)" }}>
                  Video coming soon — we&apos;re recording it now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <h2
          className="font-serif text-2xl md:text-3xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: "#F8F7F4" }}
        >
          Ready to unlock the full course?
        </h2>
        <p className="mb-8 text-base" style={{ color: "rgba(248,247,244,0.55)" }}>
          Get access to all recorded sessions, PDFs, flashcards, and live feedback.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Enquire Now →
          </Link>
          <Link
            href="/courses"
            className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ color: "rgba(248,247,244,0.65)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            View Course Details
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ── helpers ── */

function PreviewCard({
  icon, iconBg, type, title, hint, content,
}: {
  icon: string;
  iconBg: string;
  type: string;
  title: string;
  hint: string;
  content: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#12285A",
        border: "1px solid rgba(21,176,151,0.2)",
      }}
    >
      {/* header */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "rgba(248,247,244,0.4)" }}
          >
            {type}
          </div>
          <div className="text-xs font-semibold leading-snug" style={{ color: "#F8F7F4" }}>
            {title}
          </div>
        </div>
      </div>

      {/* preview area */}
      <div className="relative" style={{ height: 190 }}>
        <div className="h-full">{content}</div>
        {/* lock overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-5 gap-1.5"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(11,30,61,0.6) 40%, rgba(11,30,61,0.95) 100%)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm mb-1"
            style={{
              background: "rgba(21,176,151,0.18)",
              border: "1.5px solid rgba(21,176,151,0.45)",
            }}
          >
            🔒
          </div>
          <span className="text-xs font-semibold" style={{ color: "rgba(248,247,244,0.7)" }}>
            Members only
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--teal-bright)" }}>
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

function FakeLine({ width, color }: { width: string; color?: string }) {
  return (
    <div
      style={{
        height: 10,
        width,
        borderRadius: 5,
        background: color ?? "rgba(248,247,244,0.18)",
      }}
    />
  );
}
