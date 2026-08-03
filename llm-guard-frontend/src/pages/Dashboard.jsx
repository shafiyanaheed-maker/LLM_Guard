import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import PromptTester from "../components/PromptTester";
import RecentActivity from "../components/RecentActivity";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative min-h-screen">

          {/* Subtle gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a1128] light:from-slate-50 light:via-slate-100 light:to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.07),transparent_55%)] light:bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.06),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_50%)] light:bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_50%)]" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* Header */}
            <Header />

            {/* Statistics */}
            <StatsCards />

            {/* Prompt Firewall */}
            <PromptTester />

            {/* Recent Activity */}
            <RecentActivity />

          </div>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;