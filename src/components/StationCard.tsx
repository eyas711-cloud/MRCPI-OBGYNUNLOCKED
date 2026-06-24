"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StationCardProps {
  number: number | string;
  domain: string;
  title: string;
  description?: string;
  difficulty?: "Foundation" | "Intermediate" | "Advanced";
  stationCount?: number;
  href?: string;
  animate?: boolean;
  className?: string;
  variant?: "hero" | "grid" | "compact";
}

const difficultyColor: Record<string, string> = {
  Foundation: "var(--teal-bright)",
  Intermediate: "var(--gold)",
  Advanced: "#E05C40",
};

export default function StationCard({
  number,
  domain,
  title,
  description,
  difficulty,
  stationCount,
  href,
  animate = false,
  className,
  variant = "grid",
}: StationCardProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setActive(true), 400);
    return () => clearTimeout(t);
  }, [animate]);

  const inner = (
    <div
      className={cn(
        "relative rounded-lg border transition-all duration-300",
        variant === "hero"
          ? "p-8 md:p-10"
          : variant === "compact"
          ? "p-4"
          : "p-6",
        animate && !active
          ? "opacity-0 translate-y-2"
          : "opacity-100 translate-y-0",
        href && "hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      style={{
        backgroundColor: "rgba(11,30,61,0.03)",
        borderColor: active && animate ? "var(--teal-bright)" : "rgba(15,76,92,0.25)",
        boxShadow: active && animate
          ? "0 0 0 1px var(--teal-bright), 0 4px 24px rgba(21,176,151,0.08)"
          : undefined,
        transition: "all 0.5s ease",
      }}
    >
      {/* Station number + domain */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono-data text-xs tracking-widest"
          style={{ color: "var(--teal)" }}
        >
          STATION {number}
        </span>
        {active && animate && (
          <span
            className="font-mono-data text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(21,176,151,0.12)",
              color: "var(--teal-bright)",
            }}
          >
            ● ACTIVE
          </span>
        )}
        {difficulty && !animate && (
          <span
            className="font-mono-data text-xs"
            style={{ color: difficultyColor[difficulty] ?? "var(--ink)" }}
          >
            {difficulty}
          </span>
        )}
      </div>

      {/* Domain tag */}
      <p
        className="font-mono-data text-xs uppercase tracking-widest mb-3"
        style={{ color: "var(--teal-bright)" }}
      >
        {domain}
      </p>

      {/* Title */}
      <h3
        className={cn(
          "font-serif text-navy font-semibold leading-snug",
          variant === "hero" ? "text-2xl md:text-3xl" : variant === "compact" ? "text-base" : "text-lg"
        )}
        style={{ color: "var(--navy)" }}
      >
        {title}
      </h3>

      {description && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(26,26,26,0.65)" }}>
          {description}
        </p>
      )}

      {stationCount !== undefined && (
        <div className="mt-4 pt-4 border-t border-black/8 flex items-center justify-between">
          <span className="font-mono-data text-xs" style={{ color: "var(--teal)" }}>
            {stationCount} stations
          </span>
          {href && (
            <span className="text-xs font-medium" style={{ color: "var(--teal-bright)" }}>
              View all →
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
