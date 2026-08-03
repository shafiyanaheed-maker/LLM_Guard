import { useEffect, useState } from "react";
import api from "../services/api";

function StatsCards() {
  const [stats, setStats] = useState({
    total_requests: 0,
    success_requests: 0,
    blocked_requests: 0,
    blocked_prompts: 0,
    attack_attempts: 0,
    system_health: "Loading..."
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">

      {/* Requests */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-cyan-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Requests</p>
        <h2 className="mt-2 text-3xl font-bold text-white light:text-slate-900 tabular-nums">
          {stats.total_requests}
        </h2>
      </div>

      {/* Success */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-green-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Success</p>
        <h2 className="mt-2 text-3xl font-bold text-green-400 light:text-green-600 tabular-nums">
          {stats.success_requests}
        </h2>
      </div>

      {/* Blocked */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-red-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Blocked</p>
        <h2 className="mt-2 text-3xl font-bold text-red-400 light:text-red-600 tabular-nums">
          {stats.blocked_requests}
        </h2>
      </div>

      {/* Blocked Prompts */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-yellow-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Blocked Prompts</p>
        <h2 className="mt-2 text-3xl font-bold text-yellow-400 light:text-yellow-600 tabular-nums">
          {stats.blocked_prompts}
        </h2>
      </div>

      {/* Attack Attempts */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-orange-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Attack Attempts</p>
        <h2 className="mt-2 text-3xl font-bold text-orange-400 light:text-orange-600 tabular-nums">
          {stats.attack_attempts}
        </h2>
      </div>

      {/* System Health */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-cyan-400/30 hover:-translate-y-0.5 light:shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">System Health</p>
        <h2 className="mt-2 text-xl font-semibold text-cyan-400 light:text-cyan-600">
          {stats.system_health}
        </h2>
      </div>

    </div>
  );
}

export default StatsCards;