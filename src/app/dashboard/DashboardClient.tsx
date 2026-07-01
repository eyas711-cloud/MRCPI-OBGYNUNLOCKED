"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  FileText, Image, Video, Mic, ChevronRight, ChevronLeft,
  Play, Bell, LogOut, Award, Search, X, Loader,
  BookOpen, Star, MessageSquare, CheckCircle, Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export type StudentUser = { id: string; email: string; name: string | null };

// ── Static config ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "exam-templates",
    name: "Exam Templates",
    description: "OSCE station exam templates",
    icon: <FileText size={28} />,
    color: "var(--navy)",
    bg: "rgba(11,30,61,0.07)",
    fileLabel: "PDF",
  },
  {
    id: "recalls",
    name: "Recalls",
    description: "Past exam recall questions",
    icon: <BookOpen size={28} />,
    color: "var(--teal)",
    bg: "rgba(15,76,92,0.08)",
    fileLabel: "PDF",
  },
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Visual learning flashcard images",
    icon: <Image size={28} />,
    color: "var(--gold)",
    bg: "rgba(201,162,39,0.1)",
    fileLabel: "Image",
  },
  {
    id: "videos",
    name: "Videos",
    description: "Lecture and teaching videos",
    icon: <Video size={28} />,
    color: "var(--teal-bright)",
    bg: "rgba(21,176,151,0.1)",
    fileLabel: "Video",
  },
  {
    id: "recorded-sessions",
    name: "Recorded Sessions",
    description: "Live session recordings",
    icon: <Mic size={28} />,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    fileLabel: "Audio",
  },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type Subsection = { id: string; section_id: string; name: string; sort_order: number };
type ContentItem = {
  id: string;
  section_id: string;
  subsection_id: string | null;
  title: string;
  description: string | null;
  file_name: string;
  file_size: number | null;
  storage_path: string;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes > 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return (bytes / 1e3).toFixed(0) + " KB";
}

function audioMimeFromExt(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = { mpeg: "audio/mpeg", mpg: "audio/mpeg", mp3: "audio/mpeg", mp4: "audio/mp4", m4a: "audio/mp4", wav: "audio/wav", ogg: "audio/ogg", aac: "audio/aac" };
  return (ext && map[ext]) || "audio/mpeg";
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

const BAR_COUNT = 40;
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => 20 + Math.abs(Math.sin(i * 0.8)) * 50 + Math.abs(Math.sin(i * 0.3)) * 20);

function DashAudioPlayer({ signedUrl, fileName, title }: { signedUrl: string; fileName: string; title: string }) {
  const [unsupported, setUnsupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const a = audioRef.current;
    if (!bar || !a || !duration) return;
    const rect = bar.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="p-8 flex flex-col items-center gap-5 w-full">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal-bright)" }}>
        <Mic size={32} />
      </div>
      <p className="font-semibold text-center text-lg" style={{ color: "var(--navy)" }}>{title}</p>

      {/* Animated waveform visualizer */}
      <div className="w-full max-w-xl h-20 rounded-xl flex items-end justify-center gap-0.5 px-4 overflow-hidden"
        style={{ backgroundColor: "rgba(11,30,61,0.04)" }}>
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm"
            style={{
              height: playing ? `${h}%` : "20%",
              backgroundColor: "var(--teal-bright)",
              opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.25,
              transition: playing ? `height ${0.3 + (i % 5) * 0.1}s ease-in-out` : "height 0.4s ease",
              animationDelay: `${i * 0.05}s`,
              animation: playing ? `bounce-bar ${0.6 + (i % 4) * 0.2}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* Progress bar */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div ref={progressRef} onClick={handleSeek}
          className="w-full h-2 rounded-full cursor-pointer relative"
          style={{ backgroundColor: "rgba(11,30,61,0.12)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--teal-bright)" }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow border-2 border-white cursor-grab"
            style={{ left: `calc(${pct}% - 8px)`, backgroundColor: "var(--teal-bright)" }} />
        </div>
        <div className="flex justify-between text-xs font-mono" style={{ color: "rgba(26,26,26,0.45)" }}>
          <span>{fmtTime(currentTime)}</span>
          <span>{fmtTime(duration)}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="w-full max-w-xl flex items-center gap-4">
        <button onClick={togglePlay}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--teal-bright)" }}>
          {playing
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(26,26,26,0.4)", flexShrink: 0 }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
          </svg>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "var(--teal-bright)" }}
          />
        </div>
      </div>

      {!unsupported ? (
        <audio ref={audioRef} onError={() => setUnsupported(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setCurrentTime(0); }}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}>
          <source src={signedUrl} type={audioMimeFromExt(fileName)} />
          <source src={signedUrl} type="audio/mpeg" />
          <source src={signedUrl} type="audio/mp4" />
        </audio>
      ) : (
        <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>Audio format not supported by your browser.</p>
      )}
    </div>
  );
}

// ── File viewer ───────────────────────────────────────────────────────────────
function getVimeoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("vimeo.com")) return null;
    const videoId = u.pathname.split("/").filter(Boolean)[0];
    if (!videoId) return null;
    return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&controls=1&progress_bar=1&playbar=1&transparent=0`;
  } catch { return null; }
}

function FileViewer({
  item,
  bucket,
  fileType,
  onClose,
}: {
  item: ContentItem;
  bucket: string;
  fileType: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const isVimeo = item.file_name === "vimeo" || item.storage_path?.startsWith("http");
  const embedUrl = isVimeo ? getVimeoEmbedUrl(item.storage_path) : null;

  useEffect(() => {
    if (isVimeo) return;
    // 15-minute signed URLs — short expiry limits URL sharing
    supabase.storage
      .from(bucket)
      .createSignedUrl(item.storage_path, 900)
      .then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [item, bucket, isVimeo]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate" style={{ color: "var(--navy)" }}>{item.title}</p>
            {!isVimeo && <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{item.file_name} · {formatSize(item.file_size)}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 ml-4">
            <X size={16} style={{ color: "var(--navy)" }} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[400px]">
          {isVimeo ? (
            embedUrl ? (
              <div className="w-full h-full" style={{ minHeight: "70vh" }}>
                <iframe
                  src={embedUrl}
                  className="w-full"
                  style={{ height: "70vh" }}
                  title={item.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-sm text-red-500">Invalid Vimeo URL</p>
            )
          ) : !url ? (
            <Loader size={24} className="animate-spin" style={{ color: "var(--teal)" }} />
          ) : fileType === "pdf" ? (
            <iframe src={`${url}#toolbar=0&navpanes=0&scrollbar=1`} className="w-full h-full min-h-[500px]" title={item.title} style={{ height: "65vh" }} />
          ) : fileType === "image" ? (
            <img
              src={url} alt={item.title}
              className="max-w-full max-h-[60vh] object-contain p-4"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            />
          ) : fileType === "audio" ? (
            <DashAudioPlayer signedUrl={url} fileName={item.file_name} title={item.title} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardClient({ user }: { user: StudentUser }) {
  const displayName = user.name ? user.name.split(" ")[0] : user.email.split("@")[0];
  const initials = (user.name ?? user.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null);
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<ContentItem | null>(null);

  const section = SECTIONS.find((s) => s.id === activeSection);

  // Load subsections when a section is selected
  useEffect(() => {
    if (!activeSection) return;
    setActiveSubsection(null);
    setItems([]);
    setSearch("");
    supabase
      .from("content_subsections")
      .select("*")
      .eq("section_id", activeSection)
      .order("sort_order")
      .then(({ data }) => setSubsections(data ?? []));
  }, [activeSection]);

  // Load items when subsection selected (or when section has no subsections)
  const fetchItems = useCallback(async (sectionId: string, subsectionId: string | null) => {
    setLoading(true);
    let q = supabase.from("content_items").select("*").eq("section_id", sectionId).order("created_at", { ascending: false });
    if (subsectionId) q = q.eq("subsection_id", subsectionId);
    const { data } = await q;
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!activeSection) return;
    const hasSubs = ["exam-templates", "recalls", "recorded-sessions"].includes(activeSection);
    if (!hasSubs) fetchItems(activeSection, null);
    else if (activeSubsection) fetchItems(activeSection, activeSubsection);
  }, [activeSection, activeSubsection, fetchItems]);

  const filtered = search.trim()
    ? items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  // ── Review state ─────────────────────────────────────────────────────────────
  // Ping last_seen every 60 seconds
  useEffect(() => {
    const ping = () => fetch("/api/ping", { method: "POST" });
    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  // Feedback state
  const [myFeedback, setMyFeedback] = useState<{ id: string; feedback_type: string; title: string; content: string; created_at: string }[]>([]);
  const [mySessionFeedback, setMySessionFeedback] = useState<{ id: string; session_date: string; overall_score: number | null; overall_notes: string | null; station_scores: { name: string; score: number; max: number; comments: string | null }[]; created_at: string }[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackView, setFeedbackView] = useState<"home" | "feedback">("home");

  useEffect(() => {
    Promise.all([
      supabase.from("student_feedback").select("id, feedback_type, title, content, created_at").eq("student_id", user.id).order("created_at", { ascending: false }),
      supabase.from("session_feedback").select("id, session_date, overall_score, overall_notes, station_scores, created_at").eq("student_id", user.id).order("session_date", { ascending: false }),
    ]).then(([fb, sf]) => {
      setMyFeedback(fb.data ?? []);
      setMySessionFeedback(sf.data ?? []);
      setFeedbackLoading(false);
    });
  }, [user.id]);

  const [myReview, setMyReview] = useState<{ id: string; rating: number; review_text: string; status: string } | null | undefined>(undefined);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: "" });
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("student_reviews")
      .select("id, rating, review_text, status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setMyReview(data));
  }, [user.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.review_text.trim().length < 20) {
      setReviewError("Please write at least 20 characters.");
      return;
    }
    setReviewSaving(true);
    setReviewError(null);
    const { error } = await supabase.from("student_reviews").insert([{
      user_id: user.id,
      student_name: user.name || user.email.split("@")[0],
      rating: reviewForm.rating,
      review_text: reviewForm.review_text.trim(),
    }]);
    setReviewSaving(false);
    if (error) {
      setReviewError("Something went wrong. Please try again.");
    } else {
      setReviewDone(true);
      setMyReview({ id: "", rating: reviewForm.rating, review_text: reviewForm.review_text, status: "pending" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const hasSubs = activeSection ? ["exam-templates", "recalls", "recorded-sessions"].includes(activeSection) : false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper)" }}>

      {/* ── Top bar ── */}
      <div className="sticky top-16 z-40 bg-white border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(26,26,26,0.5)" }}>
          {/* Breadcrumb */}
          <button
            onClick={() => { setActiveSection(null); setActiveSubsection(null); }}
            className="font-medium hover:underline"
            style={{ color: activeSection ? "var(--teal)" : "var(--navy)" }}
          >
            My Portal
          </button>
          {activeSection && section && (
            <>
              <ChevronRight size={14} />
              <button
                onClick={() => { setActiveSubsection(null); setItems([]); }}
                className="font-medium hover:underline"
                style={{ color: activeSubsection ? "var(--teal)" : "var(--navy)" }}
              >
                {section.name}
              </button>
            </>
          )}
          {activeSubsection && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: "var(--navy)" }}>
                {subsections.find((s) => s.id === activeSubsection)?.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative w-11 h-11 rounded-lg border flex items-center justify-center" style={{ borderColor: "rgba(15,76,92,0.2)" }}>
            <Bell size={15} aria-hidden="true" style={{ color: "var(--navy)" }} />
          </button>
          <div className="relative group">
            <button
              className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "var(--navy)" }}
              aria-label={`Account menu for ${user.name || user.email}`}
            >
              {initials}
            </button>
            <div
              className="absolute right-0 top-12 rounded-lg border shadow-xl py-2 min-w-[160px] hidden group-hover:block group-focus-within:block z-10 bg-white"
              style={{ borderColor: "rgba(15,76,92,0.15)" }}
            >
              <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                <p className="text-xs font-semibold truncate" style={{ color: "var(--navy)" }}>{user.name || user.email}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--teal)" }}>Student</p>
              </div>
              <Link href="/contact" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: "rgba(26,26,26,0.7)" }}>
                Contact Support
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                style={{ color: "rgba(26,26,26,0.7)" }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── HOME: 5 section cards ── */}
        {!activeSection && feedbackView === "home" && (
          <>
            <div className="mb-8">
              <p className="font-mono-data text-xs uppercase tracking-widest mb-1" style={{ color: "var(--teal)" }}>Student Dashboard</p>
              <h1 className="font-serif font-semibold text-2xl" style={{ color: "var(--navy)" }}>
                Welcome back, {displayName}
              </h1>
              <p className="text-sm mt-1" style={{ color: "rgba(26,26,26,0.55)" }}>
                Select a section to access your study materials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setFeedbackView("home"); }}
                  className="text-left rounded-2xl border bg-white p-6 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                  style={{ borderColor: "rgba(15,76,92,0.12)" }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.icon}
                    </div>
                    <span
                      className="text-xs font-mono-data font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.fileLabel}
                    </span>
                  </div>
                  <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: "var(--navy)" }}>
                    {`${i + 1}. ${s.name}`}
                  </h2>
                  <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>{s.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: s.color }}>
                    Open <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}

              {/* My Feedback card */}
              <button
                onClick={() => setFeedbackView("feedback")}
                className="text-left rounded-2xl border p-6 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                style={{ borderColor: "rgba(21,176,151,0.25)", backgroundColor: "rgba(21,176,151,0.03)" }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal)" }}>
                    <MessageSquare size={28} />
                  </div>
                  {(myFeedback.length + mySessionFeedback.length) > 0 && (
                    <span className="text-xs font-mono-data font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal)" }}>
                      {myFeedback.length + mySessionFeedback.length} new
                    </span>
                  )}
                </div>
                <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: "var(--navy)" }}>My Feedback</h2>
                <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Personal notes, progress comments & session scorecards from Dr. Diab</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: "var(--teal)" }}>
                  View Feedback <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Mock OSCE booking card */}
              <Link
                href="/mock-osce"
                className="text-left rounded-2xl border p-6 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                style={{ borderColor: "rgba(201,162,39,0.25)", backgroundColor: "rgba(201,162,39,0.04)" }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(201,162,39,0.12)", color: "var(--gold)" }}>
                    <Award size={28} />
                  </div>
                  <span className="text-xs font-mono-data font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(201,162,39,0.12)", color: "var(--gold)" }}>Live</span>
                </div>
                <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: "var(--navy)" }}>Mock OSCE Sessions</h2>
                <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Book a live 1:1 mock examination with Dr. Einas Diab</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: "var(--gold)" }}>
                  Book Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* ── Review section ── */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare size={16} style={{ color: "var(--teal)" }} />
                <h2 className="font-serif font-semibold text-lg" style={{ color: "var(--navy)" }}>Student Reviews &amp; Testimonials</h2>
              </div>

              {/* Already submitted */}
              {myReview !== undefined && myReview !== null ? (
                <div className="rounded-2xl border bg-white p-6 max-w-2xl" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                  {myReview.status === "pending" && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(201,162,39,0.1)", color: "var(--gold)" }}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>Your review is pending approval</p>
                        <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Thank you for your feedback. Once approved by the admin, it will appear on the homepage.</p>
                        <div className="flex gap-0.5 mt-3">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= myReview.rating ? "var(--gold)" : "none"} style={{ color: "var(--gold)" }} />)}
                        </div>
                        <p className="text-sm mt-2 italic" style={{ color: "rgba(26,26,26,0.65)" }}>&ldquo;{myReview.review_text}&rdquo;</p>
                      </div>
                    </div>
                  )}
                  {myReview.status === "approved" && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>Your review is live on the homepage!</p>
                        <div className="flex gap-0.5 mt-3">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= myReview.rating ? "var(--gold)" : "none"} style={{ color: "var(--gold)" }} />)}
                        </div>
                        <p className="text-sm mt-2 italic" style={{ color: "rgba(26,26,26,0.65)" }}>&ldquo;{myReview.review_text}&rdquo;</p>
                      </div>
                    </div>
                  )}
                  {myReview.status === "rejected" && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                        <X size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>Your review was not approved</p>
                        <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Please contact support if you believe this was an error.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : myReview === null ? (
                /* Submit form */
                <div className="rounded-2xl border bg-white p-6 max-w-2xl" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                  {reviewDone ? (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>Thank you for your review!</p>
                        <p className="text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Your review is pending admin approval and will appear on the homepage once approved.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Share your experience</p>
                        <p className="text-sm mb-4" style={{ color: "rgba(26,26,26,0.6)" }}>Your review will appear on the homepage after admin approval.</p>
                        {/* Star rating */}
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--navy)" }}>Your Rating *</label>
                        <div className="flex gap-1 mb-4">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                              <Star size={28} fill={s <= reviewForm.rating ? "var(--gold)" : "none"} style={{ color: "var(--gold)", transition: "all 0.15s" }} />
                            </button>
                          ))}
                        </div>
                        {/* Review text */}
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--navy)" }}>Your Review *</label>
                        <textarea
                          required rows={4}
                          value={reviewForm.review_text}
                          onChange={e => setReviewForm(f => ({ ...f, review_text: e.target.value }))}
                          placeholder="Tell others about your experience with the course and Dr. Einas..."
                          className="w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none transition-colors"
                          style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }}
                        />
                        <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.4)" }}>{reviewForm.review_text.length} / min. 20 characters</p>
                      </div>
                      {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}
                      <button
                        type="submit" disabled={reviewSaving}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                      >
                        {reviewSaving ? <Loader size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                        {reviewSaving ? "Submitting…" : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Loading */
                <div className="h-24 flex items-center"><Loader size={18} className="animate-spin" style={{ color: "var(--teal)" }} /></div>
              )}
            </div>
          </>
        )}

        {/* ── FEEDBACK VIEW ── */}
        {!activeSection && feedbackView === "feedback" && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setFeedbackView("home")}
                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-white transition-colors"
                style={{ borderColor: "rgba(15,76,92,0.15)" }}>
                <ChevronLeft size={16} style={{ color: "var(--navy)" }} />
              </button>
              <div>
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Dr. Einas Diab</p>
                <h1 className="font-serif font-semibold text-2xl" style={{ color: "var(--navy)" }}>My Feedback</h1>
              </div>
            </div>

            {feedbackLoading ? (
              <div className="py-16 flex justify-center"><Loader size={20} className="animate-spin" style={{ color: "var(--teal)" }} /></div>
            ) : (myFeedback.length === 0 && mySessionFeedback.length === 0) ? (
              <div className="rounded-2xl border bg-white p-12 text-center" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <MessageSquare size={32} className="mx-auto mb-3" style={{ color: "rgba(26,26,26,0.2)" }} />
                <p className="text-sm font-medium" style={{ color: "rgba(26,26,26,0.4)" }}>No feedback yet</p>
                <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.3)" }}>Your personal feedback from Dr. Diab will appear here after sessions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Session scorecards */}
                {mySessionFeedback.length > 0 && (
                  <div>
                    <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal)" }}>Session Scorecards</p>
                    <div className="space-y-4">
                      {mySessionFeedback.map(sf => {
                        const scored = (sf.station_scores ?? []).filter(s => s.score !== null);
                        const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
                        const maxScore = scored.reduce((sum, s) => sum + (s.max || 10), 0);
                        return (
                          <div key={sf.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(15,76,92,0.08)", backgroundColor: "rgba(11,30,61,0.02)" }}>
                              <div>
                                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Mock OSCE Session</p>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>
                                  {new Date(sf.session_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                              {sf.overall_score !== null && (
                                <div className="text-right">
                                  <p className="text-2xl font-bold font-serif" style={{ color: sf.overall_score >= 70 ? "var(--teal)" : sf.overall_score >= 50 ? "var(--gold)" : "#dc2626" }}>
                                    {sf.overall_score}<span className="text-sm font-normal" style={{ color: "rgba(26,26,26,0.4)" }}>/100</span>
                                  </p>
                                  <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>Overall Score</p>
                                </div>
                              )}
                            </div>
                            {scored.length > 0 && (
                              <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(26,26,26,0.45)" }}>Station Scores</p>
                                <div className="space-y-3">
                                  {scored.map((s, i) => {
                                    const pct = Math.round((s.score / (s.max || 10)) * 100);
                                    return (
                                      <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="text-sm" style={{ color: "var(--navy)" }}>{s.name}</p>
                                          <p className="text-sm font-bold" style={{ color: pct >= 70 ? "var(--teal)" : pct >= 50 ? "var(--gold)" : "#dc2626" }}>
                                            {s.score}/{s.max || 10}
                                          </p>
                                        </div>
                                        <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(15,76,92,0.1)" }}>
                                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? "var(--teal)" : pct >= 50 ? "var(--gold)" : "#dc2626" }} />
                                        </div>
                                        {s.comments && <p className="text-xs mt-1 italic" style={{ color: "rgba(26,26,26,0.5)" }}>{s.comments}</p>}
                                      </div>
                                    );
                                  })}
                                </div>
                                {maxScore > 0 && (
                                  <p className="text-xs mt-3 font-semibold" style={{ color: "rgba(26,26,26,0.4)" }}>
                                    Station total: {totalScore}/{maxScore}
                                  </p>
                                )}
                              </div>
                            )}
                            {sf.overall_notes && (
                              <div className="px-6 py-4">
                                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(26,26,26,0.45)" }}>Dr. Diab&apos;s Notes</p>
                                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.75)" }}>{sf.overall_notes}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* General / progress feedback */}
                {myFeedback.length > 0 && (
                  <div>
                    <p className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--teal)" }}>Notes &amp; Progress Comments</p>
                    <div className="space-y-4">
                      {myFeedback.map(fb => (
                        <div key={fb.id} className="rounded-2xl border bg-white p-6" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{fb.title}</p>
                            <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 capitalize font-semibold" style={{
                              backgroundColor: fb.feedback_type === "progress" ? "rgba(201,162,39,0.1)" : "rgba(21,176,151,0.1)",
                              color: fb.feedback_type === "progress" ? "var(--gold)" : "var(--teal)",
                            }}>
                              {fb.feedback_type === "progress" ? "Progress Note" : "General"}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(26,26,26,0.75)" }}>{fb.content}</p>
                          <p className="text-xs mt-3" style={{ color: "rgba(26,26,26,0.35)" }}>
                            {new Date(fb.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── SECTION VIEW: subsections or direct content ── */}
        {activeSection && section && (
          <>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => { setActiveSection(null); setActiveSubsection(null); }}
                className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-white transition-colors"
                style={{ borderColor: "rgba(15,76,92,0.2)" }}
              >
                <ChevronLeft size={18} style={{ color: "var(--navy)" }} />
              </button>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: section.bg, color: section.color }}
              >
                {section.icon}
              </div>
              <div>
                <h1 className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>{section.name}</h1>
                <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{section.description}</p>
              </div>
            </div>

            {/* Subsection grid (sections 1 & 2) */}
            {hasSubs && !activeSubsection && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subsections.map((sub, i) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubsection(sub.id)}
                    className="text-left rounded-xl border bg-white p-5 transition-all hover:shadow-sm hover:border-teal group"
                    style={{ borderColor: "rgba(15,76,92,0.12)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: section.bg, color: section.color }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--navy)" }}>{sub.name}</p>
                      </div>
                      <ChevronRight size={15} style={{ color: "rgba(26,26,26,0.3)" }} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Content list (after subsection selected or for sections 3-5) */}
            {(!hasSubs || activeSubsection) && (
              <>
                {/* Back to subsections */}
                {hasSubs && activeSubsection && (
                  <button
                    onClick={() => { setActiveSubsection(null); setItems([]); }}
                    className="flex items-center gap-1.5 text-sm mb-5"
                    style={{ color: "var(--teal)" }}
                  >
                    <ChevronLeft size={14} />
                    {subsections.find((s) => s.id === activeSubsection)?.name}
                  </button>
                )}

                {/* Search */}
                <div className="relative mb-5">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(26,26,26,0.35)" }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none bg-white"
                    style={{ borderColor: "rgba(15,76,92,0.2)" }}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X size={14} style={{ color: "rgba(26,26,26,0.4)" }} />
                    </button>
                  )}
                </div>

                {/* Items */}
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader size={22} className="animate-spin" style={{ color: "var(--teal)" }} />
                  </div>
                ) : filtered.length === 0 ? (
                  <div
                    className="rounded-xl border bg-white p-12 text-center"
                    style={{ borderColor: "rgba(15,76,92,0.12)" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: section.bg, color: section.color }}>
                      {section.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>
                      {search ? "No results found" : "No content yet"}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>
                      {search ? "Try a different search term" : "Content will appear here once uploaded by the administrator"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                    <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                      {filtered.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: section.bg, color: section.color }}
                          >
                            {section.fileLabel === "PDF" && <FileText size={16} />}
                            {section.fileLabel === "Image" && <Image size={16} />}
                            {section.fileLabel === "Video" && <Video size={16} />}
                            {section.fileLabel === "Audio" && <Mic size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{item.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.4)" }}>
                              {item.file_name}
                              {item.file_size ? ` · ${formatSize(item.file_size)}` : ""}
                              {` · ${new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                            </p>
                          </div>
                          <button
                            onClick={() => setViewItem(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 flex-shrink-0"
                            style={{ backgroundColor: section.bg, color: section.color }}
                          >
                            {section.fileLabel === "Video" || section.fileLabel === "Audio" ? (
                              <><Play size={12} /> Play</>
                            ) : (
                              <><FileText size={12} /> Open</>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ── File viewer modal ── */}
      {viewItem && section && (
        <FileViewer
          item={viewItem}
          bucket={
            activeSection === "exam-templates" ? "exam-templates" :
            activeSection === "recalls" ? "recalls" :
            activeSection === "flashcards" ? "flashcards" :
            activeSection === "videos" ? "course-videos" :
            "recorded-sessions"
          }
          fileType={
            activeSection === "flashcards" ? "image" :
            activeSection === "videos" ? "video" :
            activeSection === "recorded-sessions" ? "audio" :
            "pdf"
          }
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
}
