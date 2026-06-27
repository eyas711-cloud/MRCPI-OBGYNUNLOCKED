"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff, AlertCircle, Mail, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/auth/role-redirect";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const email = forgotEmail.trim().toLowerCase();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    // Log to audit_logs so admin is notified in Security section
    await supabase.from("audit_logs").insert([{
      user_id: null,
      user_email: email,
      user_role: "student",
      action: "password_reset_request",
      resource: email,
      metadata: { requested_at: new Date().toISOString() },
    }]);
    setLoading(false);
    if (authError) {
      setError("Could not send reset email. Please check the address and try again.");
      return;
    }
    setSuccess("Password reset email sent. Please check your inbox and follow the link.");
    setForgotMode(false);
    setForgotEmail("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim().toLowerCase(),
      password: loginForm.password,
    });

    setLoading(false);

    if (authError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Hard redirect so the server middleware picks up the new auth cookie
    window.location.href = next === "/login" ? "/auth/role-redirect" : next;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerForm.password !== registerForm.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (registerForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: registerForm.email.trim().toLowerCase(),
      password: registerForm.password,
      options: {
        data: { full_name: registerForm.fullName.trim() },
      },
    });

    if (authError) {
      setLoading(false);
      const msg = authError.message && authError.message !== "{}" ? authError.message : JSON.stringify(authError) !== "{}" ? JSON.stringify(authError) : authError.status ? `Error ${authError.status}` : "Registration failed. Please check your details and try again.";
      setError(msg);
      console.error("SignUp error:", authError);
      return;
    }

    if (data?.user) {
      // Insert profile with pending status (fallback if trigger didn't run)
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: registerForm.email.trim().toLowerCase(),
        full_name: registerForm.fullName.trim(),
        role: "student",
        status: "pending",
      });

      // Log registration for admin notification
      await supabase.from("audit_logs").insert([{
        user_id: data.user.id,
        user_email: registerForm.email.trim().toLowerCase(),
        user_role: "student",
        action: "student_registration",
        resource: registerForm.fullName.trim(),
        metadata: { requested_at: new Date().toISOString() },
      }]);
    }

    // Send email notification to admins (always, regardless of data.user)
    await fetch("/api/notify-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: registerForm.fullName.trim(),
        email: registerForm.email.trim().toLowerCase(),
      }),
    });

    setLoading(false);
    setSuccess(
      "Registration submitted! Your account is pending admin approval. You will be notified once access is granted."
    );
    setRegisterForm({ fullName: "", email: "", password: "", confirm: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="MRCPI-OBGYN Unlocked"
              className="h-16 w-auto mx-auto mb-4"
            />
          </Link>
          <h1
            className="font-serif font-semibold text-2xl"
            style={{ color: "var(--navy)" }}
          >
            {tab === "login" ? "Sign in to your account" : "Create an account"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "rgba(26,26,26,0.55)" }}>
            Students and administrators use the same portal
          </p>
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-xl border overflow-hidden mb-6"
          style={{ borderColor: "rgba(15,76,92,0.2)" }}
        >
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              className="flex-1 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: tab === t ? "var(--navy)" : "white",
                color: tab === t ? "white" : "rgba(26,26,26,0.5)",
              }}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border bg-white p-8 shadow-sm"
          style={{ borderColor: "rgba(15,76,92,0.15)" }}
        >
          {/* Success banner */}
          {success && (
            <div
              className="rounded-lg px-4 py-3 text-sm mb-5"
              style={{
                backgroundColor: "rgba(21,176,151,0.08)",
                color: "var(--teal)",
                border: "1px solid rgba(21,176,151,0.2)",
              }}
            >
              {success}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm mb-5"
              style={{
                backgroundColor: "rgba(200,50,50,0.06)",
                color: "rgba(160,30,30,0.9)",
                border: "1px solid rgba(200,50,50,0.15)",
              }}
            >
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {tab === "login" && forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <p className="text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>
                Enter your registered email address and we will send you a link to reset your password.
              </p>
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--navy)" }}>
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
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
                <Mail size={15} /> {loading ? "Sending…" : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => { setForgotMode(false); setError(null); }}
                className="w-full text-center text-sm"
                style={{ color: "rgba(26,26,26,0.5)" }}
              >
                ← Back to sign in
              </button>
            </form>
          ) : tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold block mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none pr-11"
                    style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: "rgba(26,26,26,0.4)" }}
                  >
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div className="text-right -mt-2">
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setError(null); setForgotEmail(loginForm.email); }}
                  className="text-xs font-semibold"
                  style={{ color: "var(--teal)" }}
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "var(--navy)", color: "white" }}
              >
                <LogIn size={15} />
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none"
                  style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none pr-11"
                    style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--ink)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: "rgba(26,26,26,0.4)" }}
                  >
                    {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="reg-confirm"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  required
                  value={registerForm.confirm}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                  placeholder="Repeat password"
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
                <UserPlus size={15} />
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "rgba(26,26,26,0.3)" }}
        >
          Secure login — your data is protected under GDPR.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
