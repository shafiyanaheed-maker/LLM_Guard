import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isLight) {
      root.classList.add("light");
      root.classList.remove("dark");

      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");

      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  const toggleTheme = () => {
    setIsLight((previous) => !previous);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      title={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className="
        fixed
        right-5
        top-5
        z-[100]
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        bg-white/80
        text-slate-700
        shadow-lg
        backdrop-blur-md
        transition-all
        duration-200
        hover:scale-105
        hover:bg-white
        dark:border-white/10
        dark:bg-slate-900/80
        dark:text-slate-200
        dark:hover:bg-slate-800
      "
    >
      {isLight ? (
        /*
         * We are CURRENTLY in light mode.
         * Clicking this will switch to dark mode.
         * Therefore show MOON.
         */
        <Moon
          size={20}
          className="text-slate-700 dark:text-slate-200"
        />
      ) : (
        /*
         * We are CURRENTLY in dark mode.
         * Clicking this will switch to light mode.
         * Therefore show SUN.
         */
        <Sun
          size={20}
          className="text-amber-400"
        />
      )}
    </button>
  );
}