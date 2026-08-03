import { NavLink } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  const linkBase =
    "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";
  const linkActive =
    "bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent text-cyan-300 light:text-cyan-700 border border-cyan-400/20 shadow-[inset_0_1px_0_rgba(34,211,238,0.1)]";
  const linkIdle =
    "text-slate-400 light:text-slate-500 border border-transparent hover:bg-white/[0.05] light:hover:bg-slate-100 hover:text-white light:hover:text-slate-900";

  const activeBar = (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-400 to-sky-500" />
  );

  return (
    <div className="relative flex flex-col w-64 min-h-screen bg-slate-950 light:bg-white border-r border-white/10 light:border-slate-200 p-6">
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 light:from-white light:via-slate-50 light:to-white pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* Brand */}
      <div className="relative flex items-center gap-3 mb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/30">
          <Shield className="text-cyan-400" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white light:text-slate-900 leading-tight tracking-tight">
            LLM-Guard
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">AI Prompt Firewall</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative space-y-1.5">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && activeBar}
              <LayoutDashboard size={20} className="shrink-0" />
              Dashboard
            </>
          )}
        </NavLink>

        <button className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 light:text-slate-500 border border-transparent transition-all duration-200 hover:bg-white/[0.05] light:hover:bg-slate-100 hover:text-white light:hover:text-slate-900">
          <Shield size={20} className="shrink-0" />
          Prompt Firewall
        </button>

        <NavLink
          to="/logs"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && activeBar}
              <FileText size={20} className="shrink-0" />
              Logs
            </>
          )}
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && activeBar}
              <BarChart3 size={20} className="shrink-0" />
              Analytics
            </>
          )}
        </NavLink>

        <button className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 light:text-slate-500 border border-transparent transition-all duration-200 hover:bg-white/[0.05] light:hover:bg-slate-100 hover:text-white light:hover:text-slate-900">
          <Settings size={20} className="shrink-0" />
          Settings
        </button>

      </nav>
    </div>
  );
}

export default Sidebar;
