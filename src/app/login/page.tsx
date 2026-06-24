"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6 py-16" style={{ backgroundColor: "var(--paper)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif font-semibold text-xl" style={{ color: "var(--navy)" }}>
              MRCPI-OBGYN <span style={{ color: "var(--teal-bright)" }}>Unlocked</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "rgba(26,26,26,0.55)" }}>Student Learning Portal</p>
        </div>

        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: "rgba(15,76,92,0.1)" }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm font-semibold capitalize transition-colors"
                style={{
                  color: tab === t ? "var(--teal)" : "rgba(26,26,26,0.45)",
                  borderBottom: tab === t ? "2px solid var(--teal-bright)" : "2px solid transparent",
                  backgroundColor: tab === t ? "rgba(21,176,151,0.03)" : "transparent",
                }}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === "login" ? (
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: "rgba(15,76,92,0.2)" }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold" style={{ color: "var(--navy)" }}>Password</label>
                    <Link href="/forgot-password" className="text-xs" style={{ color: "var(--teal)" }}>Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none pr-11"
                      style={{ borderColor: "rgba(15,76,92,0.2)" }}
                    />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(26,26,26,0.4)" }}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                >
                  <LogIn size={15} /> Sign In
                </button>
                <p className="text-center text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => setTab("register")} className="font-semibold" style={{ color: "var(--teal)" }}>
                    Create one free
                  </button>
                </p>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: "rgba(15,76,92,0.2)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: "rgba(15,76,92,0.2)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Password</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      required
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none pr-11"
                      style={{ borderColor: "rgba(15,76,92,0.2)" }}
                    />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(26,26,26,0.4)" }}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                    style={{ borderColor: "rgba(15,76,92,0.2)" }}
                  />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(26,26,26,0.5)" }}>
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="underline" style={{ color: "var(--teal)" }}>Terms of Use</Link> and{" "}
                  <Link href="/privacy" className="underline" style={{ color: "var(--teal)" }}>Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(26,26,26,0.4)" }}>
          Secure login — your data is protected under GDPR.
        </p>
      </div>
    </section>
  );
}
