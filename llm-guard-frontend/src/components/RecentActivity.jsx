import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import api from "../services/api";

function RecentActivity() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await api.get("/dashboard/activity");
      setActivity(response.data.activity);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    }
  };

  return (
    <div className="relative overflow-hidden mt-8 rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-6 sm:p-8 backdrop-blur-sm light:shadow-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30">
          <Activity className="text-cyan-400" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white light:text-slate-900 leading-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
            Latest prompt security events
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {activity.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/[0.04] light:hover:bg-slate-100"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white light:text-slate-900 text-sm">
                {item.username}{" "}
                <span className="text-slate-500 font-normal">
                  ({item.role})
                </span>
              </p>

              <p className="text-slate-400 light:text-slate-500 text-sm truncate max-w-xl mt-0.5">
                {item.prompt}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  item.status === "Blocked"
                    ? "bg-red-500/10 text-red-400 light:text-red-600 border border-red-400/20"
                    : "bg-green-500/10 text-green-400 light:text-green-600 border border-green-400/20"
                }`}
              >
                {item.status}
              </span>

              <p className="text-xs text-slate-500 mt-1">
                {item.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;