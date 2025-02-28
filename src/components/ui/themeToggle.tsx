import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; 

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) return storedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-4 right-4 z-50 p-3 bg-secondary border border-border text-secondary-foreground rounded-full shadow-lg transition-all hover:scale-105 hover:bg-secondary/80"
    >
      {isDark ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
}
