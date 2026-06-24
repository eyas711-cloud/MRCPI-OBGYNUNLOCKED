"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialSeconds?: number;
  active?: boolean;
}

export default function CountdownTimer({
  initialSeconds = 487,
  active = false,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setRunning(true), 1200);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = seconds / initialSeconds;

  const urgent = seconds < 60;
  const warning = seconds < 120;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
          <circle cx="16" cy="16" r="13" fill="none" strokeWidth="2.5" stroke="rgba(255,255,255,0.1)" />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct)}`}
            style={{
              stroke: urgent
                ? "#E05C40"
                : warning
                ? "var(--gold)"
                : "var(--teal-bright)",
              transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
            }}
          />
        </svg>
      </div>
      <div>
        <p
          className="font-mono-data leading-none"
          style={{
            fontSize: "1.5rem",
            color: urgent ? "#E05C40" : warning ? "var(--gold)" : "var(--teal-bright)",
            transition: "color 0.5s ease",
          }}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </p>
        <p className="font-mono-data text-xs text-white/40 mt-0.5">remaining</p>
      </div>
    </div>
  );
}
