import LoginCard from "../components/LoginCard";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
        dark:bg-slate-950
      "
    >
      {/* =====================================================
          THEME TOGGLE
          ===================================================== */}

      <ThemeToggle />

      {/* =====================================================
          MAIN BACKGROUND
          ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-slate-50
          via-cyan-50
          to-white
          dark:from-slate-950
          dark:via-[#071425]
          dark:to-slate-900
        "
      />

      {/* =====================================================
          CYAN GLOW
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-400/20
          blur-[130px]
          dark:bg-cyan-500/10
        "
      />

      {/* =====================================================
          SKY GLOW
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-sky-400/20
          blur-[140px]
          dark:bg-sky-500/10
        "
      />

      {/* =====================================================
          CENTER GLOW
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[350px]
          w-[350px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-300/10
          blur-[120px]
          dark:bg-cyan-500/5
        "
      />

      {/* =====================================================
          GRID
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.04]
          dark:opacity-[0.05]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(15, 23, 42, 0.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.5) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <main
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-10
          sm:px-6
        "
      >
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div
        className="
          absolute
          bottom-4
          left-0
          right-0
          z-10
          text-center
          text-xs
          text-slate-400
          dark:text-slate-600
        "
      >
        LLM-Guard © 2026 • AI Security Platform
      </div>
    </div>
  );
}