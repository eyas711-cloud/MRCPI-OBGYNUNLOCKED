import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { Clock, Mail, CheckCircle } from "lucide-react";

export default async function PendingApprovalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, full_name, role")
    .eq("id", user.id)
    .single();

  // Active users don't belong here
  if (profile?.status === "active") {
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  const isRejected = profile?.status === "rejected";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{
            backgroundColor: isRejected
              ? "rgba(200,50,50,0.08)"
              : "rgba(21,176,151,0.1)",
            color: isRejected ? "rgba(180,40,40,0.8)" : "var(--teal-bright)",
          }}
        >
          {isRejected ? <Mail size={36} /> : <Clock size={36} />}
        </div>

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="MRCPI-OBGYN Unlocked"
          className="h-12 w-auto mx-auto mb-6"
        />

        <h1
          className="font-serif font-semibold text-2xl mb-3"
          style={{ color: "var(--navy)" }}
        >
          {isRejected ? "Registration Not Approved" : "Account Pending Approval"}
        </h1>

        {isRejected ? (
          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(26,26,26,0.6)" }}>
            Unfortunately your registration request was not approved at this time.
            Please contact us directly if you believe this is an error or to discuss
            enrolment options.
          </p>
        ) : (
          <>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(26,26,26,0.6)" }}>
              Thank you{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! Your account has been created and is currently
              under review by the platform administrator.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(26,26,26,0.6)" }}>
              You will receive an email notification once your account has been approved.
              This usually takes less than 24 hours.
            </p>

            {/* What to expect */}
            <div
              className="rounded-xl border p-6 mb-8 text-left"
              style={{ borderColor: "rgba(15,76,92,0.15)", backgroundColor: "rgba(21,176,151,0.03)" }}
            >
              <p className="font-semibold text-sm mb-4" style={{ color: "var(--navy)" }}>What happens next</p>
              <div className="space-y-3">
                {[
                  "Administrator reviews your registration",
                  "You receive an email confirmation",
                  "Full access to courses and materials granted",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(21,176,151,0.15)", color: "var(--teal)" }}
                    >
                      <CheckCircle size={12} />
                    </div>
                    <p className="text-sm" style={{ color: "rgba(26,26,26,0.65)" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Contact Us
          </Link>
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg font-semibold text-sm border transition-all"
              style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
