"use client";

import { useState, useEffect, useCallback } from "react";
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

function DashAudioPlayer({ signedUrl, fileName, title }: { signedUrl: string; fileName: string; title: string }) {
  const [unsupported, setUnsupported] = useState(false);

  return (
    <div className="p-8 text-center">
      <Mic size={48} className="mx-auto mb-4" style={{ color: "var(--teal-bright)" }} />
      <p className="font-semibold mb-4" style={{ color: "var(--navy)" }}>{title}</p>
      {!unsupported ? (
        <audio
          controls
          className="w-full max-w-sm"
          onError={() => setUnsupported(true)}
        >
          <source src={signedUrl} type={audioMimeFromExt(fileName)} />
          <source src={signedUrl} type="audio/mpeg" />
          <source src={signedUrl} type="audio/mp4" />
        </audio>
      ) : null}
      {unsupported && (
        <p className="mt-2 text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
          This audio format is not supported by your browser.<br />
          <span className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>Please contact support if this issue persists.</span>
        </p>
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
    return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0`;
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
        {!activeSection && (
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
                  onClick={() => setActiveSection(s.id)}
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
