import { useState } from "react";
import { Shield } from "lucide-react";
import api from "../services/api";

function PromptTester() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await api.post("/prompt", {
        username: "admin",
        prompt: prompt,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="relative overflow-hidden mt-8 rounded-2xl bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 p-6 sm:p-8 backdrop-blur-sm light:shadow-sm">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/30">
          <Shield className="text-cyan-400" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white light:text-slate-900 leading-tight">
            Prompt Firewall
          </h2>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
            Test prompts against security filters
          </p>
        </div>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full h-40 rounded-xl bg-slate-950/50 light:bg-slate-100 border border-white/10 light:border-slate-200 p-4 text-white light:text-slate-900 placeholder-slate-500 resize-none outline-none transition-all duration-200 focus:border-cyan-400/50 focus:bg-slate-950/70 light:focus:bg-white"
      />

      <button
        onClick={handleAnalyze}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(6,182,212,0.25)] active:scale-[0.98]"
      >
        Analyze Prompt
      </button>

      {result && (
        <div className="mt-8 text-slate-200 light:text-slate-700">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">

            <div className="rounded-xl bg-white/[0.04] light:bg-slate-50 border border-green-400/20 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Status</p>
              <h2 className="mt-1.5 text-2xl font-bold text-green-400 light:text-green-600">
                {result.status}
              </h2>
            </div>

            <div className="rounded-xl bg-white/[0.04] light:bg-slate-50 border border-cyan-400/20 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Risk Score</p>
              <h2 className="mt-1.5 text-2xl font-bold text-cyan-400 light:text-cyan-600 tabular-nums">
                {result.risk_score}
              </h2>
            </div>

            <div className="rounded-xl bg-white/[0.04] light:bg-slate-50 border border-yellow-400/20 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Risk Level</p>
              <h2 className="mt-1.5 text-2xl font-bold text-yellow-400 light:text-yellow-600">
                {result.risk_level}
              </h2>
            </div>

            <div className="rounded-xl bg-white/[0.04] light:bg-slate-50 border border-orange-400/20 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 light:text-slate-500">Injection</p>
              <h2 className="mt-1.5 text-2xl font-bold text-white light:text-slate-900">
                {result.prompt_injection_detected ? "🚨 Yes" : "✅ No"}
              </h2>
            </div>

          </div>

          <div className="mt-4 rounded-xl bg-white/[0.04] light:bg-slate-50 border border-white/10 light:border-slate-200 p-4 sm:p-5">
            <h3 className="text-cyan-400 light:text-cyan-600 font-semibold mb-2 text-sm uppercase tracking-wider">
              DLP Detection
            </h3>

            <p className="text-white/90 light:text-slate-700">
              {result.dlp_detected?.length > 0
                ? result.dlp_detected.join(", ")
                : "None"}
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-white/[0.04] light:bg-slate-50 border border-white/10 light:border-slate-200 p-4 sm:p-5">
            <h3 className="text-cyan-400 light:text-cyan-600 font-semibold mb-3 text-sm uppercase tracking-wider">
              Gemini Response
            </h3>

            <div className="rounded-lg bg-slate-950/60 light:bg-white border border-white/5 light:border-slate-200 p-4 text-white/90 light:text-slate-700 font-mono text-sm whitespace-pre-wrap">
              {result.llm_response?.response}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default PromptTester;
