import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  KeyRound,
  Activity,
} from "lucide-react";
import api from "../services/api";

function LoginCard() {
  const navigate = useNavigate();

  const [activeMode, setActiveMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------
     LOGIN
  ------------------------------------------------- */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/login", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", username.trim());

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login Failed:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------
     SIGN UP
  ------------------------------------------------- */

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupUsername.trim()) {
      alert("Please enter a username.");
      return;
    }

    if (!signupEmail.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!signupPassword) {
      alert("Please enter a password.");
      return;
    }

    if (signupPassword.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /*
       * This endpoint assumes your backend has:
       * POST /signup
       *
       * If your backend uses another endpoint,
       * we can change it later.
       */

      const response = await api.post("/signup", {
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });

      console.log("Signup successful:", response.data);

      alert("Account created successfully! Please sign in.");

      setUsername(signupUsername.trim());
      setPassword("");

      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");

      setActiveMode("login");
    } catch (error) {
      console.error(
        "Signup Failed:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------
     GOOGLE
  ------------------------------------------------- */

  const handleGoogleLogin = () => {
    alert("Google authentication will be connected here.");
  };

  /* -------------------------------------------------
     FORGOT PASSWORD
  ------------------------------------------------- */

  const handleForgotPassword = () => {
    alert("Password recovery will be connected here.");
  };

  /* -------------------------------------------------
     SWITCH LOGIN / SIGNUP
  ------------------------------------------------- */

  const switchMode = (mode) => {
    setActiveMode(mode);
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* -------------------------------------------------
          OUTER GLOW
      ------------------------------------------------- */}

      <div
        className="
          absolute
          -inset-1
          rounded-[30px]
          bg-gradient-to-r
          from-cyan-400/25
          via-sky-500/20
          to-cyan-400/25
          blur-xl
        "
      />

      {/* -------------------------------------------------
          MAIN CARD
      ------------------------------------------------- */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border
          border-slate-200
          bg-white/95
          px-8
          py-9
          shadow-[0_25px_80px_rgba(15,23,42,0.14)]
          backdrop-blur-xl

          dark:border-white/10
          dark:bg-slate-900/95
          dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)]

          sm:px-10
          sm:py-10
        "
      >
        {/* -------------------------------------------------
            DECORATIVE GLOW
        ------------------------------------------------- */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-cyan-400/10
            blur-3xl
            dark:bg-cyan-500/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-64
            w-64
            rounded-full
            bg-sky-400/10
            blur-3xl
            dark:bg-sky-500/10
          "
        />

        {/* Top border glow */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-cyan-400
            to-transparent
          "
        />

        {/* -------------------------------------------------
            SHIELD LOGO
        ------------------------------------------------- */}

        <div className="relative z-10 mb-6 flex justify-center">
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                rounded-2xl
                bg-cyan-400/30
                blur-xl
              "
            />

            <div
              className="
                relative
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-cyan-300/40
                bg-gradient-to-br
                from-cyan-50
                to-sky-100
                shadow-lg

                dark:from-cyan-500/20
                dark:to-sky-500/10
              "
            >
              <Shield
                size={34}
                strokeWidth={1.8}
                className="
                  text-cyan-500
                  dark:text-cyan-400
                "
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------
            HEADING
        ------------------------------------------------- */}

        <div className="relative z-10 mb-7 text-center">
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
              sm:text-3xl
            "
          >
            {activeMode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {activeMode === "login"
              ? "Sign in to your LLM-Guard console"
              : "Join LLM-Guard and secure your AI applications"}
          </p>
        </div>

        {/* -------------------------------------------------
            SIGN IN / SIGN UP SWITCH
        ------------------------------------------------- */}

        <div
          className="
            relative
            z-10
            mb-7
            grid
            grid-cols-2
            rounded-xl
            bg-slate-100
            p-1

            dark:bg-slate-800/80
          "
        >
          {/* Sign In */}

          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200

              ${
                activeMode === "login"
                  ? `
                    bg-white
                    text-slate-900
                    shadow-sm
                    dark:bg-slate-700
                    dark:text-white
                  `
                  : `
                    text-slate-500
                    hover:text-slate-700
                    dark:text-slate-400
                    dark:hover:text-slate-200
                  `
              }
            `}
          >
            <LogIn size={16} />
            Sign In
          </button>

          {/* Sign Up */}

          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200

              ${
                activeMode === "signup"
                  ? `
                    bg-white
                    text-slate-900
                    shadow-sm
                    dark:bg-slate-700
                    dark:text-white
                  `
                  : `
                    text-slate-500
                    hover:text-slate-700
                    dark:text-slate-400
                    dark:hover:text-slate-200
                  `
              }
            `}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        {activeMode === "login" && (
          <form
            onSubmit={handleLogin}
            className="relative z-10"
          >
            {/* Username */}

            <div className="mb-5">
              <label
                htmlFor="username"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Username
              </label>

              <div className="group relative">
                <User
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    group-focus-within:text-cyan-500
                    dark:text-slate-500
                  "
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-4
                    text-slate-900
                    outline-none
                    transition-all

                    placeholder:text-slate-400

                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-cyan-400
                    dark:focus:bg-slate-950
                  "
                />
              </div>
            </div>

            {/* Password */}

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="
                    text-xs
                    font-semibold
                    text-cyan-600
                    transition
                    hover:text-cyan-500
                    dark:text-cyan-400
                  "
                >
                  Forgot password?
                </button>
              </div>

              <div className="group relative">
                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition
                    group-focus-within:text-cyan-500
                    dark:text-slate-500
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-12
                    text-slate-900
                    outline-none
                    transition-all

                    placeholder:text-slate-400

                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-cyan-400
                    dark:focus:bg-slate-950
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    p-1.5
                    text-slate-400
                    transition
                    hover:bg-slate-200
                    hover:text-slate-600
                    dark:hover:bg-white/10
                    dark:hover:text-slate-200
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}

            <div className="mb-6 flex items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    border-slate-300
                    accent-cyan-500
                  "
                />

                <span
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Remember me
                </span>
              </label>
            </div>

            {/* Login button */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                relative
                w-full
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-sky-600
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-cyan-500/20
                transition-all
                duration-300
                hover:brightness-110
                hover:shadow-cyan-500/30
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Activity
                      size={18}
                      className="animate-pulse"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    Sign In
                    <ArrowRight
                      size={18}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </span>

              {/* Shine */}

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />
            </button>

            {/* Divider */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />

              <span
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Google */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                py-3.5
                text-sm
                font-semibold
                text-slate-700
                transition-all
                hover:border-cyan-300
                hover:bg-slate-50

                dark:border-white/10
                dark:bg-white/5
                dark:text-slate-200
                dark:hover:bg-white/10
              "
            >
              {/* Google G */}

              <span
                className="
                  text-base
                  font-bold
                "
              >
                G
              </span>

              Continue with Google
            </button>

            {/* Create account */}

            <div className="mt-6 text-center">
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    switchMode("signup")
                  }
                  className="
                    font-semibold
                    text-cyan-600
                    hover:text-cyan-500
                    dark:text-cyan-400
                  "
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* =================================================
            SIGN UP FORM
        ================================================= */}

        {activeMode === "signup" && (
          <form
            onSubmit={handleSignup}
            className="relative z-10"
          >
            {/* Username */}

            <div className="mb-4">
              <label
                htmlFor="signupUsername"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  id="signupUsername"
                  type="text"
                  value={signupUsername}
                  onChange={(e) =>
                    setSignupUsername(
                      e.target.value
                    )
                  }
                  placeholder="Choose a username"
                  autoComplete="username"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-4
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />
              </div>
            </div>

            {/* Email */}

            <div className="mb-4">
              <label
                htmlFor="signupEmail"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Email address
              </label>

              <div className="relative">
                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  @
                </span>

                <input
                  id="signupEmail"
                  type="email"
                  value={signupEmail}
                  onChange={(e) =>
                    setSignupEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-4
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />
              </div>
            </div>

            {/* Password */}

            <div className="mb-4">
              <label
                htmlFor="signupPassword"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  id="signupPassword"
                  type={
                    showSignupPassword
                      ? "text"
                      : "password"
                  }
                  value={signupPassword}
                  onChange={(e) =>
                    setSignupPassword(
                      e.target.value
                    )
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-12
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowSignupPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-1.5
                    text-slate-400
                    hover:text-slate-600
                    dark:hover:text-slate-200
                  "
                >
                  {showSignupPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Confirm password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3.5
                    pl-11
                    pr-12
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:border-cyan-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-cyan-400/10

                    dark:border-white/10
                    dark:bg-slate-950/60
                    dark:text-white
                    dark:placeholder:text-slate-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-1.5
                    text-slate-400
                    hover:text-slate-600
                    dark:hover:text-slate-200
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Create account button */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                relative
                w-full
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-sky-600
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-cyan-500/20
                transition-all
                duration-300
                hover:brightness-110
                hover:shadow-cyan-500/30
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <span
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <Activity
                      size={18}
                      className="animate-pulse"
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />

                    Create Account

                    <ArrowRight
                      size={18}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </span>

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />
            </button>

            {/* Existing account */}

            <div className="mt-6 text-center">
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    switchMode("login")
                  }
                  className="
                    font-semibold
                    text-cyan-600
                    hover:text-cyan-500
                    dark:text-cyan-400
                  "
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

        {/* -------------------------------------------------
            SECURITY FOOTER
        ------------------------------------------------- */}

        <div
          className="
            relative
            z-10
            mt-7
            flex
            items-center
            justify-center
            gap-2
            border-t
            border-slate-200
            pt-5
            text-xs
            text-slate-400
            dark:border-white/10
          "
        >
          <Shield
            size={14}
            className="text-emerald-500"
          />

          <span>
            Protected by LLM-Guard AI Firewall
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;