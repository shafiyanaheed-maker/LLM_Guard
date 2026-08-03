import { LogOut, Sun, Moon, Monitor, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const THEME_CYCLE = ["dark", "light", "system"];

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const THEME_LABELS = {
  dark: "Dark mode",
  light: "Light mode",
  system: "System theme",
};

function Header() {
  const username = localStorage.getItem("username") || "Guest";
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/login");
  };

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const ThemeIcon = THEME_ICONS[theme];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="relative overflow-hidden mb-8 rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-4 sm:p-6 backdrop-blur-sm light:shadow-sm">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* Title block */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white light:text-slate-900 leading-tight">
            Welcome back, <span className="text-cyan-400 light:text-cyan-600">{username}</span>
          </h1>
          <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
            AI Prompt Firewall &amp; Security Monitoring
          </p>
          <p className="text-xs text-slate-500 mt-1">{today}</p>
        </div>

        {/* Action cluster */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            aria-label={THEME_LABELS[theme]}
            title={THEME_LABELS[theme]}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-500 transition-all duration-200 hover:bg-white/[0.08] light:hover:bg-slate-200 hover:text-cyan-300 light:hover:text-cyan-600 hover:border-cyan-400/20"
          >
            <ThemeIcon size={18} />
          </button>

          {/* Notification bell (UI only) */}
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-500 transition-all duration-200 hover:bg-white/[0.08] light:hover:bg-slate-200 hover:text-cyan-300 light:hover:text-cyan-600 hover:border-cyan-400/20"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </button>

          {/* User profile pill */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] light:bg-slate-100 border border-white/10 light:border-slate-200 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-400/30 text-sm font-bold text-cyan-300 light:text-cyan-700">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 light:text-slate-500 leading-none">Logged in as</p>
              <p className="font-semibold text-white light:text-slate-900 text-sm mt-0.5">{username}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 light:border-slate-200 bg-white/[0.03] light:bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-300 light:text-slate-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;
