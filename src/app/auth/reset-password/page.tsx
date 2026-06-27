"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash; exchanging it creates a session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setSessionReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }

    // Log successful reset to audit
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("audit_logs").insert([{
        user_id: user.id,
        user_email: user.email,
        user_role: "student",
        action: "password_reset_complete",
        resource: user.email,
        metadata: { completed_at: new Date().toISOString() },
      }]);
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: "var(--paper)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="MRCPI-OBGYN Unlocked" className="h-16 w-auto mx-auto mb-4" />
          </Link>
          <h1 className="font-serif font-semibold text-2xl" style={{ color: "var(--navy)" }}>
            Set a new password
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(26,26,26,0.55)" }}>
            Choose a strong password for your account
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm" style={{ borderColor: "rgba(15,76,92,0.15)" }}>
          {done ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "var(--teal-bright)" }} />
              <p className="font-serif font-semibold text-lg mb-2" style={{ color: "var(--navy)" }}>Password updated!</p>
              <p className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>Redirecting you to sign in…</p>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-4">
              <AlertCircle size={36} className="mx-auto mb-4" style={{ color: "var(--gold)" }} />
              <p className="font-semibold mb-2" style={{ color: "var(--navy)" }}>Waiting for reset link…</p>
              <p className="text-sm mb-4" style={{ color: "rgba(26,26,26,0.55)" }}>
                Please open this page from the reset link in your email. If you arrived here directly, go back to login and request a new link.
              </p>
              <Link href="/login" className="text-sm font-semibold" style={{ color: "var(--teal)" }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "rgba(200,50,50,0.06)", color: "rgba(160,30,30,0.9)", border: "1px solid rgba(200,50,50,0.15)" }}>
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /> {error}
                </div>
              )}
              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none pr-11"
                    style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "rgba(26,26,26,0.4)" }}>
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "var(--navy)", color: "white" }}
              >
                <Lock size={15} /> {loading ? "Saving…" : "Set New Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
