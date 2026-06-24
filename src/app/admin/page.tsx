"use client";

import { useState } from "react";
import {
  Users, BookOpen, Video, FileText, Calendar, BarChart3,
  Upload, Plus, Edit, Trash2, Settings, Shield, Bell,
  TrendingUp, DollarSign, Eye
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "247", change: "+12 this month", icon: <Users size={18} />, color: "var(--teal)" },
  { label: "Active Courses", value: "3", change: "All active", icon: <BookOpen size={18} />, color: "var(--navy)" },
  { label: "Mock Sessions Booked", value: "38", change: "+8 this week", icon: <Calendar size={18} />, color: "var(--gold)" },
  { label: "Revenue (MTD)", value: "£18,450", change: "+22% vs last month", icon: <DollarSign size={18} />, color: "var(--teal-bright)" },
];

const recentEnrollments = [
  { name: "Dr. Fatima Al-Hassan", email: "fatima@example.com", course: "Complete OSCE Prep", date: "24 Jun 2025", status: "Active" },
  { name: "Dr. Omar Khalil", email: "omar@example.com", course: "Mock OSCE Pack", date: "23 Jun 2025", status: "Active" },
  { name: "Dr. Nadia Rashid", email: "nadia@example.com", course: "Foundation Course", date: "22 Jun 2025", status: "Active" },
  { name: "Dr. Amira Youssef", email: "amira@example.com", course: "Complete OSCE Prep", date: "21 Jun 2025", status: "Pending" },
];

const uploadedMaterials = [
  { title: "Antenatal OSCE Stations — Video Pack", type: "Video", size: "2.4 GB", uploaded: "20 Jun 2025", status: "Published" },
  { title: "Communication Framework PDF Guide", type: "PDF", size: "2.1 MB", uploaded: "18 Jun 2025", status: "Published" },
  { title: "Emergency Obstetrics Station Scripts", type: "PDF", size: "3.8 MB", uploaded: "15 Jun 2025", status: "Draft" },
  { title: "Gynaecological Flashcard Pack", type: "Flashcards", size: "8.2 MB", uploaded: "10 Jun 2025", status: "Published" },
];

const navItems = [
  { icon: <BarChart3 size={16} />, label: "Overview", active: true },
  { icon: <Users size={16} />, label: "Students", active: false },
  { icon: <BookOpen size={16} />, label: "Courses", active: false },
  { icon: <Upload size={16} />, label: "Content", active: false },
  { icon: <Calendar size={16} />, label: "Mock OSCEs", active: false },
  { icon: <DollarSign size={16} />, label: "Payments", active: false },
  { icon: <Shield size={16} />, label: "Security", active: false },
  { icon: <Settings size={16} />, label: "Settings", active: false },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("Overview");

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
            <button
              key={n.label}
              onClick={() => setActiveNav(n.label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeNav === n.label ? "rgba(21,176,151,0.15)" : "transparent",
                color: activeNav === n.label ? "var(--teal-bright)" : "rgba(255,255,255,0.6)",
              }}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "var(--teal)" }}>
              ED
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Dr. Einas Diab</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
          <div>
            <h1 className="font-serif font-semibold text-lg" style={{ color: "var(--navy)" }}>Dashboard Overview</h1>
            <p className="text-xs" style={{ color: "rgba(26,26,26,0.45)" }}>Tuesday, 24 June 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: "rgba(15,76,92,0.2)" }}>
              <Bell size={16} style={{ color: "var(--navy)" }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--teal-bright)" }} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}>
              <Plus size={14} /> Add Content
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `rgba(0,0,0,0.04)`, color: s.color }}>
                    {s.icon}
                  </div>
                  <TrendingUp size={14} style={{ color: "rgba(26,26,26,0.3)" }} />
                </div>
                <p className="font-serif font-bold text-3xl mb-0.5" style={{ color: "var(--navy)" }}>{s.value}</p>
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
              <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                {recentEnrollments.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "var(--teal)" }}>
                      {e.name.charAt(3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--navy)" }}>{e.name}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(26,26,26,0.45)" }}>{e.course} · {e.date}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: e.status === "Active" ? "rgba(21,176,151,0.1)" : "rgba(201,162,39,0.1)", color: e.status === "Active" ? "var(--teal)" : "var(--gold)" }}>
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Management */}
            <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Uploaded Materials</p>
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(21,176,151,0.1)", color: "var(--teal)" }}>
                  <Upload size={12} /> Upload
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
                {uploadedMaterials.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(11,30,61,0.06)", color: "var(--navy)" }}>
                      {m.type === "Video" ? <Video size={14} /> : <FileText size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--navy)" }}>{m.title}</p>
                      <p className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>{m.type} · {m.size} · {m.uploaded}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: m.status === "Published" ? "rgba(21,176,151,0.08)" : "rgba(201,162,39,0.08)", color: m.status === "Published" ? "var(--teal)" : "var(--gold)" }}>
                      {m.status}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ color: "rgba(26,26,26,0.45)" }}>
                        <Eye size={13} />
                      </button>
                      <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ color: "rgba(26,26,26,0.45)" }}>
                        <Edit size={13} />
                      </button>
                      <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 transition-colors" style={{ color: "rgba(200,50,50,0.5)" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security log */}
          <div className="rounded-xl border bg-white" style={{ borderColor: "rgba(15,76,92,0.12)" }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(15,76,92,0.08)" }}>
              <div className="flex items-center gap-2">
                <Shield size={15} style={{ color: "var(--teal)" }} />
                <p className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--teal)" }}>Security & Audit Log</p>
              </div>
              <button className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Full Log</button>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(15,76,92,0.06)" }}>
              {[
                { event: "Student login", user: "dr.fatima@example.com", time: "5 min ago", type: "info" },
                { event: "Content uploaded", user: "admin", time: "2 hours ago", type: "success" },
                { event: "Suspicious access attempt — multiple failed logins", user: "unknown@example.com", time: "3 hours ago", type: "warning" },
                { event: "Mock OSCE session completed", user: "dr.omar@example.com", time: "5 hours ago", type: "success" },
                { event: "Student account created", user: "dr.amira@example.com", time: "8 hours ago", type: "info" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.type === "warning" ? "var(--gold)" : l.type === "success" ? "var(--teal-bright)" : "rgba(15,76,92,0.4)" }} />
                  <p className="text-xs flex-1" style={{ color: "rgba(26,26,26,0.7)" }}>{l.event}</p>
                  <p className="text-xs font-mono-data" style={{ color: "rgba(26,26,26,0.4)" }}>{l.user}</p>
                  <p className="text-xs flex-shrink-0" style={{ color: "rgba(26,26,26,0.35)" }}>{l.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
