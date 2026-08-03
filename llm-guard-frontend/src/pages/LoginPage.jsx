import LoginCard from "../components/LoginCard";

function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 light:bg-slate-50 flex items-center justify-center px-6">

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a1128] to-slate-900 light:from-slate-50 light:via-slate-100 light:to-white" />

      {/* Aurora glow — top left */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(6,182,212,0.22),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.18),transparent_45%),radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.06),transparent_60%)] light:bg-[radial-gradient(circle_at_15%_10%,rgba(6,182,212,0.16),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.12),transparent_45%)]" />

      {/* Soft ambient blobs */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px] animate-pulse-slow light:bg-cyan-400/20" />
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px] animate-pulse-slower light:bg-sky-400/15" />
      <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-teal-400/5 blur-[100px] light:bg-teal-300/10" />

      {/* Cyber Grid */}
      <div
        className="absolute inset-0 opacity-[0.07] light:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette to focus the card */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,6,23,0.65)_100%)] light:bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(226,232,240,0.6)_100%)]" />

      {/* Login Card */}
      <div className="relative z-10 w-full flex justify-center">
        <LoginCard />
      </div>

    </div>
  );
}

export default LoginPage;
