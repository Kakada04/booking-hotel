 "use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Clear any previous animation
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Start
    setProgress(0);
    setVisible(true);

    // Rapid advance to ~80%, then pause (simulates load)
    let current = 0;
    const step = () => {
      current += Math.random() * 18 + 5;
      if (current > 80) current = 80;
      setProgress(current);
      if (current < 80) {
        timerRef.current = setTimeout(() => {
          rafRef.current = requestAnimationFrame(step);
        }, 120);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    // Complete and fade out after a short delay
    timerRef.current = setTimeout(() => {
      setProgress(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Thin top progress bar */}
      <div
        className="h-[2.5px] bg-gradient-to-r from-primary/80 via-primary to-primary/60 transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 8px 1px hsl(var(--primary) / 0.5)",
        }}
      />

      {/* Small frosted glass pill indicator (top-right) */}
      {visible && (
        <div className="absolute top-3 right-4">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
              bg-background/60 backdrop-blur-xl
              border border-white/65 dark:border-white/15
              shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)]
              dark:shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)]
              animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {/* Spinning ring */}
            <span
              className="size-3 rounded-full border-[1.5px] border-primary/30 border-t-primary animate-spin shrink-0"
              style={{ animationDuration: "0.6s" }}
            />
            <span className="text-[10px] font-bold text-muted-foreground leading-none">
              Loading…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
