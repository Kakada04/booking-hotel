"use client";

import React, { createContext, useContext } from "react";
import { useNavMode, NavMode } from "@/lib/hooks/use-nav-mode";

interface NavModeContextValue {
  mode: NavMode;
  setMode: (next: NavMode) => void;
  mounted: boolean;
}

const NavModeContext = createContext<NavModeContextValue>({
  mode: "bottombar",
  setMode: () => {},
  mounted: false,
});

export function NavModeProvider({ children }: { children: React.ReactNode }) {
  const { mode, setMode, mounted } = useNavMode();
  return (
    <NavModeContext.Provider value={{ mode, setMode, mounted }}>
      {children}
    </NavModeContext.Provider>
  );
}

export function useNavModeContext() {
  return useContext(NavModeContext);
}
