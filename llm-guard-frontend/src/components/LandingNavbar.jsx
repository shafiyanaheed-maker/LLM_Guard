import { Link, useLocation } from "react-router-dom";
import { Shield, Sun, ArrowRight } from "lucide-react";

function LandingNavbar() {
  const location = useLocation();

  const links = [
    {
      name: "Features",
      path: "/features",
    },
    {
      name: "How It Works",
      path: "/how-it-works",
    },
    {
      name: "Why LLM Guard",
      path: "/why",
    },
    {
      name: "Preview",
      path: "/preview",
    },
  ];

  return (
    <header className="landing-navbar">

      <Link to="/" className="landing-brand">

        <div className="brand-icon">
          <Shield size={20} />
        </div>

        <div className="brand-text">
          <strong>LLM Guard</strong>
          <span>AI PROMPT FIREWALL</span>
        </div>

      </Link>


      <nav className="landing-nav">

        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={
              location.pathname === link.path
                ? "nav-link active"
                : "nav-link"
            }
          >
            {link.name}
          </Link>
        ))}

      </nav>


      <div className="navbar-actions">

        <button
          type="button"
          className="theme-button"
          aria-label="Toggle theme"
        >
          <Sun size={17} />
        </button>

        <Link to="/login" className="get-started-button">
          Get Started
          <ArrowRight size={16} />
        </Link>

      </div>

    </header>
  );
}

export default LandingNavbar;