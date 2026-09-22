import { useEffect, type ReactNode } from "react";
import { useSystemTheme } from "@/eano/hooks";

export default function BlankLayout({ children }: { children: ReactNode }) {
  const isDark = useSystemTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return <div className="w-full h-dvh">{children}</div>;
}
