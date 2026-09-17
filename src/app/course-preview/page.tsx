"use client";

import { useEffect, useState } from "react";
import PdfViewer from "@/components/PdfViewer";

const BG     = "#0B1E3D";
const BG_MID = "#12285A";
const TEAL   = "#15B097";
const OFF_WHITE = "#F8F7F4";

export default function CoursePreviewPage() {
  const [cfUrl, setCfUrl] = useState<string | null>(null);
  const [csUrl, setCsUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/course-preview?item=cf-pdf")
      .then((r) => r.json())
      .then((d) => setCfUrl(d.url ?? null));
    fetch("/api/course-preview?item=antenatal-cs")
      .then((r) => r.json())
      .then((d) => setCsUrl(d.url ?? null));
  }, []);

  return (
    <main style={{ background: BG, minHeight: "100vh", color: OFF_WHITE }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-16 px-6" style={{ background: BG }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(21,176,151,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            <span style={{ display: "inline-block", width: 24, height: 2, background: TEAL, borderRadius: 1 }} />
            Course Preview
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: OFF_WHITE, fontFamily: "Georgia, serif" }}
          >
            See What&apos;s Inside
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(248,247,244,0.6)" }}>
            Real material from the course — a full recorded session, a clinical PDF,
            a strategy flashcard, a last minute prep card, and a walkthrough of the student dashboard.
          </p>
        </div>
      </section>

      {/* ── CONTENT ITEMS ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20 flex flex-col gap-14">

        {/* 1 — RECORDED SESSION */}
        <PreviewBlock number="01" label="Recorded Session" title="Ectopic Pregnancy" accent={TEAL}>
          <VimeoWithPoster videoId="1207380804" title="Ectopic Pregnancy — Recorded Session" />
          <p
            className="mt-3 text-xs leading-relaxed"
            style={{ color: "rgba(248,247,244,0.45)", borderLeft: `3px solid ${TEAL}55`, paddingLeft: 12 }}
          >
            This session is 13 minutes — an edited highlight. Full course sessions typically run 1.5 to 2.5 hours each.
          </p>
        </PreviewBlock>

        {/* 2 — CLINICAL PDF */}
        <PreviewBlock number="02" label="Clinical PDF" title="Cystic Fibrosis and Pregnancy" accent="#f87171">
          {cfUrl ? (
            <div className="rounded-xl overflow-hidden" style={{ height: 520, background: BG_MID }}>
              <PdfViewer url={cfUrl} title="Cystic Fibrosis and Pregnancy" />
            </div>
          ) : (
            <PdfSkeleton />
          )}
        </PreviewBlock>

        {/* 3 — FLASHCARD */}
        <PreviewBlock number="03" label="Strategy Flashcard" title="Time Management" accent="#fbbf24">
          <TimeManagementCard />
        </PreviewBlock>

        {/* 4 — LAST MINUTE PREP */}
        <PreviewBlock number="04" label="Last Minute Prep" title="Antenatal Corticosteroids" accent="#a78bfa">
          {csUrl ? (
            <div className="rounded-xl overflow-hidden" style={{ height: 520, background: BG_MID }}>
              <PdfViewer url={csUrl} title="Antenatal Corticosteroids" />
            </div>
          ) : (
            <PdfSkeleton />
          )}
        </PreviewBlock>

        {/* 5 — DASHBOARD WALKTHROUGH */}
        <PreviewBlock number="05" label="Dashboard Walkthrough" title="Inside the Student Experience" accent={TEAL}>
          <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "#000", border: `1px solid ${TEAL}33` }}>
            <iframe
              src="https://player.vimeo.com/video/1227763214?h=062fbfe194&autoplay=0&title=0&byline=0&portrait=0"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Student Dashboard Walkthrough"
              style={{ display: "block", width: "100%", height: "100%" }}
            />
          </div>
          <p className="mt-3 text-xs" style={{ color: "rgba(248,247,244,0.4)" }}>
            A real student navigating their dashboard — opening sections, reading feedback, and browsing sessions.
          </p>
        </PreviewBlock>

      </div>

      {/* ── CTA ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: BG }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: OFF_WHITE }}>
          Ready to unlock the full course?
        </h2>
        <p className="mb-8 text-sm md:text-base" style={{ color: "rgba(248,247,244,0.5)" }}>
          All sessions, PDFs, flashcards, and live feedback — in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            className="px-8 py-3.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
            style={{ background: TEAL, color: BG }}
          >
            Enquire Now →
          </a>
          <a
            href="/courses"
            className="px-8 py-3.5 rounded-lg text-sm font-semibold"
            style={{ color: "rgba(248,247,244,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            View Course Details
          </a>
        </div>
      </section>
    </main>
  );
}

/* ── Vimeo player with logo poster ── */
function VimeoWithPoster({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ aspectRatio: "16/9", background: BG, position: "relative", border: `1px solid ${TEAL}33` }}
    >
      {playing ? (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${BG} 0%, ${BG_MID} 100%)`,
            border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MRCPI OBGYN Unlocked" style={{ height: 80, width: "auto", maxWidth: "60%", objectFit: "contain" }} />
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: TEAL,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 0 12px ${TEAL}26, 0 0 0 24px ${TEAL}12`,
          }}>
            <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `15px solid ${BG}`, marginLeft: 4 }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(248,247,244,0.45)" }}>Click to play</span>
        </button>
      )}
    </div>
  );
}

/* ── Section wrapper ── */
function PreviewBlock({ number, label, title, accent, children }: {
  number: string; label: string; title: string; accent: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold tabular-nums" style={{ color: accent }}>{number}</span>
        <span
          className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }}
        >
          {label}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-5" style={{ color: OFF_WHITE, fontFamily: "Georgia, serif" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── PDF loading skeleton ── */
function PdfSkeleton() {
  return (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 520, background: BG_MID, border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: `${TEAL}99`, borderTopColor: "transparent" }} />
        <p className="text-xs" style={{ color: "rgba(248,247,244,0.4)" }}>Loading PDF…</p>
      </div>
    </div>
  );
}

/* ── Time Management flashcard ── */
function TimeManagementCard() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex items-center gap-4 px-6 py-5" style={{ background: "#6b1a2a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="MRCPI OBGYN Unlocked" style={{ height: 56, width: "auto", objectFit: "contain", flexShrink: 0 }} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#c9a44a" }}>OSCE Strategy</p>
          <h3 className="text-2xl font-bold" style={{ color: "#c9a44a", fontFamily: "Georgia, serif" }}>Time Management</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ background: "#1a0d14" }}>
        <div className="p-6" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9a44a" }}>Long Case (25 min)</p>
          <p className="text-xs mb-4" style={{ color: "rgba(248,247,244,0.45)" }}>Max 7 min for HX</p>
          <ul className="flex flex-col gap-2.5">
            {["Introduction","Agenda","History","Examination","Investigations","Discussion","Counselling & management plan","Closing the case"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: "#c9a44a", marginTop: 2, flexShrink: 0 }}>•</span>
                <span className="text-sm" style={{ color: "rgba(248,247,244,0.85)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#c9a44a" }}>OSCE Stations (10 min)</p>
          <ul className="flex flex-col gap-5">
            <li>
              <p className="text-sm" style={{ color: "rgba(248,247,244,0.85)" }}>
                <span className="font-bold" style={{ color: OFF_WHITE }}>Role player:</span>{" "}
                4 min for HX — introduction, agenda, relevant HX, short Ex, counselling
              </p>
            </li>
            <li>
              <p className="text-sm" style={{ color: "rgba(248,247,244,0.85)" }}>
                <span className="font-bold" style={{ color: OFF_WHITE }}>Viva station:</span>{" "}
                2 min for HX — structure discussion; can be scenario or Q&amp;A
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
