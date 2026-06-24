"use client";

import Link from "next/link";
import {
  BookOpen, Video, FileText, Calendar, Award, Clock,
  TrendingUp, Play, CheckCircle, Lock, Bell
} from "lucide-react";

const enrolledCourses = [
  {
    title: "Complete MRCPI OBGYN OSCE Preparation",
    progress: 65,
    totalModules: 24,
    completedModules: 15,
    nextLesson: "Communication Stations — Part 2",
    dueDate: "2 Jul 2025",
  },
];

const recentLessons = [
  { title: "Antenatal History Taking — Mark Scheme Walkthrough", duration: "22 min", completed: true },
  { title: "Intrapartum Emergency Stations — PPH Management", duration: "18 min", completed: true },
  { title: "Gynaecological Examination — Structured Technique", duration: "25 min", completed: false },
  { title: "Communication Stations — Breaking Bad News", duration: "20 min", completed: false },
];

const upcomingMockOsce = {
  date: "Saturday, 5 July 2025",
  time: "10:00 BST",
  examiner: "Dr. Einas Diab",
  stations: 3,
  platform: "Secure Video Call",
};

const performanceData = [
  { domain: "Clinical Knowledge", score: 78 },
  { domain: "Communication Skills", score: 82 },
  { domain: "Examination Technique", score: 71 },
  { domain: "Patient Safety", score: 88 },
  { domain: "Time Management", score: 65 },
  { domain: "Professionalism", score: 90 },
];

const quickLinks = [
  { icon: <Video size={18} />, label: "Video Lessons", href: "#lessons" },
  { icon: <FileText size={18} />, label: "Study Materials", href: "#materials" },
  { icon: <Calendar size={18} />, label: "Book Mock OSCE", href: "/mock-osce" },
  { icon: <Award size={18} />, label: "My Certificates", href: "#certificates" },
];

export default function DashboardPage() {
  const studentName = "Dr. Sarah";

  return (
    <section className="min-h-screen py-8 px-6" style={{ backgroundColor: "var(--paper)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-data text-xs uppercase tracking-widest mb-1" style={{ color: "var(--teal)" }}>Student Dashboard</p>
            <h1 className="font-serif font-semibold text-2xl" style={{ color: "var(--navy)" }}>
              Welcome back, {studentName}
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(26,26,26,0.55)" }}>
              Keep up your preparation momentum — your exam is approaching.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: "rgba(15,76,92,0.2)" }}>
              <Bell size={16} style={{ color: "var(--navy)" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--teal-bright)" }} />
            </button>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "var(--navy)" }}>
              SM
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="flex items-center gap-3 p-4 rounded-xl border bg-white transition-shadow hover:shadow-sm"
              style={{ borderColor: "rgba(15,76,92,0.12)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal-bright)" }}>
                {q.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--navy)" }}>{q.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: courses + lessons */}
          <div className="lg:col-span-2 space-y-6">

            {/* Enrolled course */}
            <div className="rounded-xl border bg-white p-6" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>My Course</p>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>In Progress</span>
              </div>
              {enrolledCourses.map((c, i) => (
                <div key={i}>
                  <h2 className="font-serif font-semibold text-lg mb-3" style={{ color: "var(--navy)" }}>{c.title}</h2>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "rgba(26,26,26,0.55)" }}>{c.completedModules} of {c.totalModules} modules complete</span>
                      <span className="font-semibold" style={{ color: "var(--teal)" }}>{c.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(15,76,92,0.1)" }}>
                      <div className="h-2 rounded-full" style={{ width: `${c.progress}%`, backgroundColor: "var(--teal-bright)" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(26,26,26,0.55)" }}>
                      <Clock size={13} /> Next: {c.nextLesson}
                    </div>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                    <Play size={14} /> Continue Learning
                  </button>
                </div>
              ))}
            </div>

            {/* Recent lessons */}
            <div id="lessons" className="rounded-xl border bg-white p-6" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "var(--teal)" }}>Video Lessons</p>
              <div className="space-y-3">
                {recentLessons.map((l, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                    style={{ borderColor: "rgba(15,76,92,0.1)", opacity: l.completed ? 1 : 1 }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: l.completed ? "rgba(21,176,151,0.1)" : "rgba(11,30,61,0.06)", color: l.completed ? "var(--teal-bright)" : "var(--navy)" }}>
                      {l.completed ? <CheckCircle size={16} /> : <Play size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{l.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.45)" }}>{l.duration}</p>
                    </div>
                    {l.completed ? (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>Done</span>
                    ) : (
                      <button className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Watch</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Study materials */}
            <div id="materials" className="rounded-xl border bg-white p-6" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <p className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "var(--teal)" }}>Study Materials</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "OSCE Blueprint Overview", type: "PDF", unlocked: true },
                  { title: "Communication Framework", type: "PDF", unlocked: true },
                  { title: "Emergency Obstetrics Reference", type: "PDF", unlocked: true },
                  { title: "OSCE Flashcard Pack — 100 Cards", type: "Flashcards", unlocked: true },
                  { title: "Gynaecology Examination Checklist", type: "PDF", unlocked: false },
                  { title: "Station Practice Scripts", type: "PDF", unlocked: false },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: m.unlocked ? "rgba(21,176,151,0.1)" : "rgba(11,30,61,0.06)", color: m.unlocked ? "var(--teal-bright)" : "rgba(26,26,26,0.3)" }}>
                      {m.unlocked ? <FileText size={14} /> : <Lock size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: m.unlocked ? "var(--navy)" : "rgba(26,26,26,0.4)" }}>{m.title}</p>
                      <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>{m.type}</p>
                    </div>
                    {m.unlocked && (
                      <button className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--teal)" }}>View</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Mock OSCE upcoming */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="p-5" style={{ backgroundColor: "var(--navy)" }}>
                <p className="font-mono-data text-xs uppercase tracking-widest mb-2" style={{ color: "var(--teal-bright)" }}>Upcoming Mock OSCE</p>
                <p className="font-serif text-white font-semibold">{upcomingMockOsce.date}</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{upcomingMockOsce.time} · {upcomingMockOsce.platform}</p>
              </div>
              <div className="p-5 bg-white">
                <p className="text-xs font-semibold mb-3" style={{ color: "rgba(26,26,26,0.5)" }}>Session Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(26,26,26,0.55)" }}>Examiner</span>
                    <span className="font-medium" style={{ color: "var(--navy)" }}>{upcomingMockOsce.examiner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(26,26,26,0.55)" }}>Stations</span>
                    <span className="font-medium" style={{ color: "var(--navy)" }}>{upcomingMockOsce.stations} stations</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
                  Join Session
                </button>
              </div>
            </div>

            {/* Performance */}
            <div className="rounded-xl border bg-white p-6" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Performance</p>
                <TrendingUp size={15} style={{ color: "var(--teal-bright)" }} />
              </div>
              <div className="space-y-4">
                {performanceData.map((d) => (
                  <div key={d.domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "rgba(26,26,26,0.6)" }}>{d.domain}</span>
                      <span className="font-semibold font-mono-data" style={{ color: d.score >= 80 ? "var(--teal-bright)" : d.score >= 70 ? "var(--gold)" : "rgba(200,50,50,0.8)" }}>
                        {d.score}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(15,76,92,0.1)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.score >= 80 ? "var(--teal-bright)" : d.score >= 70 ? "var(--gold)" : "rgba(200,50,50,0.6)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate */}
            <div id="certificates" className="rounded-xl border p-5" style={{ borderColor: "rgba(201,162,39,0.2)", backgroundColor: "rgba(201,162,39,0.04)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Award size={20} style={{ color: "var(--gold)" }} />
                <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Course Certificate</p>
              </div>
              <p className="text-xs mb-4" style={{ color: "rgba(26,26,26,0.55)" }}>
                Complete all 24 modules to unlock your course completion certificate.
              </p>
              <div className="h-1.5 rounded-full mb-2" style={{ backgroundColor: "rgba(201,162,39,0.15)" }}>
                <div className="h-1.5 rounded-full" style={{ width: "65%", backgroundColor: "var(--gold)" }} />
              </div>
              <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>15 / 24 modules complete</p>
            </div>

            {/* Need help */}
            <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <p className="font-semibold text-sm mb-2" style={{ color: "var(--navy)" }}>Need help?</p>
              <p className="text-xs mb-4" style={{ color: "rgba(26,26,26,0.55)" }}>Contact Dr. Diab or our support team for guidance on your preparation.</p>
              <Link href="/contact" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
