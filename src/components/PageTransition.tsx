"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (timerRef.current) clearTimeout(timerRef.current);

    setFading(false);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setFading(true);
      timerRef.current = setTimeout(() => setVisible(false), 400);
    }, 450);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(107,30,46,0.55)",
        backdropFilter: "blur(2px)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}
    >
      <Image
        src="/logo-transparent.png"
        alt=""
        width={320}
        height={320}
        priority
        style={{
          opacity: fading ? 0 : 0.85,
          transform: fading ? "scale(1.08)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
