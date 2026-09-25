"use client";

import React from "react";
import { PanelLeft, LayoutGrid, Check } from "lucide-react";
import { useNavModeContext } from "@/context/nav-mode-context";
import type { NavMode } from "@/lib/hooks/use-nav-mode";

const options: {
  value: NavMode;
  label: string;
  description: string;
  icon: React.ElementType;
  preview: React.ReactNode;
}[] = [
  {
    value: "bottombar",
    label: "Floating Bottom Bar",
    description: "A floating pill at the bottom — great for mobile & one-hand use.",
    icon: LayoutGrid,
    preview: (
      // Mini preview of bottom bar layout
      <div className="relative w-full h-16 rounded-xl overflow-hidden bg-black/4 dark:bg-white/4 border border-border">
        {/* content lines */}
        <div className="absolute top-3 left-4 right-4 space-y-1.5">
          <div className="h-1.5 rounded-full bg-muted-foreground/20 w-3/4" />
          <div className="h-1.5 rounded-full bg-muted-foreground/15 w-1/2" />
        </div>
        {/* Floating pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full bg-background/70 border border-white/60 dark:border-white/15 shadow-sm backdrop-blur-sm">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`size-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
      </div>
    ),
  },
  {
    value: "sidebar",
    label: "Sidebar",
    description: "A persistent left-side navigation — best for tablet & desktop.",
    icon: PanelLeft,
    preview: (
      // Mini preview of sidebar layout
      <div className="relative w-full h-16 rounded-xl overflow-hidden bg-black/4 dark:bg-white/4 border border-border flex">
        {/* sidebar */}
        <div className="w-6 h-full bg-muted/60 border-r border-border flex flex-col items-center pt-2 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-3 h-1 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
        {/* content */}
        <div className="flex-1 p-2 space-y-1.5">
          <div className="h-1.5 rounded-full bg-muted-foreground/20 w-3/4" />
          <div className="h-1.5 rounded-full bg-muted-foreground/15 w-1/2" />
        </div>
      </div>
    ),
  },
];

export function NavLayoutToggle() {
  const { mode, setMode, mounted } = useNavModeContext();

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold text-foreground">Navigation Layout</p>
        <p className="text-xs text-muted-foreground font-normal mt-0.5">
          Choose how you navigate the admin panel. Applied instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className={`group text-left flex flex-col gap-3 p-4 rounded-[18px] border transition-all
                ${
                  isActive
                    ? "bg-primary/10 dark:bg-primary/15 border-primary/40 shadow-[0_0_0_2px_hsl(var(--primary)/0.15),inset_0_1px_1px_rgba(255,255,255,0.6)]"
                    : "bg-background/60 dark:bg-white/4 border-white/65 dark:border-white/10 backdrop-blur-xl hover:bg-background/90 hover:border-white/80 hover:shadow-md"
                }`}
            >
              {/* Preview thumbnail */}
              {opt.preview}

              {/* Label row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`size-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-primary/20 border border-primary/35 text-primary"
                        : "bg-black/5 dark:bg-white/8 border border-border text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground leading-tight">
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-normal mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </div>

                {/* Checkmark */}
                <div
                  className={`size-5 rounded-full shrink-0 flex items-center justify-center border transition-all ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  {isActive && <Check className="size-3" strokeWidth={3} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
