import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(200,50,50,0.08)", color: "rgba(180,40,40,0.8)" }}
        >
          <ShieldOff size={28} />
        </div>
        <h1
          className="font-serif font-semibold text-2xl mb-3"
          style={{ color: "var(--navy)" }}
        >
          Access Denied
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(26,26,26,0.6)" }}>
          You do not have permission to view this page. If you believe this is
          an error, please contact the platform administrator.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--teal-bright)", color: "var(--navy)" }}
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-semibold text-sm border transition-all"
            style={{ borderColor: "rgba(15,76,92,0.2)", color: "var(--navy)" }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
