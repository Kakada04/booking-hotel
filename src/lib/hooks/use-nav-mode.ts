"use client";

import { useCallback, useEffect, useState } from "react";

export type NavMode = "bottombar" | "sidebar";

const STORAGE_KEY = "srokhotel:nav-mode";

export function useNavMode() {
  const [mode, setModeState] = useState<NavMode>("bottombar");
  const [mounted, setMounted] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as NavMode | null;
    if (stored === "bottombar" || stored === "sidebar") {
      setModeState(stored);
    }
    setMounted(true);
  }, []);

  // React to storage events from other tabs or dispatched events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "bottombar" || e.newValue === "sidebar")
      ) {
        setModeState(e.newValue as NavMode);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = useCallback((next: NavMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // Notify layout components on the same page
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: next })
    );
  }, []);

  return { mode, setMode, mounted };
}
