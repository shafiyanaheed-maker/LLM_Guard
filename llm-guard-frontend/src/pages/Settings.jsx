import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Lock, Bell, UserCog } from "lucide-react";

function Settings() {
  return (
    <div className="flex min-h-screen bg-slate-950 light:bg-slate-50 text-white light:text-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a1128] light:from-slate-50 light:via-slate-100 light:to-white" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.07),transparent_55%)] light:bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.06),transparent_55%)]" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Header />

            <div className="mt-8">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900">
                  Settings
                </h1>

                <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
                  Manage security, account and firewall configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30">
                      <Shield className="text-cyan-400" size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-white light:text-slate-900">
                        Firewall Configuration
                      </h2>

                      <p className="text-xs text-slate-400 light:text-slate-500">
                        Configure prompt security controls
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <div>
                        <p className="font-medium">Prompt Injection Detection</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Detect malicious instruction manipulation
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-400/20">
                        Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <div>
                        <p className="font-medium">Jailbreak Detection</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Detect attempts to bypass model restrictions
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-400/20">
                        Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <div>
                        <p className="font-medium">DLP Protection</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Protect sensitive information
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-400/20">
                        Enabled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 border border-purple-400/30">
                      <UserCog className="text-purple-400" size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-white light:text-slate-900">
                        Account & Access
                      </h2>

                      <p className="text-xs text-slate-400 light:text-slate-500">
                        Manage authentication and permissions
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <Lock className="text-cyan-400" size={20} />

                      <div>
                        <p className="font-medium">Authentication</p>
                        <p className="text-xs text-slate-400 mt-1">
                          JWT authentication is active
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <UserCog className="text-cyan-400" size={20} />

                      <div>
                        <p className="font-medium">Role Based Access</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Permissions are controlled by user roles
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 light:bg-slate-50 border border-white/5 light:border-slate-200 p-4">
                      <Bell className="text-cyan-400" size={20} />

                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Security event monitoring is active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;