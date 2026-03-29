"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

interface StarWarsContextValue {
  isSwMode: boolean;
  toggleSwMode: () => void;
}

const StarWarsContext = createContext<StarWarsContextValue>({
  isSwMode: false,
  toggleSwMode: () => {},
});

export function StarWarsProvider({ children }: { children: ReactNode }) {
  const [isSwMode, setIsSwMode] = useLocalStorage<boolean>("pp-sw-mode", false);

  useEffect(() => {
    const root = document.documentElement;
    if (isSwMode) {
      root.classList.add("sw-mode");
    } else {
      root.classList.remove("sw-mode");
    }
  }, [isSwMode]);

  const toggleSwMode = () => setIsSwMode((prev) => !prev);

  return (
    <StarWarsContext.Provider value={{ isSwMode, toggleSwMode }}>
      {children}
    </StarWarsContext.Provider>
  );
}

export function useStarWars() {
  return useContext(StarWarsContext);
}
