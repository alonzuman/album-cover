"use client";
import { createContext, useContext, useState } from "react";

function useSelectInner() {
  const [selecting, setSelecting] = useState(false);

  return {
    selecting,
    toggleSelect() {
      setSelecting((prev) => !prev);
    },
  };
}

type UseSelectInner = ReturnType<typeof useSelectInner>;

const selectContext = createContext<UseSelectInner | null>(null);

export function useSelect() {
  const context = useContext(selectContext);
  if (!context) {
    throw new Error("useSelect must be used within a SelectProvider");
  }
  return context;
}

export function SelectProvider({ children }: { children: React.ReactNode }) {
  const value = useSelectInner();
  return (
    <selectContext.Provider value={value}>{children}</selectContext.Provider>
  );
}
