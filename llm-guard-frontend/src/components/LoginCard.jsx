import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, ArrowRight, KeyRound, Activity } from "lucide-react";
import api from "../services/api";

function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-b from-cyan-400/40 via-cyan-500/10 to-transparent">
      {/* Glass card */}
      <div className="relative rounded-3xl bg-glass-bg light:bg-white/90 backdrop-blur-xl px-8 py-10 sm:px-10 sm:py-12 shadow-glass light:shadow-[0_25px_60px_rgba(15,23,42,0.12)] overflow-hidden">

        {/* Top inner highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Corner accent glows */}
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none light:bg-cyan-400/20" />
        <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl pointer-events-none light:bg-sky-400/15" />

        {/* Icon */}
        <div className="flex justify-center mb-7">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/30 blur-xl" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-sky-500/10 border border-cyan-400/30 flex items-center justify-center shadow-glow-sm">
              <Shield className="text-cyan-400" size={34} strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white light:text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
            Sign in to your{" "}
            <span className="text-cyan-400 light:text-cyan-600 font-medium">LLM-Guard</span>{" "}
            console
          </p>
        </div>

        {/* Username field */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500 mb-2">
            Username
          </label>
          <div className="relative group">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              size={18}
            />
            <input
              className="w-full rounded-xl bg-slate-950/50 light:bg-slate-100 border border-white/10 light:border-slate-200 pl-11 pr-4 py-3.5 text-white light:text-slate-900 placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/70 light:focus:bg-white light:focus:border-cyan-400/60 focus:shadow-glow-sm"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mb-8">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500 mb-2">
            Password
          </label>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300"
              size={18}
            />
            <input
              className="w-full rounded-xl bg-slate-950/50 light:bg-slate-100 border border-white/10 light:border-slate-200 pl-11 pr-4 py-3.5 text-white light:text-slate-900 placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-slate-950/70 light:focus:bg-white light:focus:border-cyan-400/60 focus:shadow-glow-sm"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold py-3.5 shadow-glow-button transition-all duration-300 hover:shadow-glow hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Activity className="animate-pulse" size={18} />
                Logging in...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Secure Login
                <ArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  size={18}
                />
              </>
            )}
          </span>

          {/* Button shine sweep */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500 light:text-slate-400">
          Protected by{" "}
          <span className="text-cyan-400/80 light:text-cyan-600">LLM-Guard AI Firewall</span>
        </p>

      </div>
    </div>
  );
}

export default LoginCard;
