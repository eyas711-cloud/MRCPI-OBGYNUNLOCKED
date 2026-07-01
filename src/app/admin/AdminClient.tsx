"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Users, BookOpen, Video, FileText, Calendar, BarChart3,
  Upload, Plus, Trash2, Settings, Shield, Bell,
  TrendingUp, DollarSign, Eye, CheckCircle, X, Loader, LogOut,
  Image, Mic, MessageSquare, Star, Download, Send, Pencil, Maximize2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/audit";

export type AdminUser = { id: string; email: string; name: string | null; role: string };

type StudentRow = {
  id: string; email: string; full_name: string | null;
  role: string; status: string; created_at: string; registration_notes: string | null;
  last_seen: string | null;
};

type Subsection = { id: string; section_id: string; name: string; sort_order: number };

type ContentItem = {
  id: string; section_id: string; subsection_id: string | null;
  title: string; description: string | null; file_name: string;
  file_size: number | null; storage_path: string; created_at: string;
};

type AuditRow = { id: string; user_email: string; action: string; resource: string | null; created_at: string };

type BatchRow = { id: string; name: string; notes: string | null; created_at: string };
type BatchStudent = {
  id: string; batch_id: string; sort_order: number;
  student_name: string; paid: number; pending: number;
  telegram: boolean; web_account: boolean; comments: string | null;
  email: string | null; last_reminded_at: string | null;
};

type SlotRow = { id: string; date_label: string; slots: string[]; sort_order: number; visible: boolean };

type BookingRow = { id: string; name: string; email: string; date: string; time_slot: string; notes: string | null; status: string; meet_link: string | null; created_at: string };

type PaymentRow = { id: string; student_name: string; student_email: string; amount: number; currency: string; payment_date: string; notes: string | null; created_at: string };

type ReviewRow = {
  id: string; user_id: string; student_name: string; rating: number;
  review_text: string; status: string; created_at: string;
};

type TestimonialRow = {
  id: string; name: string; country: string; initials: string;
  color: string; blur_avatar: boolean; messages: string[];
  sort_order: number; visible: boolean; created_at: string;
};

// ── Static config ─────────────────────────────────────────────────────────────
const CONTENT_SECTIONS = [
  { id: "exam-templates",    label: "1. Exam Templates",     icon: <FileText size={15} />, color: "var(--navy)",       bucket: "exam-templates",    accept: "application/pdf",                            fileLabel: "PDF",   hasSubs: true  },
  { id: "recalls",           label: "2. Recalls",            icon: <BookOpen size={15} />, color: "var(--teal)",       bucket: "recalls",           accept: "application/pdf",                            fileLabel: "PDF",   hasSubs: true  },
  { id: "flashcards",        label: "3. Flashcards",         icon: <Image size={15} />,    color: "var(--gold)",       bucket: "flashcards",        accept: "image/jpeg,image/png,image/webp,image/gif",  fileLabel: "Image", hasSubs: false },
  { id: "videos",            label: "4. Videos",             icon: <Video size={15} />,    color: "var(--teal-bright)",bucket: "course-videos",     accept: "video/mp4,video/webm,video/quicktime",       fileLabel: "Video", hasSubs: false },
  { id: "recorded-sessions", label: "5. Recorded Sessions",  icon: <Mic size={15} />,      color: "#8b5cf6",           bucket: "recorded-sessions", accept: "",                                                                                      fileLabel: "Vimeo", hasSubs: true  },
] as const;

type SectionId = (typeof CONTENT_SECTIONS)[number]["id"];

const buildStats = (studentCount: number, mtd: number, total: number) => [
  { label: "Total Students",       value: String(studentCount), change: studentCount === 0 ? "Starts at first enrolment" : `${studentCount} registered`,  icon: <Users size={18} />,     color: "var(--teal)"        },
  { label: "Active Courses",       value: "1",                  change: "MRCPI OBGYN OSCE",                                                                icon: <BookOpen size={18} />,  color: "var(--navy)"        },
  { label: "Mock Sessions Booked", value: "0",                  change: "Starts at first booking",                                                         icon: <Calendar size={18} />,  color: "var(--gold)"        },
  { label: "Revenue (MTD)",        value: `SAR ${mtd.toLocaleString()}`, change: `Total all-time: SAR ${total.toLocaleString()}`,                          icon: <DollarSign size={18} />, color: "var(--teal-bright)" },
];


const navItems = [
  { icon: <BarChart3 size={16} />,     label: "Overview"        },
  { icon: <Users size={16} />,         label: "Students"        },
  { icon: <BookOpen size={16} />,      label: "Courses"         },
  { icon: <Upload size={16} />,        label: "Content"         },
  { icon: <MessageSquare size={16} />, label: "Success Stories" },
  { icon: <Star size={16} />,          label: "Reviews"         },
  { icon: <Calendar size={16} />,      label: "Mock OSCEs"      },
  { icon: <DollarSign size={16} />,    label: "Payments"        },
  { icon: <Shield size={16} />,        label: "Security"        },
  { icon: <Settings size={16} />,      label: "Settings"        },
];

function fmtSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes > 1e9) return (bytes / 1e9).toFixed(1) + " GB";
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

const ADMIN_BAR_HEIGHTS = Array.from({ length: 40 }, (_, i) => 20 + Math.abs(Math.sin(i * 0.8)) * 50 + Math.abs(Math.sin(i * 0.3)) * 20);

function AudioPlayer({ signedUrl, fileName, title }: { signedUrl: string; fileName: string; title: string }) {
  const [unsupported, setUnsupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => { const a = audioRef.current; if (!a) return; playing ? a.pause() : a.play(); };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current; const a = audioRef.current;
    if (!bar || !a || !duration) return;
    const rect = bar.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value); setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  if (unsupported) return (
    <div className="p-8 text-center space-y-3">
      <Mic size={40} className="mx-auto" style={{ color: "var(--teal-bright)" }} />
      <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>Format not supported in browser.</p>
      <a href={signedUrl} download={fileName} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
        <Download size={14} /> Download to listen
      </a>
    </div>
  );

  return (
    <div className="p-8 flex flex-col items-center gap-5 w-full">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal-bright)" }}>
        <Mic size={32} />
      </div>
      <p className="font-semibold text-center text-lg" style={{ color: "var(--navy)" }}>{title}</p>

      {/* Animated waveform */}
      <div className="w-full max-w-xl h-20 rounded-xl flex items-end justify-center gap-0.5 px-4 overflow-hidden" style={{ backgroundColor: "rgba(11,30,61,0.04)" }}>
        {ADMIN_BAR_HEIGHTS.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{
            height: playing ? `${h}%` : "20%",
            backgroundColor: "var(--teal-bright)",
            opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.25,
            transition: `height ${0.3 + (i % 5) * 0.1}s ease-in-out`,
            animation: playing ? `bounce-admin ${0.6 + (i % 4) * 0.2}s ease-in-out infinite alternate` : "none",
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce-admin { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>

      <div className="w-full max-w-xl flex flex-col gap-2">
        <div ref={progressRef} onClick={handleSeek} className="w-full h-2 rounded-full cursor-pointer relative" style={{ backgroundColor: "rgba(11,30,61,0.12)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--teal-bright)" }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow border-2 border-white" style={{ left: `calc(${pct}% - 8px)`, backgroundColor: "var(--teal-bright)" }} />
        </div>
        <div className="flex justify-between text-xs font-mono" style={{ color: "rgba(26,26,26,0.45)" }}>
          <span>{fmtTime(currentTime)}</span><span>{fmtTime(duration)}</span>
        </div>
      </div>

      <div className="w-full max-w-xl flex items-center gap-4">
        <button onClick={togglePlay} className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)" }}>
          {playing
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "rgba(26,26,26,0.4)", flexShrink: 0 }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
            {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}
          </svg>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "var(--teal-bright)" }} />
        </div>
      </div>

      <audio ref={audioRef} onError={() => setUnsupported(true)}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrentTime(0); }}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}>
        <source src={signedUrl} type={audioMimeFromExt(fileName)} />
        <source src={signedUrl} type="audio/mpeg" />
        <source src={signedUrl} type="audio/mp4" />
      </audio>
    </div>
  );
}

// ── Content panel sub-component ───────────────────────────────────────────────
function ContentPanel({ user }: { user: AdminUser }) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Section / subsection selection
  const [activeSec, setActiveSec] = useState<SectionId>("exam-templates");
  const [activeSub, setActiveSub] = useState<string>("");

  // Subsections for the selected section
  const [subsections, setSubsections] = useState<Subsection[]>([]);

  // Upload form
  const [form, setForm] = useState({ title: "", description: "", vimeoUrl: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Content library
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [previewItem, setPreviewItem] = useState<{ item: ContentItem; url: string } | null>(null);
  const adminPdfIframeRef = useRef<HTMLIFrameElement>(null);
  const openAdminPdfFullscreen = () => {
    const el = adminPdfIframeRef.current as HTMLIFrameElement & { mozRequestFullScreen?: () => void; webkitRequestFullscreen?: () => void; } | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [editSaving, setEditSaving] = useState(false);

  const section = CONTENT_SECTIONS.find((s) => s.id === activeSec)!;

  // Load subsections when active section changes
  useEffect(() => {
    setActiveSub("");
    setItems([]);
    if (!section.hasSubs) {
      setSubsections([]);
      return;
    }
    supabase
      .from("content_subsections")
      .select("*")
      .eq("section_id", activeSec)
      .order("sort_order")
      .then(({ data }) => setSubsections(data ?? []));
  }, [activeSec]);

  // Load items
  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    let q = supabase.from("content_items").select("*").eq("section_id", activeSec).order("created_at", { ascending: false });
    if (section.hasSubs && activeSub) q = q.eq("subsection_id", activeSub);
    else if (section.hasSubs && !activeSub) { setItems([]); setLoadingItems(false); return; }
    const { data } = await q;
    setItems(data ?? []);
    setLoadingItems(false);
  }, [activeSec, activeSub, section.hasSubs]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSec !== "videos" && activeSec !== "recorded-sessions" && !file) return;
    if (section.hasSubs && !activeSub) { setErr("Please select a sub-section first."); return; }
    setUploading(true); setErr(null); setProgress(20);

    let storagePath = "";

    if (activeSec === "videos" || activeSec === "recorded-sessions") {
      // Vimeo URL — store directly, no file upload needed
      const ytUrl = form.vimeoUrl.trim();
      if (!ytUrl) { setErr("Please enter a Vimeo URL."); setUploading(false); return; }
      storagePath = ytUrl;
      setProgress(70);
    } else {
      const ext = file!.name.split(".").pop()?.toLowerCase();
      const path = `${activeSec}/${activeSub || "general"}/${Date.now()}-${file!.name.replace(/\s+/g, "_")}`;

      // Force correct MIME types — browsers sometimes mis-detect or leave type empty
      const audioExtMap: Record<string, string> = { mpeg: "audio/mpeg", mpg: "audio/mpeg", mp3: "audio/mpeg", mp4: "audio/mp4", m4a: "audio/mp4", wav: "audio/wav", ogg: "audio/ogg" };
      let contentType = file!.type;
      if (activeSec === "recorded-sessions" && ext && audioExtMap[ext]) contentType = audioExtMap[ext];
      if (!contentType) contentType = "application/octet-stream";

      const { error: storErr } = await supabase.storage.from(section.bucket).upload(path, file!, {
        upsert: false,
        contentType,
        onUploadProgress: (p) => {
          const pct = Math.round((p.loaded / p.total) * 70) + 10;
          setProgress(Math.min(pct, 80));
        },
      });
      if (storErr) { setErr(storErr.message); setUploading(false); return; }
      storagePath = path;
    }
    setProgress(90);

    const { error: dbErr } = await supabase.from("content_items").insert([{
      section_id: activeSec,
      subsection_id: activeSub || null,
      title: form.title,
      description: form.description || null,
      file_name: (activeSec === "videos" || activeSec === "recorded-sessions") ? "vimeo" : file!.name,
      file_size: (activeSec === "videos" || activeSec === "recorded-sessions") ? null : file!.size,
      storage_path: storagePath,
      uploaded_by: user.id,
      uploaded_by_email: user.email,
    }]);

    if (dbErr) { setErr(dbErr.message); setUploading(false); return; }

    await logAudit(user.id, user.email, user.role, `upload_${activeSec}`, form.title, { file: (activeSec === "videos" || activeSec === "recorded-sessions") ? storagePath : file!.name, subsection: activeSub });
    setProgress(100);
    setUploading(false);
    setDone(true);
    setForm({ title: "", description: "", vimeoUrl: "" });
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => { setDone(false); setProgress(0); fetchItems(); }, 1800);
  };

  const handleDelete = async (item: ContentItem) => {
    if (item.file_name !== "vimeo" && !item.storage_path?.startsWith("http")) await supabase.storage.from(section.bucket).remove([item.storage_path]);
    await supabase.from("content_items").delete().eq("id", item.id);
    await logAudit(user.id, user.email, user.role, `delete_${activeSec}`, item.title);
    fetchItems();
  };

  const openPreview = async (item: ContentItem) => {
    if (item.file_name === "vimeo" || item.storage_path?.startsWith("http")) {
      setPreviewItem({ item, url: item.storage_path });
      return;
    }
    const { data } = await supabase.storage.from(section.bucket).createSignedUrl(item.storage_path, 3600);
    if (data?.signedUrl) setPreviewItem({ item, url: data.signedUrl });
  };

  const openEdit = (item: ContentItem) => {
    setEditItem(item);
    setEditForm({ title: item.title, description: item.description ?? "" });
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    setEditSaving(true);
    await supabase.from("content_items").update({ title: editForm.title, description: editForm.description || null }).eq("id", editItem.id);
    setEditSaving(false);
    setEditItem(null);
    fetchItems();
  };

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {CONTENT_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSec(s.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              backgroundColor: activeSec === s.id ? "var(--navy)" : "white",
              color: activeSec === s.id ? "white" : "rgba(26,26,26,0.65)",
              borderColor: activeSec === s.id ? "var(--navy)" : "rgba(15,76,92,0.15)",
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Subsection picker (sections 1 & 2) */}
      {section.hasSubs && (
        <div className="rounded-xl border bg-white p-4" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Sub-section</p>
          <div className="flex flex-wrap gap-2">
            {subsections.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                style={{
                  backgroundColor: activeSub === sub.id ? section.color : "transparent",
                  color: activeSub === sub.id ? "white" : "rgba(26,26,26,0.65)",
                  borderColor: activeSub === sub.id ? section.color : "rgba(15,76,92,0.15)",
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload / Add form */}
        <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
          <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
            <Upload size={14} style={{ color: section.color }} />
            <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: section.color }}>
              {activeSec === "videos" ? "Add Vimeo Video" : `Upload ${section.fileLabel}`}
              {activeSub && subsections.length > 0 && ` — ${subsections.find((s) => s.id === activeSub)?.name}`}
            </p>
          </div>
          <form onSubmit={handleUpload} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Title *</label>
              <input
                type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={`e.g. ${activeSec === "exam-templates" ? "Antenatal Station Template" : activeSec === "recalls" ? "2024 Antenatal Recall Questions" : activeSec === "flashcards" ? "Flashcard: Preeclampsia" : activeSec === "videos" ? "Video: Communication Skills" : "Session Recording — June 2025"}`}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: "rgba(15,76,92,0.2)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Description</label>
              <textarea
                rows={2} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..."
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
                style={{ borderColor: "rgba(15,76,92,0.2)" }}
              />
            </div>

            {(activeSec === "videos" || activeSec === "recorded-sessions") ? (
              /* Vimeo URL input */
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Vimeo URL *</label>
                <input
                  type="url" required value={form.vimeoUrl ?? ""}
                  onChange={(e) => setForm({ ...form, vimeoUrl: e.target.value })}
                  placeholder="https://vimeo.com/123456789"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.2)" }}
                />
                <p className="text-xs mt-1.5" style={{ color: "rgba(26,26,26,0.45)" }}>
                  Upload the session to Vimeo, then paste the URL here. Students will watch it embedded on this platform.
                </p>
              </div>
            ) : (
              /* File drop zone */
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
                  {section.fileLabel} File *{" "}
                  <span className="font-normal" style={{ color: "rgba(26,26,26,0.4)" }}>
                    ({section.accept.split(",").map((m) => m.split("/")[1]?.toUpperCase()).filter(Boolean).join(", ")})
                  </span>
                </label>
                <div
                  className="rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: file ? section.color : "rgba(15,76,92,0.2)",
                    backgroundColor: file ? `color-mix(in srgb, ${section.color} 5%, transparent)` : "transparent",
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef} type="file" className="hidden"
                    accept={section.accept}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <div className="flex justify-center mb-2" style={{ color: file ? section.color : "rgba(15,76,92,0.3)" }}>
                    {section.id === "flashcards" ? <Image size={22} /> : section.id === "recorded-sessions" ? <Mic size={22} /> : <FileText size={22} />}
                  </div>
                  {file ? (
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{file.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>{fmtSize(file.size)}</p>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>Click to select a file</p>
                  )}
                </div>
              </div>
            )}

            {uploading && (
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(26,26,26,0.5)" }}>
                  <span>Uploading…</span><span>{progress}%</span>
                </div>
                <div className="rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: "rgba(15,76,92,0.1)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: section.color }} />
                </div>
              </div>
            )}
            {err && <p className="text-sm text-red-600">{err}</p>}
            {done && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--teal)" }}>
                <CheckCircle size={14} /> {activeSec === "videos" ? "Video added successfully!" : "Uploaded successfully!"}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || (activeSec !== "videos" && activeSec !== "recorded-sessions" && !file) || (section.hasSubs && !activeSub)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: section.color === "var(--navy)" ? "var(--navy)" : section.color, color: section.color === "var(--navy)" ? "white" : "var(--navy)" }}
            >
              {uploading ? <><Loader size={13} className="animate-spin" /> Saving…</> : activeSec === "videos" ? <><Video size={13} /> Add Video</> : <><Upload size={13} /> Upload {section.fileLabel}</>}
            </button>
            {section.hasSubs && !activeSub && (
              <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>Select a sub-section above before uploading.</p>
            )}
          </form>
        </div>

        {/* Library */}
        <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
            <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: section.color }}>
              {section.fileLabel} Library
              {activeSub && subsections.length > 0 && ` — ${subsections.find((s) => s.id === activeSub)?.name}`}
            </p>
            <button onClick={fetchItems} className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Refresh</button>
          </div>
          {section.hasSubs && !activeSub ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>Select a sub-section to view its files.</p>
            </div>
          ) : loadingItems ? (
            <div className="p-8 text-center"><Loader size={18} className="animate-spin mx-auto" style={{ color: "var(--teal)" }} /></div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>No files uploaded yet.</div>
          ) : (
            <div className="divide-y max-h-[480px] overflow-auto" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${section.color} 10%, transparent)`, color: section.color }}>
                    {section.id === "flashcards" ? <Image size={14} /> : section.id === "videos" ? <Video size={14} /> : section.id === "recorded-sessions" ? <Mic size={14} /> : <FileText size={14} />}
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openPreview(item)}>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{item.title}</p>
                    <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>
                      {item.file_name === "vimeo" ? "Vimeo Video" : item.file_name} · {item.file_name === "vimeo" ? "" : fmtSize(item.file_size) + " · "}{new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => openPreview(item)} aria-label={`Preview ${item.title}`} className="w-9 h-9 rounded flex items-center justify-center hover:bg-gray-50 flex-shrink-0" style={{ color: "rgba(26,26,26,0.45)" }}>
                    <Eye size={14} aria-hidden="true" />
                  </button>
                  <button onClick={() => openEdit(item)} aria-label={`Edit ${item.title}`} className="w-9 h-9 rounded flex items-center justify-center hover:bg-blue-50 flex-shrink-0" style={{ color: "rgba(26,26,26,0.45)" }}>
                    <Pencil size={14} aria-hidden="true" />
                  </button>
                  <button onClick={() => handleDelete(item)} aria-label={`Delete ${item.title}`} className="w-9 h-9 rounded flex items-center justify-center hover:bg-red-50 flex-shrink-0" style={{ color: "rgba(200,50,50,0.5)" }}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* In-page preview modal */}
      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif font-semibold text-lg" style={{ color: "var(--navy)" }}>Edit Content</h3>
              <button onClick={() => setEditItem(null)} className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100" style={{ color: "rgba(26,26,26,0.45)" }}><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Description</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Optional description…"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
                  style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--ink)" }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: "rgba(26,26,26,0.5)" }}>Cancel</button>
              <button onClick={handleEditSave} disabled={editSaving || !editForm.title.trim()} className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                {editSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--navy)" }}>{previewItem.item.title}</p>
                <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{previewItem.item.file_name} · {fmtSize(previewItem.item.file_size)}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {(section.fileLabel === "PDF") && (
                  <button onClick={openAdminPdfFullscreen} aria-label="Fullscreen" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100" title="Fullscreen">
                    <Maximize2 size={16} style={{ color: "var(--navy)" }} />
                  </button>
                )}
                <a
                  href={previewItem.url}
                  download={previewItem.item.file_name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                >
                  <Download size={13} /> Download
                </a>
                <button onClick={() => setPreviewItem(null)} aria-label="Close preview" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <X size={16} style={{ color: "var(--navy)" }} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[400px]">
              {section.id === "flashcards" ? (
                <img src={previewItem.url} alt={previewItem.item.title} className="max-w-full max-h-[65vh] object-contain p-4" />
              ) : section.id === "videos" ? (
                (() => {
                  try {
                    const u = new URL(previewItem.url);
                    let embedSrc: string | null = null;
                    if (u.hostname.includes("vimeo.com")) {
                      const vid = u.pathname.split("/").filter(Boolean)[0];
                      if (vid) embedSrc = `https://player.vimeo.com/video/${vid}?badge=0&autopause=0&player_id=0`;
                    }
                    if (embedSrc) return <div className="w-full" style={{ aspectRatio: "16/9" }}><iframe src={embedSrc} className="w-full h-full" style={{ minHeight: "400px" }} title={previewItem.item.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>;
                  } catch { /* not a URL */ }
                  return <video controls src={previewItem.url} className="max-w-full max-h-[65vh]" />;
                })()
              ) : section.id === "recorded-sessions" ? (
                (() => {
                  try {
                    const u = new URL(previewItem.url);
                    let embedSrc: string | null = null;
                    if (u.hostname.includes("vimeo.com")) {
                      const vid = u.pathname.split("/").filter(Boolean)[0];
                      if (vid) embedSrc = `https://player.vimeo.com/video/${vid}?badge=0&autopause=0&player_id=0`;
                    }
                    if (embedSrc) return <div className="w-full" style={{ aspectRatio: "16/9" }}><iframe src={embedSrc} className="w-full h-full" style={{ minHeight: "400px" }} title={previewItem.item.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>;
                  } catch { /* not a URL */ }
                  return <p className="text-sm text-red-500">Invalid Vimeo URL</p>;
                })()
              ) : (
                <iframe ref={adminPdfIframeRef} src={previewItem.url} className="w-full min-h-[500px]" title={previewItem.item.title} style={{ height: "65vh" }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main AdminClient ──────────────────────────────────────────────────────────
export default function AdminClient({ user }: { user: AdminUser }) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentFilter, setStudentFilter] = useState<"all" | "pending" | "active" | "blocked" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuditRow[]>([]);
  const [recentItems, setRecentItems] = useState<ContentItem[]>([]);

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsDone, setSettingsDone] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Batch records state
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [batchStudents, setBatchStudents] = useState<BatchStudent[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [newBatchModal, setNewBatchModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchNotes, setNewBatchNotes] = useState("");
  const [newBatchSaving, setNewBatchSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [cellValue, setCellValue] = useState("");
  const [batchSavingRow, setBatchSavingRow] = useState<string | null>(null);

  // Payment reminder state
  const [reminderInterval, setReminderInterval] = useState<14 | 30>(30);
  const [reminderStudents, setReminderStudents] = useState<BatchStudent[]>([]);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [reminderResults, setReminderResults] = useState<Record<string, { type: "ok" | "err"; text: string }>>({});
  const [dueIds, setDueIds] = useState<string[]>([]);
  const [checkingDue, setCheckingDue] = useState(false);
  const [adminNotified, setAdminNotified] = useState(false);

  // Announcement email state
  const [announcementSubject, setAnnouncementSubject] = useState("Announcement from MRCPI OBGYN Unlocked");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementSending, setAnnouncementSending] = useState(false);
  const [announcementTesting, setAnnouncementTesting] = useState(false);
  const [announcementResult, setAnnouncementResult] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [announcementPreview, setAnnouncementPreview] = useState(false);

  // Feedback state
  const [feedbackModal, setFeedbackModal] = useState<{ studentId: string; studentName: string } | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ type: "general" as "general" | "progress", title: "", content: "" });
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [sessionFeedbackModal, setSessionFeedbackModal] = useState<{ bookingId: string; studentId: string; studentName: string; sessionDate: string } | null>(null);
  const [sessionFeedbackForm, setSessionFeedbackForm] = useState({
    overall_score: "",
    overall_notes: "",
    stations: [
      { name: "History Taking", score: "", max: 10, comments: "" },
      { name: "Clinical Examination", score: "", max: 10, comments: "" },
      { name: "Communication & Counselling", score: "", max: 10, comments: "" },
      { name: "Management Plan", score: "", max: 10, comments: "" },
      { name: "Professionalism", score: "", max: 10, comments: "" },
    ],
  });
  const [sessionFeedbackSaving, setSessionFeedbackSaving] = useState(false);
  const [sessionFeedbackDone, setSessionFeedbackDone] = useState(false);

  // Payments state
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentForm, setPaymentForm] = useState({ student_name: "", student_email: "", amount: "", currency: "SAR", payment_date: new Date().toISOString().slice(0, 10), notes: "", payment_status: "paid_full" as "paid_full" | "paid_part", total_fee: "", remaining_fee: "" });
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mtdRevenue, setMtdRevenue] = useState(0);

  // Mock OSCEs state
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [slotForm, setSlotForm] = useState({ date_label: "", slots_raw: "09:00 AST\n11:00 AST\n14:00 AST" });
  const [slotSaving, setSlotSaving] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [confirmModal, setConfirmModal] = useState<BookingRow | null>(null);
  const [meetLink, setMeetLink] = useState("");
  const [sendingConfirm, setSendingConfirm] = useState(false);
  const [confirmSent, setConfirmSent] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"pending" | "approved" | "rejected">("pending");

  // Success Stories state
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [tsForm, setTsForm] = useState({ name: "", country: "", initials: "", color: "#0b6157", blur_avatar: false, messagesRaw: "" });
  const [tsSaving, setTsSaving] = useState(false);
  const [tsDone, setTsDone] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    const { data } = await supabase.from("profiles").select("id, email, full_name, role, status, created_at, registration_notes, last_seen").neq("id", user.id).eq("role", "student").order("created_at", { ascending: false });
    const rows = (data ?? []) as StudentRow[];
    setStudents(rows);
    setPendingCount(rows.filter((s) => s.status === "pending").length);
    setLoadingStudents(false);
  }, [user.id]);

  const fetchAuditLogs = useCallback(async () => {
    const { data } = await supabase.from("audit_logs").select("id, user_email, action, resource, created_at").order("created_at", { ascending: false }).limit(20);
    setAuditLogs(data ?? []);
  }, []);

  const fetchRecentItems = useCallback(async () => {
    const { data } = await supabase.from("content_items").select("*").order("created_at", { ascending: false }).limit(5);
    setRecentItems(data ?? []);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value ?? ""; });
    setSettings(map);
  }, []);

  const saveSettings = async (updates: Record<string, string>) => {
    setSettingsSaving(true);
    for (const [key, value] of Object.entries(updates)) {
      await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSettingsSaving(false);
    setSettingsDone(true);
    setTimeout(() => setSettingsDone(false), 2000);
    fetchSettings();
  };

  const fetchPayments = useCallback(async () => {
    const { data } = await supabase.from("payments").select("*").order("payment_date", { ascending: false });
    const rows = (data ?? []) as PaymentRow[];
    setPayments(rows);
    setTotalRevenue(rows.reduce((sum, p) => sum + Number(p.amount), 0));
    const now = new Date();
    const mtd = rows.filter(p => {
      const d = new Date(p.payment_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    setMtdRevenue(mtd.reduce((sum, p) => sum + Number(p.amount), 0));
  }, []);

  const fetchReminderStudents = useCallback(async () => {
    setReminderLoading(true);
    const { data } = await supabase
      .from("batch_students")
      .select("*, payment_batches(name)")
      .gt("pending", 0)
      .order("sort_order");
    setReminderStudents((data ?? []) as BatchStudent[]);
    setReminderLoading(false);
  }, []);

  const checkDueStudents = useCallback(async (interval: number, notify = false) => {
    setCheckingDue(true);
    const res = await fetch(`/api/admin/send-payment-reminder?interval=${interval}&notify=${notify ? 1 : 0}`);
    const data = await res.json();
    setDueIds(data.due ?? []);
    if (notify) setAdminNotified(true);
    setCheckingDue(false);
  }, []);

  const fetchBatches = useCallback(async () => {
    const { data } = await supabase.from("payment_batches").select("*").order("created_at", { ascending: false });
    const rows = (data ?? []) as BatchRow[];
    setBatches(rows);
    if (rows.length > 0) setActiveBatchId(prev => prev ?? rows[0].id);
  }, []);

  const fetchBatchStudents = useCallback(async (batchId: string) => {
    setBatchLoading(true);
    const { data } = await supabase.from("batch_students").select("*").eq("batch_id", batchId).order("sort_order");
    setBatchStudents((data ?? []) as BatchStudent[]);
    setBatchLoading(false);
  }, []);

  const fetchSlots = useCallback(async () => {
    const { data } = await supabase.from("mock_osce_slots").select("*").order("sort_order");
    setSlots(data ?? []);
  }, []);

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase.from("osce_bookings").select("*").order("created_at", { ascending: false });
    setBookings(data ?? []);
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    const { data } = await supabase.from("student_reviews").select("*").order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoadingReviews(false);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setTestimonials(data ?? []);
    setLoadingTestimonials(false);
  }, []);

  useEffect(() => {
    if (activeNav === "Security") fetchAuditLogs();
    if (activeNav === "Overview") { fetchAuditLogs(); fetchStudents(); fetchRecentItems(); fetchPayments(); }
    if (activeNav === "Students") fetchStudents();
    if (activeNav === "Success Stories") fetchTestimonials();
    if (activeNav === "Reviews") fetchReviews();
    if (activeNav === "Mock OSCEs") { fetchSlots(); fetchBookings(); }
    if (activeNav === "Payments") { fetchPayments(); fetchBatches(); fetchReminderStudents(); }
    if (activeNav === "Settings") { fetchSettings(); }
    if (activeNav === "Courses") fetchSettings();
  }, [activeNav, fetchAuditLogs, fetchStudents, fetchRecentItems, fetchTestimonials, fetchReviews, fetchSlots, fetchBookings, fetchPayments, fetchSettings, fetchBatches, fetchReminderStudents]);

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 30000);
    return () => clearInterval(interval);
  }, [fetchStudents]);

  useEffect(() => {
    if (activeBatchId) fetchBatchStudents(activeBatchId);
  }, [activeBatchId, fetchBatchStudents]);

  const handleStudentAction = async (studentId: string, action: "approve" | "reject" | "block" | "reinstate" | "terminate") => {
    setActionLoading(studentId + action);
    const res = await fetch("/api/admin/approve-student", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, action }),
    });
    setActionLoading(null);
    if (res.ok) fetchStudents();
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTsSaving(true);
    const messages = tsForm.messagesRaw.split("\n").map((m) => m.trim()).filter(Boolean);
    const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.sort_order)) : 0;
    await supabase.from("testimonials").insert([{
      name: tsForm.name,
      country: tsForm.country,
      initials: tsForm.initials,
      color: tsForm.color,
      blur_avatar: tsForm.blur_avatar,
      messages,
      sort_order: maxOrder + 1,
      visible: true,
    }]);
    await logAudit(user.id, user.email, user.role, "add_testimonial", tsForm.name);
    setTsSaving(false);
    setTsDone(true);
    setTsForm({ name: "", country: "", initials: "", color: "#0b6157", blur_avatar: false, messagesRaw: "" });
    setTimeout(() => { setTsDone(false); fetchTestimonials(); }, 1500);
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    await logAudit(user.id, user.email, user.role, "delete_testimonial", name);
    fetchTestimonials();
  };

  const handleToggleVisible = async (id: string, current: boolean) => {
    await supabase.from("testimonials").update({ visible: !current }).eq("id", id);
    fetchTestimonials();
  };

  const handleReviewAction = async (id: string, action: "approved" | "rejected") => {
    await supabase.from("student_reviews").update({
      status: action,
      ...(action === "approved" ? { approved_at: new Date().toISOString() } : {}),
    }).eq("id", id);
    await logAudit(user.id, user.email, user.role, `review_${action}`, id);
    fetchReviews();
  };

  const handleDeleteReview = async (id: string) => {
    await supabase.from("student_reviews").delete().eq("id", id);
    await logAudit(user.id, user.email, user.role, "review_deleted", id);
    fetchReviews();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const initials = (user.name ?? user.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--paper)" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r hidden lg:flex flex-col" style={{ backgroundColor: "var(--navy)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="font-serif text-white font-semibold text-sm">MRCPI-OBGYN</p>
          <p className="font-mono-data text-xs mt-0.5" style={{ color: "var(--teal-bright)" }}>Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((n) => (
            <button key={n.label} onClick={() => setActiveNav(n.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors"
              style={{ backgroundColor: activeNav === n.label ? "rgba(21,176,151,0.15)" : "transparent", color: activeNav === n.label ? "var(--teal-bright)" : "rgba(255,255,255,0.6)" }}
            >
              {n.icon}
              <span className="flex-1">{n.label}</span>
              {n.label === "Students" && pendingCount > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "var(--teal)" }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name || user.email}</p>
              <p className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.4)" }}>{user.role}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-white/5" style={{ color: "rgba(255,255,255,0.5)" }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
          <div>
            <h1 className="font-serif font-semibold text-lg" style={{ color: "var(--navy)" }}>{activeNav === "Overview" ? "Dashboard Overview" : activeNav}</h1>
            <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative w-11 h-11 rounded-lg border flex items-center justify-center" style={{ borderColor: "rgba(15,76,92,0.2)" }}>
              <Bell size={16} aria-hidden="true" style={{ color: "var(--navy)" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--teal-bright)" }} />
            </button>
            <button onClick={() => setActiveNav("Content")} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
              <Plus size={14} aria-hidden="true" /> Add Content
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* ── CONTENT PANEL ── */}
          {activeNav === "Content" && <ContentPanel user={user} />}

          {/* ── OVERVIEW ── */}
          {activeNav === "Overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {buildStats(students.length, mtdRevenue, totalRevenue).map((s, i) => (
                  <div key={i} className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.04)", color: s.color }}>{s.icon}</div>
                      <TrendingUp size={14} style={{ color: "rgba(26,26,26,0.3)" }} />
                    </div>
                    <p className="font-serif font-bold mb-0.5 whitespace-nowrap" style={{ color: "var(--navy)", fontSize: s.value.length > 8 ? "1.6rem" : "1.875rem" }}>{s.value}</p>
                    <p className="text-xs font-medium mb-1" style={{ color: "rgba(26,26,26,0.55)" }}>{s.label}</p>
                    <p className="text-xs" style={{ color: s.color }}>{s.change}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enrollments */}
                <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                    <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Recent Enrollments</p>
                    <button className="text-xs font-semibold" style={{ color: "var(--teal)" }}>View All</button>
                  </div>
                  {students.length === 0 ? (
                    <div className="px-5 py-8 text-sm text-center" style={{ color: "rgba(26,26,26,0.4)" }}>No enrollments yet.</div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                      {students.slice(0, 5).map((s) => {
                        const ini = (s.full_name ?? s.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                        const badgeBg = s.status === "active" ? "rgba(21,176,151,0.1)" : s.status === "pending" ? "rgba(201,162,39,0.12)" : "rgba(200,50,50,0.08)";
                        const badgeColor = s.status === "active" ? "var(--teal)" : s.status === "pending" ? "var(--gold)" : "rgba(180,40,40,0.8)";
                        return (
                          <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--teal)" }}>{ini}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{s.full_name || s.email}</p>
                              <p className="text-xs truncate" style={{ color: "rgba(26,26,26,0.45)" }}>{new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full font-semibold capitalize flex-shrink-0" style={{ backgroundColor: badgeBg, color: badgeColor }}>{s.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Uploads */}
                <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                    <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Recently Uploaded</p>
                    <button onClick={() => setActiveNav("Content")} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                      <Upload size={12} /> Upload
                    </button>
                  </div>
                  {recentItems.length === 0 ? (
                    <div className="p-8 text-center text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>No content uploaded yet.</div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                      {recentItems.map((item) => {
                        const s = CONTENT_SECTIONS.find((cs) => cs.id === item.section_id);
                        return (
                          <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(11,30,61,0.06)", color: "var(--navy)" }}>
                              {s?.id === "flashcards" ? <Image size={14} /> : s?.id === "videos" ? <Video size={14} /> : s?.id === "recorded-sessions" ? <Mic size={14} /> : <FileText size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: "var(--navy)" }}>{item.title}</p>
                              <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>{s?.fileLabel} · {fmtSize(item.file_size)} · {new Date(item.created_at).toLocaleDateString("en-GB")}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.08)", color: "var(--teal)" }}>Live</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Log */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <Shield size={15} style={{ color: "var(--teal)" }} />
                    <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Security &amp; Audit Log</p>
                  </div>
                  <button onClick={() => setActiveNav("Security")} className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Full Log</button>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                  {auditLogs.length === 0 ? (
                    <div className="px-5 py-6 text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>No audit events yet.</div>
                  ) : auditLogs.slice(0, 5).map((l) => (
                    <div key={l.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--teal-bright)" }} />
                      <p className="text-xs flex-1" style={{ color: "rgba(26,26,26,0.7)" }}>{l.action}{l.resource ? ` — ${l.resource}` : ""}</p>
                      <p className="text-xs font-mono-data" style={{ color: "rgba(26,26,26,0.4)" }}>{l.user_email}</p>
                      <p className="text-xs flex-shrink-0" style={{ color: "rgba(26,26,26,0.35)" }}>{new Date(l.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── STUDENTS PANEL ── */}
          {activeNav === "Students" && (
            <div className="space-y-6">
              {pendingCount > 0 && (
                <div className="rounded-xl border px-5 py-4 flex items-center gap-4" style={{ borderColor: "rgba(201,162,39,0.3)", backgroundColor: "rgba(201,162,39,0.06)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}>{pendingCount}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{pendingCount} registration{pendingCount > 1 ? "s" : ""} awaiting your approval</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.55)" }}>Review and approve or reject below</p>
                  </div>
                  <button onClick={() => setStudentFilter("pending")} className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}>View Pending</button>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {(["pending", "active", "blocked", "rejected", "all"] as const).map((f) => {
                  const count = f === "all" ? students.length : students.filter((s) => s.status === f).length;
                  return (
                    <button key={f} onClick={() => setStudentFilter(f)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors" style={{ backgroundColor: studentFilter === f ? "var(--navy)" : "white", color: studentFilter === f ? "white" : "rgba(26,26,26,0.6)", border: "1px solid rgba(15,76,92,0.15)" }}>
                      {f} <span className="ml-1 text-xs opacity-60">({count})</span>
                    </button>
                  );
                })}
                <button onClick={fetchStudents} className="ml-auto text-xs font-semibold px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(15,76,92,0.15)", color: "var(--teal)" }}>Refresh</button>
              </div>

              <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>{studentFilter === "all" ? "All Users" : `${studentFilter.charAt(0).toUpperCase() + studentFilter.slice(1)} Registrations`}</p>
                </div>
                {loadingStudents ? (
                  <div className="p-8 text-center"><Loader size={18} className="animate-spin mx-auto" style={{ color: "var(--teal)" }} /></div>
                ) : (() => {
                  const filtered = studentFilter === "all" ? students : students.filter((s) => s.status === studentFilter);
                  if (filtered.length === 0) return <div className="p-8 text-center text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>No {studentFilter === "all" ? "" : studentFilter} registrations.</div>;
                  return (
                    <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                      {filtered.map((s) => {
                        const ini = (s.full_name ?? s.email).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                        const avatarColor = s.status === "pending" ? "var(--gold)" : s.status === "active" ? "var(--teal)" : s.status === "blocked" ? "#6b21a8" : "rgba(200,50,50,0.6)";
                        const badgeBg = s.status === "active" ? "rgba(21,176,151,0.1)" : s.status === "pending" ? "rgba(201,162,39,0.12)" : s.status === "blocked" ? "rgba(107,33,168,0.1)" : "rgba(200,50,50,0.08)";
                        const badgeColor = s.status === "active" ? "var(--teal)" : s.status === "pending" ? "var(--gold)" : s.status === "blocked" ? "#6b21a8" : "rgba(180,40,40,0.8)";
                        return (
                          <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: avatarColor }}>{ini}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>{s.full_name || "(No name)"}</p>
                                {s.last_seen && (new Date().getTime() - new Date(s.last_seen).getTime()) < 2 * 60 * 1000 && (
                                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#16a34a" }}>
                                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                                    Online
                                  </span>
                                )}
                              </div>
                              <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{s.email}</p>
                              <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.35)" }}>Registered {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}{s.last_seen ? ` · Last seen ${new Date(s.last_seen).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full capitalize flex-shrink-0" style={{ backgroundColor: "rgba(15,76,92,0.08)", color: "var(--navy)" }}>{s.role}</span>
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize flex-shrink-0" style={{ backgroundColor: badgeBg, color: badgeColor }}>{s.status}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {s.status === "active" && (
                                <button onClick={() => { setFeedbackForm({ type: "general", title: "", content: "" }); setFeedbackDone(false); setFeedbackModal({ studentId: s.id, studentName: s.full_name || s.email }); }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
                                  style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--navy)" }}>
                                  Write Feedback
                                </button>
                              )}
                              {s.status === "pending" && (
                                <>
                                  <button onClick={() => handleStudentAction(s.id, "approve")} disabled={actionLoading === s.id + "approve"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>{actionLoading === s.id + "approve" ? "…" : "Approve"}</button>
                                  <button onClick={() => handleStudentAction(s.id, "reject")} disabled={actionLoading === s.id + "reject"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(200,50,50,0.3)", color: "rgba(180,40,40,0.8)" }}>{actionLoading === s.id + "reject" ? "…" : "Reject"}</button>
                                </>
                              )}
                              {s.status === "active" && (
                                <>
                                  <button onClick={() => { if (confirm(`Block access for ${s.full_name || s.email}? They will immediately lose access to the platform.`)) handleStudentAction(s.id, "block"); }} disabled={actionLoading === s.id + "block"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(107,33,168,0.35)", color: "#6b21a8" }}>{actionLoading === s.id + "block" ? "…" : "Block Access"}</button>
                                  <button onClick={() => { if (confirm(`TERMINATE account for ${s.full_name || s.email}? This permanently deletes their account and cannot be undone.`)) handleStudentAction(s.id, "terminate"); }} disabled={actionLoading === s.id + "terminate"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(200,50,50,0.35)", color: "rgba(180,40,40,0.9)" }}>{actionLoading === s.id + "terminate" ? "…" : "Terminate"}</button>
                                </>
                              )}
                              {s.status === "blocked" && (
                                <>
                                  <button onClick={() => handleStudentAction(s.id, "reinstate")} disabled={actionLoading === s.id + "reinstate"} className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>{actionLoading === s.id + "reinstate" ? "…" : "Reinstate"}</button>
                                  <button onClick={() => { if (confirm(`TERMINATE account for ${s.full_name || s.email}? This permanently deletes their account and cannot be undone.`)) handleStudentAction(s.id, "terminate"); }} disabled={actionLoading === s.id + "terminate"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(200,50,50,0.35)", color: "rgba(180,40,40,0.9)" }}>{actionLoading === s.id + "terminate" ? "…" : "Terminate"}</button>
                                </>
                              )}
                              {s.status === "rejected" && (
                                <>
                                  <button onClick={() => handleStudentAction(s.id, "approve")} disabled={actionLoading === s.id + "approve"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--teal)" }}>{actionLoading === s.id + "approve" ? "…" : "Approve"}</button>
                                  <button onClick={() => { if (confirm(`TERMINATE account for ${s.full_name || s.email}? This permanently deletes their account and cannot be undone.`)) handleStudentAction(s.id, "terminate"); }} disabled={actionLoading === s.id + "terminate"} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 border" style={{ borderColor: "rgba(200,50,50,0.35)", color: "rgba(180,40,40,0.9)" }}>{actionLoading === s.id + "terminate" ? "…" : "Terminate"}</button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── SUCCESS STORIES ── */}
          {activeNav === "Success Stories" && (
            <div className="space-y-6">
              {/* Add new */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Plus size={16} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Add New Success Story</h2>
                </div>
                <form onSubmit={handleAddTestimonial} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Student Name *</label>
                      <input required value={tsForm.name} onChange={e => setTsForm({ ...tsForm, name: e.target.value })}
                        placeholder="Dr. Jane Smith" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Country *</label>
                      <input required value={tsForm.country} onChange={e => setTsForm({ ...tsForm, country: e.target.value })}
                        placeholder="e.g. Saudi Arabia" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Initials *</label>
                      <input required value={tsForm.initials} onChange={e => setTsForm({ ...tsForm, initials: e.target.value })}
                        placeholder="JS" maxLength={3} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Avatar Colour</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={tsForm.color} onChange={e => setTsForm({ ...tsForm, color: e.target.value })}
                          className="w-10 h-9 rounded border cursor-pointer" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                        <span className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{tsForm.color}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Messages * <span className="font-normal" style={{ color: "rgba(26,26,26,0.5)" }}>(one per line — each line = one bubble)</span>
                    </label>
                    <textarea required rows={4} value={tsForm.messagesRaw} onChange={e => setTsForm({ ...tsForm, messagesRaw: e.target.value })}
                      placeholder={"Thank you so much Dr.Einas..\nReally words feel helpless to predict my gratitude...\nHighly appreciate your support and care 🙏"}
                      className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: "var(--navy)" }}>
                    <input type="checkbox" checked={tsForm.blur_avatar} onChange={e => setTsForm({ ...tsForm, blur_avatar: e.target.checked })} />
                    Blur avatar (for privacy)
                  </label>
                  <button type="submit" disabled={tsSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    {tsSaving ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                    {tsDone ? "Added!" : tsSaving ? "Saving…" : "Add Story"}
                  </button>
                </form>
              </div>

              {/* Existing stories */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} style={{ color: "var(--teal)" }} />
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Current Success Stories</h2>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>{testimonials.length} stories</span>
                </div>
                {loadingTestimonials ? (
                  <div className="flex items-center justify-center py-12"><Loader size={20} className="animate-spin" style={{ color: "var(--teal)" }} /></div>
                ) : testimonials.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: "rgba(26,26,26,0.4)" }}>No stories yet. Add one above.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                    {testimonials.map((t) => (
                      <div key={t.id} className="flex items-start gap-4 p-5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: t.color, filter: t.blur_avatar ? "blur(4px)" : "none" }}>
                          {t.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{t.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.08)", color: "var(--teal)" }}>{t.country}</span>
                            {!t.visible && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">Hidden</span>}
                          </div>
                          <div className="space-y-1">
                            {t.messages.map((m, i) => (
                              <p key={i} className="text-xs leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>&ldquo;{m}&rdquo;</p>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => handleToggleVisible(t.id, t.visible)}
                            aria-label={t.visible ? "Hide from site" : "Show on site"}
                            title={t.visible ? "Hide from site" : "Show on site"}
                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-gray-50"
                            style={{ borderColor: "rgba(15,76,92,0.2)", color: t.visible ? "var(--teal)" : "rgba(26,26,26,0.3)" }}>
                            <Eye size={14} aria-hidden="true" />
                          </button>
                          <button onClick={() => handleDeleteTestimonial(t.id, t.name)}
                            aria-label={`Delete ${t.name} testimonial`}
                            title="Delete permanently"
                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-red-50"
                            style={{ borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeNav === "Reviews" && (
            <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                <div className="flex items-center gap-2">
                  <Star size={16} style={{ color: "var(--gold)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Student Reviews &amp; Testimonials</h2>
                </div>
                <div className="flex gap-1">
                  {(["pending", "approved", "rejected"] as const).map(f => (
                    <button key={f} onClick={() => setReviewFilter(f)}
                      className="px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all"
                      style={{
                        backgroundColor: reviewFilter === f ? (f === "pending" ? "rgba(201,162,39,0.15)" : f === "approved" ? "rgba(21,176,151,0.15)" : "rgba(220,38,38,0.1)") : "transparent",
                        color: reviewFilter === f ? (f === "pending" ? "var(--gold)" : f === "approved" ? "var(--teal-bright)" : "#dc2626") : "rgba(26,26,26,0.4)",
                        border: `1px solid ${reviewFilter === f ? "currentColor" : "transparent"}`,
                      }}>
                      {f} ({reviews.filter(r => r.status === f).length})
                    </button>
                  ))}
                </div>
              </div>

              {loadingReviews ? (
                <div className="flex items-center justify-center py-16"><Loader size={20} className="animate-spin" style={{ color: "var(--teal)" }} /></div>
              ) : reviews.filter(r => r.status === reviewFilter).length === 0 ? (
                <p className="text-sm text-center py-12" style={{ color: "rgba(26,26,26,0.4)" }}>No {reviewFilter} reviews.</p>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                  {reviews.filter(r => r.status === reviewFilter).map(r => (
                    <div key={r.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{r.student_name}</span>
                            <span className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={13} fill={s <= r.rating ? "var(--gold)" : "none"} style={{ color: "var(--gold)" }} />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed italic" style={{ color: "rgba(26,26,26,0.7)" }}>&ldquo;{r.review_text}&rdquo;</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => handleReviewAction(r.id, "approved")}
                                aria-label={`Approve review by ${r.student_name}`}
                                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                                style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal-bright)" }}>
                                Approve
                              </button>
                              <button onClick={() => handleReviewAction(r.id, "rejected")}
                                aria-label={`Reject review by ${r.student_name}`}
                                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                                style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                                Reject
                              </button>
                            </>
                          )}
                          {r.status === "approved" && (
                            <button onClick={() => handleReviewAction(r.id, "rejected")}
                              aria-label={`Revoke approval of review by ${r.student_name}`}
                              className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                              style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                              Revoke
                            </button>
                          )}
                          {r.status === "rejected" && (
                            <button onClick={() => handleReviewAction(r.id, "approved")}
                              aria-label={`Approve review by ${r.student_name}`}
                              className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                              style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal-bright)" }}>
                              Approve
                            </button>
                          )}
                          <button onClick={() => handleDeleteReview(r.id)}
                            aria-label={`Delete review by ${r.student_name}`}
                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-red-50"
                            style={{ borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MOCK OSCEs ── */}
          {activeNav === "Mock OSCEs" && (
            <div className="space-y-6">
              {/* Add new date */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Plus size={16} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Add New Session Date</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSlotSaving(true);
                  const parsedSlots = slotForm.slots_raw.split("\n").map(s => s.trim()).filter(Boolean);
                  const maxOrder = slots.length > 0 ? Math.max(...slots.map(s => s.sort_order)) : 0;
                  await supabase.from("mock_osce_slots").insert([{
                    date_label: slotForm.date_label.trim(),
                    slots: parsedSlots,
                    sort_order: maxOrder + 1,
                    visible: true,
                  }]);
                  setSlotSaving(false);
                  setSlotForm({ date_label: "", slots_raw: "09:00 AST\n11:00 AST\n14:00 AST" });
                  fetchSlots();
                }} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Date Label *</label>
                    <input required value={slotForm.date_label} onChange={e => setSlotForm({ ...slotForm, date_label: e.target.value })}
                      placeholder="e.g. Monday, 28 July 2026"
                      className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Time Slots * <span className="font-normal" style={{ color: "rgba(26,26,26,0.5)" }}>(one per line, e.g. 09:00 AST)</span>
                    </label>
                    <textarea required rows={4} value={slotForm.slots_raw} onChange={e => setSlotForm({ ...slotForm, slots_raw: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm font-mono resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <button type="submit" disabled={slotSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    {slotSaving ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
                    {slotSaving ? "Saving…" : "Add Date"}
                  </button>
                </form>
              </div>

              {/* Existing dates */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: "var(--teal)" }} />
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Current Session Dates</h2>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                    {slots.filter(s => s.visible).length} visible / {slots.length} total
                  </span>
                </div>
                {slots.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: "rgba(26,26,26,0.4)" }}>No dates yet. Add one above.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                    {slots.map(s => (
                      <div key={s.id} className="flex items-start gap-4 p-5">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm mb-1" style={{ color: "var(--navy)" }}>{s.date_label}</p>
                          <div className="flex flex-wrap gap-2">
                            {s.slots.map(t => (
                              <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={async () => { await supabase.from("mock_osce_slots").update({ visible: !s.visible }).eq("id", s.id); fetchSlots(); }}
                            title={s.visible ? "Hide from booking page" : "Show on booking page"}
                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-gray-50"
                            style={{ borderColor: "rgba(15,76,92,0.2)", color: s.visible ? "var(--teal)" : "rgba(26,26,26,0.3)" }}>
                            <Eye size={14} />
                          </button>
                          <button onClick={async () => { if (confirm(`Delete "${s.date_label}"?`)) { await supabase.from("mock_osce_slots").delete().eq("id", s.id); fetchSlots(); } }}
                            title="Delete permanently"
                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-red-50"
                            style={{ borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookings list */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <Bell size={16} style={{ color: "var(--teal)" }} />
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Booking Requests</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(201,162,39,0.12)", color: "var(--gold)" }}>
                      {bookings.filter(b => b.status === "pending").length} pending
                    </span>
                    <button onClick={fetchBookings} className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Refresh</button>
                  </div>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: "rgba(26,26,26,0.4)" }}>No booking requests yet.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                    {bookings.map(b => {
                      const isPending = b.status === "pending";
                      const isConfirmed = b.status === "confirmed";
                      return (
                        <div key={b.id} className="flex items-start gap-4 p-5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: isPending ? "var(--gold)" : "var(--teal)" }}>
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{b.name}</p>
                            <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{b.email}</p>
                            <p className="text-xs mt-1 font-medium" style={{ color: "var(--teal)" }}>{b.date} · {b.time_slot}</p>
                            {b.notes && <p className="text-xs mt-1 italic" style={{ color: "rgba(26,26,26,0.45)" }}>"{b.notes}"</p>}
                            <p className="text-xs mt-1" style={{ color: "rgba(26,26,26,0.3)" }}>Received {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize"
                              style={{
                                backgroundColor: isPending ? "rgba(201,162,39,0.12)" : "rgba(21,176,151,0.1)",
                                color: isPending ? "var(--gold)" : "var(--teal)",
                              }}>
                              {b.status}
                            </span>
                            {isConfirmed && (
                              <button onClick={() => {
                                setSessionFeedbackForm({ overall_score: "", overall_notes: "", stations: [
                                  { name: "History Taking", score: "", max: 10, comments: "" },
                                  { name: "Clinical Examination", score: "", max: 10, comments: "" },
                                  { name: "Communication & Counselling", score: "", max: 10, comments: "" },
                                  { name: "Management Plan", score: "", max: 10, comments: "" },
                                  { name: "Professionalism", score: "", max: 10, comments: "" },
                                ]});
                                setSessionFeedbackDone(false);
                                setSessionFeedbackModal({ bookingId: b.id, studentId: b.user_id ?? "", studentName: b.name, sessionDate: b.date });
                              }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
                                style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--navy)" }}>
                                Write Scorecard
                              </button>
                            )}
                            {confirmSent === b.id ? (
                              <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                                <CheckCircle size={12} /> Sent!
                              </span>
                            ) : (
                              <button
                                onClick={() => { setConfirmModal(b); setMeetLink(b.meet_link ?? ""); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                                {isConfirmed ? "Resend" : "Send Confirmation"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confirmation modal */}
          {confirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              onClick={() => setConfirmModal(null)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
                  <h2 className="font-serif font-semibold text-base" style={{ color: "var(--navy)" }}>Send Session Confirmation</h2>
                  <button onClick={() => setConfirmModal(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100">
                    <X size={16} style={{ color: "var(--navy)" }} />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {/* Preview */}
                  <div className="rounded-xl p-4 text-sm space-y-1" style={{ backgroundColor: "rgba(21,176,151,0.06)", border: "1px solid rgba(21,176,151,0.15)" }}>
                    <p><span className="font-semibold" style={{ color: "var(--navy)" }}>To:</span> <span style={{ color: "rgba(26,26,26,0.7)" }}>{confirmModal.name} &lt;{confirmModal.email}&gt;</span></p>
                    <p><span className="font-semibold" style={{ color: "var(--navy)" }}>Date:</span> <span style={{ color: "rgba(26,26,26,0.7)" }}>{confirmModal.date}</span></p>
                    <p><span className="font-semibold" style={{ color: "var(--navy)" }}>Time:</span> <span style={{ color: "rgba(26,26,26,0.7)" }}>{confirmModal.time_slot} AST</span></p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Meeting Link (Zoom / Google Meet) *</label>
                    <input
                      type="url" required
                      value={meetLink}
                      onChange={e => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "rgba(15,76,92,0.2)" }}
                    />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(26,26,26,0.5)" }}>
                    This will send the student a confirmation email with the session details, meeting link, and a preparation checklist.
                  </p>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                    style={{ borderColor: "rgba(15,76,92,0.2)", color: "rgba(26,26,26,0.5)" }}>
                    Cancel
                  </button>
                  <button
                    disabled={sendingConfirm || !meetLink.trim()}
                    onClick={async () => {
                      if (!meetLink.trim()) return;
                      setSendingConfirm(true);
                      try {
                        const res = await fetch("/api/send-booking-confirmation", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            studentName: confirmModal.name,
                            studentEmail: confirmModal.email,
                            date: confirmModal.date,
                            timeSlot: confirmModal.time_slot,
                            meetLink: meetLink.trim(),
                            bookingId: confirmModal.id,
                          }),
                        });
                        if (res.ok) {
                          await supabase.from("osce_bookings").update({ status: "confirmed", meet_link: meetLink.trim() }).eq("id", confirmModal.id);
                          setConfirmSent(confirmModal.id);
                          setConfirmModal(null);
                          fetchBookings();
                        }
                      } finally {
                        setSendingConfirm(false);
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    {sendingConfirm ? <><Loader size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send Confirmation</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {activeNav === "Payments" && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", value: `SAR ${totalRevenue.toLocaleString()}`, color: "var(--teal)" },
                  { label: "This Month", value: `SAR ${mtdRevenue.toLocaleString()}`, color: "var(--gold)" },
                  { label: "Payments Recorded", value: String(payments.length), color: "var(--navy)" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(26,26,26,0.45)" }}>{s.label}</p>
                    <p className="font-serif font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Add payment form */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Plus size={16} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Record New Payment</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setPaymentSaving(true);
                  const receiptNumber = `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
                  const isPaidPart = paymentForm.payment_status === "paid_part";
                  const { data: inserted } = await supabase.from("payments").insert([{
                    student_name: paymentForm.student_name.trim(),
                    student_email: paymentForm.student_email.trim().toLowerCase(),
                    amount: parseFloat(paymentForm.amount),
                    currency: paymentForm.currency,
                    payment_date: paymentForm.payment_date,
                    notes: paymentForm.notes.trim() || null,
                    recorded_by: user.email,
                    payment_status: paymentForm.payment_status,
                    total_fee: paymentForm.total_fee ? parseFloat(paymentForm.total_fee) : parseFloat(paymentForm.amount),
                    remaining_fee: isPaidPart && paymentForm.remaining_fee ? parseFloat(paymentForm.remaining_fee) : 0,
                    receipt_number: receiptNumber,
                  }]).select("id").single();
                  await logAudit(user.id, user.email, user.role, "payment_recorded", paymentForm.student_name, { amount: paymentForm.amount, currency: paymentForm.currency });
                  // Auto-send receipt email
                  if (inserted?.id) {
                    fetch("/api/admin/send-payment-receipt", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ paymentId: inserted.id }),
                    }).catch(() => {});
                  }
                  setPaymentSaving(false);
                  setPaymentDone(true);
                  setPaymentForm({ student_name: "", student_email: "", amount: "", currency: "SAR", payment_date: new Date().toISOString().slice(0, 10), notes: "", payment_status: "paid_full", total_fee: "", remaining_fee: "" });
                  setTimeout(() => { setPaymentDone(false); fetchPayments(); }, 1500);
                }} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Student Name *</label>
                      <input required value={paymentForm.student_name} onChange={e => setPaymentForm({ ...paymentForm, student_name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Student Email *</label>
                      <input required type="email" value={paymentForm.student_email} onChange={e => setPaymentForm({ ...paymentForm, student_email: e.target.value })}
                        placeholder="student@example.com"
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Amount Paid *</label>
                      <div className="flex gap-2">
                        <select value={paymentForm.currency} onChange={e => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                          className="px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }}>
                          <option>SAR</option>
                          <option>USD</option>
                          <option>GBP</option>
                          <option>EUR</option>
                        </select>
                        <input required type="number" min="0" step="0.01" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="flex-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Payment Date *</label>
                      <input required type="date" value={paymentForm.payment_date} onChange={e => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Total Course Fee *</label>
                      <input required type="number" min="0" step="0.01" value={paymentForm.total_fee} onChange={e => setPaymentForm({ ...paymentForm, total_fee: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Payment Status *</label>
                      <div className="flex gap-3 mt-1">
                        {(["paid_full", "paid_part"] as const).map(s => (
                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="payment_status" value={s} checked={paymentForm.payment_status === s}
                              onChange={() => setPaymentForm({ ...paymentForm, payment_status: s, remaining_fee: s === "paid_full" ? "" : paymentForm.remaining_fee })} />
                            <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
                              {s === "paid_full" ? "Paid in Full" : "Paid in Part"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  {paymentForm.payment_status === "paid_part" && (
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Remaining Balance *</label>
                      <input required={paymentForm.payment_status === "paid_part"} type="number" min="0" step="0.01" value={paymentForm.remaining_fee}
                        onChange={e => setPaymentForm({ ...paymentForm, remaining_fee: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Notes (optional)</label>
                    <input value={paymentForm.notes} onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      placeholder="e.g. Mock OSCE session fee, Course subscription..."
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={paymentSaving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                      {paymentSaving ? <><Loader size={14} className="animate-spin" /> Saving…</> : paymentDone ? <><CheckCircle size={14} /> Saved & Receipt Sent!</> : <><Plus size={14} /> Record Payment & Send Receipt</>}
                    </button>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>A receipt email will be automatically sent to the student upon saving.</p>
                </form>
              </div>

              {/* ── Batch Records ── */}
              <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(15,76,92,0.08)", backgroundColor: "rgba(11,30,61,0.02)" }}>
                  <div className="flex items-center gap-2">
                    <FileText size={16} style={{ color: "var(--navy)" }} />
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Batch Records</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {batches.length > 0 && (
                      <select
                        value={activeBatchId ?? ""}
                        onChange={e => setActiveBatchId(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }}
                      >
                        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    )}
                    <button
                      onClick={() => setNewBatchModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                    >
                      <Plus size={12} /> New Batch
                    </button>
                  </div>
                </div>

                {batches.length === 0 ? (
                  <div className="p-10 text-center">
                    <FileText size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>No batches yet. Create your first batch to start tracking.</p>
                  </div>
                ) : batchLoading ? (
                  <div className="p-8 text-center"><Loader size={18} className="animate-spin mx-auto" style={{ color: "var(--teal)" }} /></div>
                ) : (() => {
                  const totalPaid = batchStudents.reduce((s, r) => s + Number(r.paid), 0);
                  const totalPending = batchStudents.reduce((s, r) => s + Number(r.pending), 0);
                  const cleared = batchStudents.filter(r => Number(r.pending) === 0 && Number(r.paid) > 0).length;
                  const hasPending = batchStudents.filter(r => Number(r.pending) > 0).length;

                  const saveCell = async (rowId: string, field: string, value: string | number | boolean) => {
                    setBatchSavingRow(rowId);
                    await supabase.from("batch_students").update({ [field]: value }).eq("id", rowId);
                    setBatchStudents(prev => prev.map(r => r.id === rowId ? { ...r, [field]: value } : r));
                    setBatchSavingRow(null);
                  };

                  const commitEdit = async () => {
                    if (!editingCell) return;
                    const { rowId, field } = editingCell;
                    const numFields = ["paid", "pending"];
                    const val = numFields.includes(field) ? parseFloat(cellValue) || 0 : cellValue;
                    await saveCell(rowId, field, val);
                    setEditingCell(null);
                  };

                  const startEdit = (rowId: string, field: string, current: string | number | null) => {
                    setEditingCell({ rowId, field });
                    setCellValue(String(current ?? ""));
                  };

                  return (
                    <div>
                      {/* Summary chips */}
                      <div className="flex flex-wrap gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(15,76,92,0.07)", backgroundColor: "rgba(21,176,151,0.03)" }}>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal)" }}>
                          {batchStudents.length} students
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal)" }}>
                          Total paid: SAR {totalPaid.toLocaleString()}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: totalPending > 0 ? "rgba(201,162,39,0.15)" : "rgba(21,176,151,0.12)", color: totalPending > 0 ? "var(--gold)" : "var(--teal)" }}>
                          Total pending: SAR {totalPending.toLocaleString()}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(21,176,151,0.12)", color: "var(--teal)" }}>
                          {cleared} cleared
                        </span>
                        {hasPending > 0 && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "var(--gold)" }}>
                            {hasPending} with pending
                          </span>
                        )}
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse" style={{ minWidth: 700 }}>
                          <thead>
                            <tr style={{ backgroundColor: "rgba(11,30,61,0.04)", borderBottom: "1px solid rgba(15,76,92,0.1)" }}>
                              {["No", "Name", "Email", "Paid (SAR)", "Pending (SAR)", "Telegram", "Web Access", "Comments", ""].map((h, i) => (
                                <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider"
                                  style={{ color: "rgba(26,26,26,0.5)", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {batchStudents.map((row, idx) => {
                              const saving = batchSavingRow === row.id;
                              const rowBg = Number(row.pending) > 0 ? "rgba(201,162,39,0.04)" : "transparent";
                              return (
                                <tr key={row.id} style={{ borderBottom: "1px solid rgba(15,76,92,0.06)", backgroundColor: rowBg }}
                                  className="hover:bg-opacity-80 transition-colors">
                                  {/* No */}
                                  <td className="px-3 py-2 text-xs font-mono" style={{ color: "rgba(26,26,26,0.4)", width: 40 }}>{idx + 1}</td>

                                  {/* Name */}
                                  <td className="px-3 py-2" style={{ minWidth: 130 }}>
                                    {editingCell?.rowId === row.id && editingCell.field === "student_name" ? (
                                      <input autoFocus value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={e => e.key === "Enter" && commitEdit()}
                                        className="w-full px-2 py-1 rounded border text-sm focus:outline-none"
                                        style={{ borderColor: "var(--teal-bright)" }} />
                                    ) : (
                                      <span className="cursor-pointer font-medium block px-1 py-0.5 rounded hover:bg-teal-50"
                                        style={{ color: "var(--navy)" }}
                                        onClick={() => startEdit(row.id, "student_name", row.student_name)}>
                                        {row.student_name || <span className="opacity-30 italic">Click to edit</span>}
                                        {saving && <Loader size={10} className="inline ml-1 animate-spin" />}
                                      </span>
                                    )}
                                  </td>

                                  {/* Email */}
                                  <td className="px-3 py-2" style={{ minWidth: 160 }}>
                                    {editingCell?.rowId === row.id && editingCell.field === "email" ? (
                                      <input autoFocus type="email" value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={e => e.key === "Enter" && commitEdit()}
                                        className="w-full px-2 py-1 rounded border text-sm focus:outline-none"
                                        style={{ borderColor: "var(--teal-bright)" }} />
                                    ) : (
                                      <span className="cursor-pointer block px-1 py-0.5 rounded hover:bg-teal-50 text-xs"
                                        style={{ color: row.email ? "rgba(26,26,26,0.7)" : "rgba(26,26,26,0.25)" }}
                                        onClick={() => startEdit(row.id, "email", row.email)}>
                                        {row.email || <span className="italic">Add email…</span>}
                                      </span>
                                    )}
                                  </td>

                                  {/* Paid */}
                                  <td className="px-3 py-2" style={{ minWidth: 100 }}>
                                    {editingCell?.rowId === row.id && editingCell.field === "paid" ? (
                                      <input autoFocus type="number" min="0" value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={e => e.key === "Enter" && commitEdit()}
                                        className="w-full px-2 py-1 rounded border text-sm focus:outline-none"
                                        style={{ borderColor: "var(--teal-bright)" }} />
                                    ) : (
                                      <span className="cursor-pointer block px-1 py-0.5 rounded hover:bg-teal-50 font-semibold"
                                        style={{ color: Number(row.paid) > 0 ? "var(--teal)" : "rgba(26,26,26,0.35)" }}
                                        onClick={() => startEdit(row.id, "paid", row.paid)}>
                                        {Number(row.paid) > 0 ? Number(row.paid).toLocaleString() : "—"}
                                      </span>
                                    )}
                                  </td>

                                  {/* Pending */}
                                  <td className="px-3 py-2" style={{ minWidth: 100 }}>
                                    {editingCell?.rowId === row.id && editingCell.field === "pending" ? (
                                      <input autoFocus type="number" min="0" value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={e => e.key === "Enter" && commitEdit()}
                                        className="w-full px-2 py-1 rounded border text-sm focus:outline-none"
                                        style={{ borderColor: "var(--teal-bright)" }} />
                                    ) : (
                                      <span className="cursor-pointer block px-1 py-0.5 rounded hover:bg-yellow-50 font-semibold"
                                        style={{ color: Number(row.pending) > 0 ? "var(--gold)" : "rgba(26,26,26,0.35)" }}
                                        onClick={() => startEdit(row.id, "pending", row.pending)}>
                                        {Number(row.pending) > 0 ? Number(row.pending).toLocaleString() : "—"}
                                      </span>
                                    )}
                                  </td>

                                  {/* Telegram */}
                                  <td className="px-3 py-2 text-center">
                                    <button onClick={() => saveCell(row.id, "telegram", !row.telegram)}
                                      className="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-white text-xs font-bold transition-all hover:opacity-80"
                                      style={{ backgroundColor: row.telegram ? "#16a34a" : "rgba(26,26,26,0.15)" }}>
                                      {row.telegram ? "✓" : "✗"}
                                    </button>
                                  </td>

                                  {/* Web Account */}
                                  <td className="px-3 py-2 text-center">
                                    <button onClick={() => saveCell(row.id, "web_account", !row.web_account)}
                                      className="w-7 h-7 rounded-full flex items-center justify-center mx-auto text-white text-xs font-bold transition-all hover:opacity-80"
                                      style={{ backgroundColor: row.web_account ? "#16a34a" : "rgba(26,26,26,0.15)" }}>
                                      {row.web_account ? "✓" : "✗"}
                                    </button>
                                  </td>

                                  {/* Comments */}
                                  <td className="px-3 py-2" style={{ minWidth: 160 }}>
                                    {editingCell?.rowId === row.id && editingCell.field === "comments" ? (
                                      <input autoFocus value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitEdit}
                                        onKeyDown={e => e.key === "Enter" && commitEdit()}
                                        className="w-full px-2 py-1 rounded border text-sm focus:outline-none"
                                        style={{ borderColor: "var(--teal-bright)" }} />
                                    ) : (
                                      <span className="cursor-pointer block px-1 py-0.5 rounded hover:bg-gray-50 text-xs"
                                        style={{ color: row.comments ? "rgba(26,26,26,0.7)" : "rgba(26,26,26,0.25)" }}
                                        onClick={() => startEdit(row.id, "comments", row.comments)}>
                                        {row.comments || <span className="italic">Add note…</span>}
                                      </span>
                                    )}
                                  </td>

                                  {/* Delete */}
                                  <td className="px-2 py-2">
                                    <button onClick={async () => {
                                      if (!confirm(`Remove ${row.student_name || "this student"}?`)) return;
                                      await supabase.from("batch_students").delete().eq("id", row.id);
                                      setBatchStudents(prev => prev.filter(r => r.id !== row.id));
                                    }} className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50"
                                      style={{ color: "rgba(200,50,50,0.5)" }}>
                                      <Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}

                            {/* Totals row */}
                            <tr style={{ borderTop: "2px solid rgba(15,76,92,0.12)", backgroundColor: "rgba(11,30,61,0.03)" }}>
                              <td className="px-3 py-2.5" colSpan={2}>
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--navy)" }}>Totals</span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="text-sm font-bold" style={{ color: "var(--teal)" }}>SAR {totalPaid.toLocaleString()}</span>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="text-sm font-bold" style={{ color: totalPending > 0 ? "var(--gold)" : "var(--teal)" }}>SAR {totalPending.toLocaleString()}</span>
                              </td>
                              <td colSpan={4} />
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Add row */}
                      <div className="px-5 py-3 border-t" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                        <button onClick={async () => {
                          if (!activeBatchId) return;
                          const maxOrder = batchStudents.length > 0 ? Math.max(...batchStudents.map(r => r.sort_order)) : 0;
                          const { data } = await supabase.from("batch_students").insert([{
                            batch_id: activeBatchId, sort_order: maxOrder + 1,
                            student_name: "", paid: 0, pending: 0, telegram: false, web_account: false,
                          }]).select().single();
                          if (data) {
                            setBatchStudents(prev => [...prev, data as BatchStudent]);
                            setTimeout(() => setEditingCell({ rowId: (data as BatchStudent).id, field: "student_name" }), 50);
                          }
                        }} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:opacity-80"
                          style={{ color: "var(--teal)", backgroundColor: "rgba(21,176,151,0.08)" }}>
                          <Plus size={13} /> Add Student
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* New batch modal */}
              {newBatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setNewBatchModal(false)}>
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-serif font-semibold text-lg" style={{ color: "var(--navy)" }}>New Batch</h3>
                      <button onClick={() => setNewBatchModal(false)} className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100"><X size={16} /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Batch Name *</label>
                        <input autoFocus type="text" value={newBatchName} onChange={e => setNewBatchName(e.target.value)}
                          placeholder="e.g. March 2026"
                          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Notes (optional)</label>
                        <input type="text" value={newBatchNotes} onChange={e => setNewBatchNotes(e.target.value)}
                          placeholder="e.g. Cohort 3 — online intensive"
                          className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6">
                      <button onClick={() => setNewBatchModal(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: "rgba(26,26,26,0.5)" }}>Cancel</button>
                      <button disabled={newBatchSaving || !newBatchName.trim()}
                        onClick={async () => {
                          setNewBatchSaving(true);
                          const { data } = await supabase.from("payment_batches").insert([{
                            name: newBatchName.trim(),
                            notes: newBatchNotes.trim() || null,
                          }]).select().single();
                          if (data) {
                            const b = data as BatchRow;
                            setBatches(prev => [b, ...prev]);
                            setActiveBatchId(b.id);
                            setBatchStudents([]);
                          }
                          setNewBatchName("");
                          setNewBatchNotes("");
                          setNewBatchSaving(false);
                          setNewBatchModal(false);
                        }}
                        className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                        {newBatchSaving ? "Creating…" : "Create Batch"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Reminders */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Bell size={15} style={{ color: "var(--gold)" }} />
                  <div className="flex-1">
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Payment Reminders</h2>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>Send pending-balance reminders to students from your batch records</p>
                  </div>
                  {dueIds.length > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "var(--gold)" }}>
                      {dueIds.length} due
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-5">

                  {/* Interval selector */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--navy)" }}>Reminder Interval</p>
                    <div className="flex gap-2">
                      {([14, 30] as const).map(d => (
                        <button key={d} type="button"
                          onClick={() => { setReminderInterval(d); setDueIds([]); setAdminNotified(false); }}
                          className="px-5 py-2 rounded-lg text-sm font-semibold border transition-all"
                          style={{
                            backgroundColor: reminderInterval === d ? "var(--navy)" : "white",
                            color: reminderInterval === d ? "white" : "rgba(26,26,26,0.6)",
                            borderColor: reminderInterval === d ? "var(--navy)" : "rgba(15,76,92,0.2)",
                          }}>
                          {d} days
                        </button>
                      ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: "rgba(26,26,26,0.45)" }}>
                      Students who have not been reminded in the last {reminderInterval} days are flagged as due.
                    </p>
                  </div>

                  {/* Check & notify */}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={checkingDue}
                      onClick={() => checkDueStudents(reminderInterval, false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)", backgroundColor: "white" }}>
                      {checkingDue ? <><Loader size={13} className="animate-spin" /> Checking…</> : <><Eye size={13} /> Check who is due</>}
                    </button>
                    <button type="button" disabled={checkingDue || adminNotified}
                      onClick={() => checkDueStudents(reminderInterval, true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)", backgroundColor: "white" }}>
                      {adminNotified ? <><CheckCircle size={13} style={{ color: "var(--teal)" }} /> Notified</> : <><Send size={13} /> Notify me by email</>}
                    </button>
                  </div>

                  {/* Students list */}
                  {reminderLoading ? (
                    <div className="py-6 text-center"><Loader size={16} className="animate-spin mx-auto" style={{ color: "var(--teal)" }} /></div>
                  ) : reminderStudents.length === 0 ? (
                    <p className="text-sm py-4 text-center" style={{ color: "rgba(26,26,26,0.4)" }}>No students with pending balances found.</p>
                  ) : (
                    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr style={{ backgroundColor: "rgba(11,30,61,0.04)", borderBottom: "1px solid rgba(15,76,92,0.08)" }}>
                            {["Student", "Email", "Paid", "Pending", "Last Reminded", ""].map((h, i) => (
                              <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(26,26,26,0.45)" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {reminderStudents.map(s => {
                            const isDue = dueIds.includes(s.id);
                            const result = reminderResults[s.id];
                            const isSending = sendingReminder === s.id;
                            const daysSince = s.last_reminded_at
                              ? Math.floor((Date.now() - new Date(s.last_reminded_at).getTime()) / 86400000)
                              : null;
                            return (
                              <tr key={s.id} style={{ borderBottom: "1px solid rgba(15,76,92,0.06)", backgroundColor: isDue ? "rgba(201,162,39,0.04)" : "transparent" }}>
                                <td className="px-3 py-3">
                                  <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>{s.student_name}</p>
                                  {isDue && <span className="text-xs font-semibold" style={{ color: "var(--gold)" }}>● Due now</span>}
                                </td>
                                <td className="px-3 py-3 text-xs" style={{ color: s.email ? "rgba(26,26,26,0.7)" : "rgba(26,26,26,0.3)" }}>
                                  {s.email || <span className="italic">No email — add in Batch Records</span>}
                                </td>
                                <td className="px-3 py-3 text-sm font-semibold" style={{ color: "var(--teal)" }}>SAR {Number(s.paid).toLocaleString()}</td>
                                <td className="px-3 py-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>SAR {Number(s.pending).toLocaleString()}</td>
                                <td className="px-3 py-3 text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
                                  {s.last_reminded_at
                                    ? <>{new Date(s.last_reminded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}<br/><span style={{ color: "rgba(26,26,26,0.35)" }}>{daysSince}d ago</span></>
                                    : <span style={{ color: "rgba(26,26,26,0.35)" }}>Never</span>}
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex flex-col gap-1.5 items-end">
                                    {result && (
                                      <p className="text-xs font-medium" style={{ color: result.type === "ok" ? "var(--teal)" : "#dc2626" }}>{result.text}</p>
                                    )}
                                    <button
                                      disabled={isSending || !s.email}
                                      onClick={async () => {
                                        setSendingReminder(s.id);
                                        try {
                                          const res = await fetch("/api/admin/send-payment-reminder", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ studentId: s.id }),
                                          });
                                          const data = await res.json();
                                          setReminderResults(prev => ({
                                            ...prev,
                                            [s.id]: res.ok ? { type: "ok", text: "Sent ✓" } : { type: "err", text: data.error ?? "Failed" },
                                          }));
                                          if (res.ok) {
                                            setReminderStudents(prev => prev.map(r => r.id === s.id ? { ...r, last_reminded_at: new Date().toISOString() } : r));
                                            setDueIds(prev => prev.filter(id => id !== s.id));
                                          }
                                        } catch {
                                          setReminderResults(prev => ({ ...prev, [s.id]: { type: "err", text: "Network error" } }));
                                        }
                                        setSendingReminder(null);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                                      style={{ backgroundColor: isDue ? "var(--gold)" : "rgba(21,176,151,0.1)", color: isDue ? "var(--navy)" : "var(--teal)" }}>
                                      {isSending ? <><Loader size={11} className="animate-spin" /> Sending…</> : <><Send size={11} /> Send Reminder</>}
                                    </button>
                                    {s.email && (
                                      <button
                                        disabled={isSending}
                                        onClick={async () => {
                                          setSendingReminder(s.id + "_test");
                                          try {
                                            const res = await fetch("/api/admin/send-payment-reminder", {
                                              method: "POST",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ studentId: s.id, testOnly: true }),
                                            });
                                            setReminderResults(prev => ({
                                              ...prev,
                                              [s.id]: res.ok ? { type: "ok", text: "Test sent to your inbox" } : { type: "err", text: "Failed" },
                                            }));
                                          } catch { /* ignore */ }
                                          setSendingReminder(null);
                                        }}
                                        className="text-xs underline"
                                        style={{ color: "rgba(26,26,26,0.4)" }}>
                                        Test
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Payments list */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} style={{ color: "var(--teal)" }} />
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Payment History</h2>
                  </div>
                  <button onClick={fetchPayments} className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Refresh</button>
                </div>
                {payments.length === 0 ? (
                  <p className="text-sm text-center py-10" style={{ color: "rgba(26,26,26,0.4)" }}>No payments recorded yet.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.07)" }}>
                    {payments.map(p => (
                      <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--teal)" }}>
                          {p.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>{p.student_name}</p>
                          <p className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{p.student_email}</p>
                          {p.notes && <p className="text-xs mt-0.5 italic" style={{ color: "rgba(26,26,26,0.4)" }}>{p.notes}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold" style={{ color: "var(--navy)" }}>{p.currency} {Number(p.amount).toLocaleString()}</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.4)" }}>{new Date(p.payment_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{
                            backgroundColor: (p as any).payment_status === "paid_part" ? "rgba(201,162,39,0.12)" : "rgba(21,176,151,0.1)",
                            color: (p as any).payment_status === "paid_part" ? "var(--gold)" : "var(--teal)",
                          }}>
                            {(p as any).payment_status === "paid_part" ? "Paid in Part" : "Paid in Full"}
                          </span>
                        </div>
                        <button onClick={async () => { if (confirm(`Delete payment from ${p.student_name}?`)) { await supabase.from("payments").delete().eq("id", p.id); fetchPayments(); } }}
                          className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-red-50 flex-shrink-0"
                          style={{ borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {activeNav === "Courses" && (
            <div className="space-y-6 max-w-2xl">
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <BookOpen size={15} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Complete MRCPI OBGYN OSCE Preparation</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await saveSettings({
                    course_title: settings.course_title ?? "",
                    course_subtitle: settings.course_subtitle ?? "",
                    course_price: settings.course_price ?? "",
                    course_duration: settings.course_duration ?? "",
                    course_format: settings.course_format ?? "",
                    course_description: settings.course_description ?? "",
                    course_outcomes: settings.course_outcomes ?? "",
                    course_enrolment_open: settings.course_enrolment_open ?? "true",
                    course_price_visible: settings.course_price_visible ?? "true",
                  });
                }} className="p-5 space-y-4">

                  {/* Enrolment toggle */}
                  <div className="flex items-center justify-between gap-4 rounded-lg p-4" style={{ backgroundColor: "rgba(21,176,151,0.05)", border: "1px solid rgba(21,176,151,0.15)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Enrolment Status</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>
                        {settings.course_enrolment_open === "false" ? "Closed — button shows \"Coming Soon\"" : "Open — Enquire button is active"}
                      </p>
                    </div>
                    <button type="button"
                      onClick={() => setSettings({ ...settings, course_enrolment_open: settings.course_enrolment_open === "false" ? "true" : "false" })}
                      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ backgroundColor: settings.course_enrolment_open !== "false" ? "var(--teal-bright)" : "rgba(26,26,26,0.15)" }}>
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: settings.course_enrolment_open !== "false" ? "26px" : "2px" }} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Course Title *</label>
                    <input required value={settings.course_title ?? ""} onChange={e => setSettings({ ...settings, course_title: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Subtitle</label>
                    <input value={settings.course_subtitle ?? ""} onChange={e => setSettings({ ...settings, course_subtitle: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold" style={{ color: "var(--navy)" }}>Price</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>{settings.course_price_visible === "false" ? "Hidden" : "Visible"}</span>
                          <button type="button"
                            onClick={() => setSettings({ ...settings, course_price_visible: settings.course_price_visible === "false" ? "true" : "false" })}
                            className="relative w-9 h-5 rounded-full transition-colors"
                            style={{ backgroundColor: settings.course_price_visible !== "false" ? "var(--teal-bright)" : "rgba(26,26,26,0.15)" }}>
                            <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                              style={{ left: settings.course_price_visible !== "false" ? "18px" : "2px" }} />
                          </button>
                        </div>
                      </div>
                      <input value={settings.course_price ?? ""} onChange={e => setSettings({ ...settings, course_price: e.target.value })}
                        placeholder="e.g. £499" className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Duration</label>
                      <input value={settings.course_duration ?? ""} onChange={e => setSettings({ ...settings, course_duration: e.target.value })}
                        placeholder="e.g. 8–9 Weeks" className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Format</label>
                    <input value={settings.course_format ?? ""} onChange={e => setSettings({ ...settings, course_format: e.target.value })}
                      placeholder="e.g. Online + Live Sessions" className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Description</label>
                    <textarea rows={4} value={settings.course_description ?? ""} onChange={e => setSettings({ ...settings, course_description: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Learning Outcomes <span className="font-normal" style={{ color: "rgba(26,26,26,0.5)" }}>(one per line)</span>
                    </label>
                    <textarea rows={6} value={settings.course_outcomes ?? ""} onChange={e => setSettings({ ...settings, course_outcomes: e.target.value })}
                      placeholder={"Master all 6 MRCPI OBGYN OSCE domains\nComplete 78 structured practice stations"}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>

                  <button type="submit" disabled={settingsSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    {settingsDone ? <><CheckCircle size={14} /> Saved!</> : settingsSaving ? <><Loader size={14} className="animate-spin" /> Saving…</> : "Save Course"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeNav === "Settings" && (
            <div className="space-y-6 max-w-2xl">

              {/* 1. Platform Info */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Settings size={15} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Platform Info</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await saveSettings({
                    contact_email: settings.contact_email ?? "",
                    whatsapp_number: settings.whatsapp_number ?? "",
                    instagram_url: settings.instagram_url ?? "",
                    twitter_url: settings.twitter_url ?? "",
                    facebook_url: settings.facebook_url ?? "",
                    tiktok_url: settings.tiktok_url ?? "",
                  });
                }} className="p-5 space-y-4">
                  {[
                    { key: "contact_email", label: "Contact Email", placeholder: "info@mrcpi-obgynunlocked.com", type: "email" },
                    { key: "whatsapp_number", label: "WhatsApp Number", placeholder: "+966 5X XXX XXXX", type: "text" },
                    { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
                    { key: "twitter_url", label: "X / Twitter URL", placeholder: "https://x.com/...", type: "url" },
                    { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
                    { key: "tiktok_url", label: "TikTok URL", placeholder: "https://tiktok.com/@...", type: "url" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>{f.label}</label>
                      <input
                        type={f.type}
                        value={settings[f.key] ?? ""}
                        onChange={e => setSettings({ ...settings, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "rgba(15,76,92,0.2)" }}
                      />
                    </div>
                  ))}
                  <button type="submit" disabled={settingsSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    {settingsDone ? <><CheckCircle size={14} /> Saved!</> : settingsSaving ? <><Loader size={14} className="animate-spin" /> Saving…</> : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* 2. Email Notifications */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Bell size={15} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Email Notifications</h2>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { key: "notify_new_registration", label: "New student registration", desc: "Send email to admins when a student registers" },
                    { key: "notify_new_booking", label: "New mock OSCE booking", desc: "Send email to admins when a booking is submitted" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const newVal = settings[item.key] === "true" ? "false" : "true";
                          setSettings({ ...settings, [item.key]: newVal });
                          await saveSettings({ [item.key]: newVal });
                        }}
                        className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                        style={{ backgroundColor: settings[item.key] === "true" ? "var(--teal-bright)" : "rgba(26,26,26,0.15)" }}
                      >
                        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                          style={{ left: settings[item.key] === "true" ? "26px" : "2px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Announcement Banner */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Bell size={15} style={{ color: "var(--gold)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Announcement Banner</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  await saveSettings({ banner_enabled: settings.banner_enabled ?? "false", banner_text: settings.banner_text ?? "" });
                }} className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>Show banner on website</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.5)" }}>Displays a banner at the top of every page for all visitors</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, banner_enabled: settings.banner_enabled === "true" ? "false" : "true" })}
                      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
                      style={{ backgroundColor: settings.banner_enabled === "true" ? "var(--gold)" : "rgba(26,26,26,0.15)" }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                        style={{ left: settings.banner_enabled === "true" ? "26px" : "2px" }} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Banner Message</label>
                    <input
                      value={settings.banner_text ?? ""}
                      onChange={e => setSettings({ ...settings, banner_text: e.target.value })}
                      placeholder="e.g. Registration now open for the July 2026 cohort!"
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "rgba(15,76,92,0.2)" }}
                    />
                  </div>
                  <button type="submit" disabled={settingsSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}>
                    {settingsDone ? <><CheckCircle size={14} /> Saved!</> : settingsSaving ? <><Loader size={14} className="animate-spin" /> Saving…</> : "Save Banner"}
                  </button>
                </form>
              </div>

              {/* 4. Announcement Email */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Send size={15} style={{ color: "var(--teal-bright)" }} />
                  <div className="flex-1">
                    <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Announcement Email</h2>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>Send a custom email to all active enrolled students</p>
                  </div>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!announcementBody.trim()) return;
                  setAnnouncementSending(true);
                  setAnnouncementResult(null);
                  try {
                    const res = await fetch("/api/admin/send-announcement", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subject: announcementSubject, body: announcementBody }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setAnnouncementResult({ type: "ok", text: `Sent to ${data.count} active student${data.count !== 1 ? "s" : ""}.` });
                      setAnnouncementBody("");
                    } else {
                      setAnnouncementResult({ type: "err", text: data.error ?? "Failed to send." });
                    }
                  } catch {
                    setAnnouncementResult({ type: "err", text: "Network error. Please try again." });
                  }
                  setAnnouncementSending(false);
                }} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Subject *</label>
                    <input
                      type="text" required
                      value={announcementSubject}
                      onChange={e => setAnnouncementSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "rgba(15,76,92,0.2)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>
                      Message *
                      <span className="font-normal ml-1" style={{ color: "rgba(26,26,26,0.45)" }}>— write your announcement below</span>
                    </label>
                    <textarea
                      required rows={8}
                      value={announcementBody}
                      onChange={e => setAnnouncementBody(e.target.value)}
                      placeholder={"Dear students,\n\nWe are pleased to announce that new recorded sessions have been added to your dashboard.\n\nBest regards,\nDr. Einas Diab"}
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
                      style={{ borderColor: "rgba(15,76,92,0.2)", fontFamily: "inherit", lineHeight: "1.6" }}
                    />
                  </div>
                  <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(21,176,151,0.07)", color: "rgba(26,26,26,0.6)", border: "1px solid rgba(21,176,151,0.18)" }}>
                    This will be sent to all students with <strong>active</strong> status. The email will be signed by MRCPI OBGYN Unlocked.
                  </div>
                  {announcementResult && (
                    <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: announcementResult.type === "ok" ? "var(--teal)" : "#dc2626" }}>
                      {announcementResult.type === "ok" && <CheckCircle size={14} />}
                      {announcementResult.text}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" disabled={announcementSending || !announcementBody.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                      {announcementSending ? <><Loader size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send to All Students</>}
                    </button>
                    <button type="button"
                      disabled={announcementTesting || !announcementBody.trim()}
                      onClick={async () => {
                        setAnnouncementTesting(true);
                        setAnnouncementResult(null);
                        try {
                          const res = await fetch("/api/admin/send-announcement", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ subject: announcementSubject, body: announcementBody, testOnly: true }),
                          });
                          const data = await res.json();
                          setAnnouncementResult(res.ok
                            ? { type: "ok", text: "Test email sent to your inbox." }
                            : { type: "err", text: data.error ?? "Failed to send test." }
                          );
                        } catch {
                          setAnnouncementResult({ type: "err", text: "Network error." });
                        }
                        setAnnouncementTesting(false);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 border"
                      style={{ borderColor: "rgba(15,76,92,0.25)", color: "var(--navy)", backgroundColor: "white" }}>
                      {announcementTesting ? <><Loader size={14} className="animate-spin" /> Sending…</> : "Send test to myself"}
                    </button>
                    <button type="button"
                      disabled={!announcementBody.trim()}
                      onClick={() => setAnnouncementPreview(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 border"
                      style={{ borderColor: "rgba(15,76,92,0.25)", color: "rgba(26,26,26,0.6)", backgroundColor: "white" }}>
                      <Eye size={14} /> Preview email
                    </button>
                  </div>
                </form>
              </div>

              {/* 7. Change Password */}
              <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                  <Shield size={15} style={{ color: "var(--teal)" }} />
                  <h2 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Change Password</h2>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPassword !== confirmPassword) { setPasswordMsg({ type: "err", text: "Passwords do not match." }); return; }
                  if (newPassword.length < 8) { setPasswordMsg({ type: "err", text: "Password must be at least 8 characters." }); return; }
                  setPasswordSaving(true);
                  const { error } = await supabase.auth.updateUser({ password: newPassword });
                  setPasswordSaving(false);
                  if (error) { setPasswordMsg({ type: "err", text: error.message }); }
                  else { setPasswordMsg({ type: "ok", text: "Password updated successfully." }); setNewPassword(""); setConfirmPassword(""); }
                  setTimeout(() => setPasswordMsg(null), 4000);
                }} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>New Password</label>
                    <input type="password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Confirm New Password</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
                  </div>
                  {passwordMsg && (
                    <p className="text-sm font-medium" style={{ color: passwordMsg.type === "ok" ? "var(--teal)" : "#dc2626" }}>{passwordMsg.text}</p>
                  )}
                  <button type="submit" disabled={passwordSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "var(--navy)", color: "white" }}>
                    {passwordSaving ? <><Loader size={14} className="animate-spin" /> Updating…</> : "Update Password"}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ── SECURITY ── */}
          {activeNav === "Security" && (
            <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                <Shield size={15} style={{ color: "var(--teal)" }} />
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Full Audit Log</p>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>No audit events recorded yet.</div>
                ) : auditLogs.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--teal-bright)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "rgba(26,26,26,0.8)" }}>{l.action}{l.resource ? ` — ${l.resource}` : ""}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.4)" }}>{l.user_email}</p>
                    </div>
                    <p className="text-xs flex-shrink-0" style={{ color: "rgba(26,26,26,0.35)" }}>{new Date(l.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Announcement email preview modal */}
      {announcementPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setAnnouncementPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Email Preview</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>This is exactly what students will see in their inbox</p>
              </div>
              <button onClick={() => setAnnouncementPreview(false)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <X size={16} style={{ color: "var(--navy)" }} />
              </button>
            </div>
            {/* Simulated email client chrome */}
            <div className="flex-shrink-0 px-5 py-3 border-b text-xs space-y-1" style={{ backgroundColor: "#f9fafb", borderColor: "rgba(15,76,92,0.08)" }}>
              <div className="flex gap-2"><span className="font-semibold w-12 text-right flex-shrink-0" style={{ color: "rgba(26,26,26,0.45)" }}>From:</span><span style={{ color: "var(--navy)" }}>MRCPI OBGYN Unlocked &lt;{process.env.NEXT_PUBLIC_SUPABASE_URL ? "admin@mrcpiobgynunlocked.com" : "admin@mrcpiobgynunlocked.com"}&gt;</span></div>
              <div className="flex gap-2"><span className="font-semibold w-12 text-right flex-shrink-0" style={{ color: "rgba(26,26,26,0.45)" }}>To:</span><span style={{ color: "var(--navy)" }}>student@example.com</span></div>
              <div className="flex gap-2"><span className="font-semibold w-12 text-right flex-shrink-0" style={{ color: "rgba(26,26,26,0.45)" }}>Subject:</span><span className="font-medium" style={{ color: "var(--navy)" }}>{announcementSubject || "(no subject)"}</span></div>
            </div>
            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: "#f0ede8" }}>
              {/* Render the email HTML */}
              <div dangerouslySetInnerHTML={{
                __html: (() => {
                  const bodyHtml = announcementBody
                    .split("\n")
                    .map(line => line.trim()
                      ? `<p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 12px 0;">${line}</p>`
                      : "<br/>")
                    .join("");
                  return `
                    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px 16px;">
                      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
                        <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">Announcement</p>
                        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
                      </div>
                      <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
                        <h2 style="color:#0B1E3D;font-size:17px;margin:0 0 20px 0;font-weight:700;">${announcementSubject || "(no subject)"}</h2>
                        ${bodyHtml || '<p style="color:#999;">Write your message above to preview it here.</p>'}
                        <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
                        <p style="color:rgba(26,26,26,0.5);font-size:13px;margin:0;">
                          If you have questions, contact us at
                          <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
                          or via WhatsApp at <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
                        </p>
                      </div>
                      <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
                        © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
                        <a href="https://mrcpiobgynunlocked.com" style="color:rgba(26,26,26,0.35);">mrcpiobgynunlocked.com</a>
                      </p>
                    </div>
                  `;
                })()
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── GENERAL FEEDBACK MODAL ── */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.65)" }} onClick={() => setFeedbackModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Write Feedback</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>{feedbackModal.studentName}</p>
              </div>
              <button onClick={() => setFeedbackModal(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--navy)" }}>Feedback Type</p>
                <div className="flex gap-3">
                  {(["general", "progress"] as const).map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="fb_type" checked={feedbackForm.type === t} onChange={() => setFeedbackForm(f => ({ ...f, type: t }))} />
                      <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>{t === "general" ? "General Comment" : "Progress Note"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Title *</label>
                <input required value={feedbackForm.title} onChange={e => setFeedbackForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={feedbackForm.type === "progress" ? "e.g. Week 2 Progress Update" : "e.g. Strong history-taking skills"}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--navy)" }}>Feedback *</label>
                <textarea required rows={5} value={feedbackForm.content} onChange={e => setFeedbackForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write detailed feedback here…"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setFeedbackModal(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "rgba(15,76,92,0.2)", color: "rgba(26,26,26,0.5)" }}>Cancel</button>
              <button disabled={feedbackSaving || feedbackDone || !feedbackForm.title || !feedbackForm.content}
                onClick={async () => {
                  setFeedbackSaving(true);
                  await supabase.from("student_feedback").insert([{
                    student_id: feedbackModal.studentId,
                    written_by: user.id,
                    feedback_type: feedbackForm.type,
                    title: feedbackForm.title.trim(),
                    content: feedbackForm.content.trim(),
                  }]);
                  setFeedbackSaving(false);
                  setFeedbackDone(true);
                  setTimeout(() => setFeedbackModal(null), 1200);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                {feedbackSaving ? "Saving…" : feedbackDone ? "Saved ✓" : "Save Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SESSION SCORECARD MODAL ── */}
      {sessionFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.65)" }} onClick={() => setSessionFeedbackModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Session Scorecard</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>{sessionFeedbackModal.studentName} · {sessionFeedbackModal.sessionDate}</p>
              </div>
              <button onClick={() => setSessionFeedbackModal(null)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Station Scores (out of 10)</p>
                <div className="space-y-3">
                  {sessionFeedbackForm.stations.map((st, i) => (
                    <div key={i} className="rounded-xl border p-4" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-semibold flex-1" style={{ color: "var(--navy)" }}>{st.name}</p>
                        <div className="flex items-center gap-1.5">
                          <input type="number" min="0" max="10" step="0.5" value={st.score}
                            onChange={e => setSessionFeedbackForm(f => ({ ...f, stations: f.stations.map((s, j) => j === i ? { ...s, score: e.target.value } : s) }))}
                            placeholder="—"
                            className="w-16 px-2 py-1.5 rounded-lg border text-sm text-center font-bold focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }} />
                          <span className="text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>/ 10</span>
                        </div>
                      </div>
                      <input value={st.comments} onChange={e => setSessionFeedbackForm(f => ({ ...f, stations: f.stations.map((s, j) => j === i ? { ...s, comments: e.target.value } : s) }))}
                        placeholder="Comments on this station…"
                        className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.1)" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: "rgba(15,76,92,0.12)", backgroundColor: "rgba(11,30,61,0.02)" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--teal)" }}>Overall Assessment</p>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Overall Score</label>
                  <input type="number" min="0" max="100" value={sessionFeedbackForm.overall_score}
                    onChange={e => setSessionFeedbackForm(f => ({ ...f, overall_score: e.target.value }))}
                    placeholder="—"
                    className="w-20 px-2 py-1.5 rounded-lg border text-sm text-center font-bold focus:outline-none" style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }} />
                  <span className="text-sm" style={{ color: "rgba(26,26,26,0.4)" }}>/ 100</span>
                </div>
                <textarea rows={4} value={sessionFeedbackForm.overall_notes}
                  onChange={e => setSessionFeedbackForm(f => ({ ...f, overall_notes: e.target.value }))}
                  placeholder="Overall session notes, strengths, areas to improve…"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none" style={{ borderColor: "rgba(15,76,92,0.2)" }} />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-4 border-t flex-shrink-0" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
              <button onClick={() => setSessionFeedbackModal(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor: "rgba(15,76,92,0.2)", color: "rgba(26,26,26,0.5)" }}>Cancel</button>
              <button disabled={sessionFeedbackSaving || sessionFeedbackDone}
                onClick={async () => {
                  setSessionFeedbackSaving(true);
                  await supabase.from("session_feedback").insert([{
                    booking_id: sessionFeedbackModal.bookingId || null,
                    student_id: sessionFeedbackModal.studentId || null,
                    student_name: sessionFeedbackModal.studentName,
                    written_by: user.id,
                    session_date: sessionFeedbackModal.sessionDate,
                    overall_score: sessionFeedbackForm.overall_score ? parseInt(sessionFeedbackForm.overall_score) : null,
                    overall_notes: sessionFeedbackForm.overall_notes.trim() || null,
                    station_scores: sessionFeedbackForm.stations
                      .filter(s => s.score !== "")
                      .map(s => ({ name: s.name, score: parseFloat(s.score), max: s.max, comments: s.comments.trim() || null })),
                  }]);
                  setSessionFeedbackSaving(false);
                  setSessionFeedbackDone(true);
                  setTimeout(() => setSessionFeedbackModal(null), 1200);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                {sessionFeedbackSaving ? "Saving…" : sessionFeedbackDone ? "Saved ✓" : "Save Scorecard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
