"use client";

import Link from "next/link";
import { Clock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PendingApprovalPage() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="w-full max-w-md text-center">
        <Link href="/" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="MRCPI-OBGYN Unlocked"
            className="h-16 w-auto mx-auto mb-8"
          />
        </Link>

        <div
          className="rounded-2xl border bg-white p-10 shadow-sm"
          style={{ borderColor: "rgba(15,76,92,0.15)" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(201,162,76,0.12)", color: "#C9A84C" }}
          >
            <Clock size={28} />
          </div>

          <h1
            className="font-serif font-semibold text-2xl mb-3"
            style={{ color: "var(--navy)" }}
          >
            Account Pending Approval
          </h1>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(26,26,26,0.6)" }}>
            Your registration has been received. An administrator will review your account shortly and you will be notified once access is granted.
          </p>

          <div
            className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3 text-left"
            style={{ backgroundColor: "rgba(21,176,151,0.07)", border: "1px solid rgba(21,176,151,0.15)" }}
          >
            <Mail size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--teal)" }} />
            <p className="text-xs leading-relaxed" style={{ color: "var(--teal)" }}>
              For urgent enquiries contact us at{" "}
              <a href="mailto:info@mrcpi-obgynunlocked.com" className="font-semibold underline">
                info@mrcpi-obgynunlocked.com
              </a>
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ borderColor: "rgba(15,76,92,0.2)", color: "rgba(26,26,26,0.5)" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
