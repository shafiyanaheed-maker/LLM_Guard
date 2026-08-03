import { useEffect, useState } from "react";
import { FileText, Search, FileSearch } from "lucide-react";
import api from "../services/api";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/logs");
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    (
      (log.username || "") +
      (log.role || "") +
      (log.prompt || "") +
      (log.status || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            <FileText className="text-cyan-400" size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900">
              Security Logs
            </h1>
            <p className="text-slate-400 light:text-slate-500 text-sm mt-1">
              View all prompt analysis activity.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 pl-9 pr-4 py-2.5 text-sm text-white light:text-slate-900 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* Glass table container */}
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-sm light:shadow-sm">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-sm text-slate-400 light:text-slate-500">Loading logs...</div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 light:bg-slate-100 border border-slate-700/50 light:border-slate-200 mb-4">
                <FileSearch className="text-slate-500" size={24} />
              </div>
              <p className="text-white light:text-slate-900 font-semibold text-sm">No logs found</p>
              <p className="text-slate-500 text-xs mt-1">
                {search
                  ? "Try adjusting your search query."
                  : "No security events recorded yet."}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && filteredLogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 light:border-slate-200">
                    <th className="sticky top-0 z-10 bg-slate-950/80 light:bg-slate-50 backdrop-blur-sm text-left px-5 py-4 text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-950/80 light:bg-slate-50 backdrop-blur-sm text-left px-5 py-4 text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-950/80 light:bg-slate-50 backdrop-blur-sm text-left px-5 py-4 text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                      Prompt
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-950/80 light:bg-slate-50 backdrop-blur-sm text-left px-5 py-4 text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="sticky top-0 z-10 bg-slate-950/80 light:bg-slate-50 backdrop-blur-sm text-left px-5 py-4 text-xs font-semibold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr
                      key={index}
                      className={`transition-colors duration-200 ${
                        index % 2 === 0
                          ? "bg-white/[0.02] light:bg-slate-50/60"
                          : "bg-transparent"
                      } hover:bg-white/[0.04] light:hover:bg-slate-100`}
                    >
                      <td className="px-5 py-4 text-sm font-medium text-white light:text-slate-900 whitespace-nowrap">
                        {log.username}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400 light:text-slate-500 whitespace-nowrap">
                        {log.role}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300 light:text-slate-600 max-w-xs truncate">
                        {log.prompt}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            log.status === "Blocked"
                              ? "bg-red-500/10 text-red-400 light:text-red-600 border border-red-400/20"
                              : "bg-green-500/10 text-green-400 light:text-green-600 border border-green-400/20"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-400 light:text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Logs;
