import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [stats, setStats] = useState(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Theme-aware chart colors
  const gridStroke = isLight ? "#e2e8f0" : "#1e293b";
  const tickFill = isLight ? "#64748b" : "#94a3b8";
  const axisStroke = isLight ? "#cbd5e1" : "#334155";
  const labelLineStroke = isLight ? "#94a3b8" : "#475569";
  const tooltipStyle = {
    backgroundColor: isLight ? "rgba(255, 255, 255, 0.97)" : "rgba(15, 23, 42, 0.95)",
    border: isLight ? "1px solid rgba(226, 232, 240, 1)" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(8px)",
    color: isLight ? "#0f172a" : "#f8fafc",
    fontSize: "13px",
    boxShadow: isLight ? "0 8px 24px rgba(15,23,42,0.08)" : "none",
  };

  const pieData = stats
    ? [
        { name: "Success", value: stats.success_requests },
        { name: "Blocked", value: stats.blocked_requests },
      ]
    : [];

  const COLORS = ["#22c55e", "#ef4444"];

  const barData = [
    {
      name: "Requests",
      value: stats?.total_requests || 0,
    },
    {
      name: "Blocked",
      value: stats?.blocked_requests || 0,
    },
    {
      name: "Attacks",
      value: stats?.attack_attempts || 0,
    },
    {
      name: "DLP",
      value: stats?.blocked_prompts || 0,
    },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  if (!stats) {
    return (
      <div className="flex-1 min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a1128] light:from-slate-50 light:via-slate-100 light:to-white" />
        <div className="flex items-center justify-center h-screen relative z-10">
          <div className="text-sm text-slate-400 light:text-slate-500">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900 relative">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a1128] light:from-slate-50 light:via-slate-100 light:to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.07),transparent_55%)] light:bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.06),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_50%)] light:bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30 shrink-0">
            <BarChart3 className="text-cyan-400" size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900">
              Analytics
            </h1>
            <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
              Security monitoring and system analytics.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">

          {/* Total Requests */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-cyan-400/30 hover:-translate-y-0.5 light:shadow-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-white light:text-slate-900 tabular-nums">
              {stats.total_requests}
            </h2>
          </div>

          {/* Success Requests */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-5 transition-all duration-200 hover:bg-white/[0.06] light:hover:bg-slate-50 hover:border-green-400/30 hover:-translate-y-0.5 light:shadow-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Success</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400 light:text-green-600 tabular-nums">
              {stats.success_requests}
            </h2>
          </div>

          {/* Blocked Requests */}
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

        {/* Pie Chart Section */}
        <div className="relative overflow-hidden mb-8 rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-sm p-6 light:shadow-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-green-400 to-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white light:text-slate-900 leading-tight">
                Success vs Blocked Requests
              </h2>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
                Distribution of all processed requests
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: labelLineStroke }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-sm p-6 light:shadow-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30">
              <div className="h-4 w-4 rounded bg-gradient-to-br from-cyan-400 to-sky-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white light:text-slate-900 leading-tight">
                Security Overview
              </h2>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
                Aggregated security event counts
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke={tickFill}
                  tick={{ fill: tickFill, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: axisStroke }}
                />
                <YAxis
                  stroke={tickFill}
                  tick={{ fill: tickFill, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: axisStroke }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
