import { createContext, useContext, useEffect, useState, useCallback } from "react";

const THEME_KEY = "theme";
const DEFAULT_THEME = "dark";

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);

    if (stored === "dark" || stored === "light") {
      return stored;
    }

    // If an old "system" value exists, remove it
    localStorage.removeItem(THEME_KEY);
  } catch {
    // localStorage unavailable
  }

  return DEFAULT_THEME;
}

function applyThemeClass(theme) {
  const root = document.documentElement;

  root.classList.remove("dark", "light");
  root.classList.add(theme);
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  const setTheme = useCallback((next) => {
    // Only allow light and dark
    if (next !== "light" && next !== "dark") {
      return;
    }

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // localStorage unavailable
    }

    setThemeState(next);
    applyThemeClass(next);
  }, []);

  // Apply theme when the application loads
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme: theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}