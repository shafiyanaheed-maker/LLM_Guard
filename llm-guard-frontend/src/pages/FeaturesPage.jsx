import { Link } from "react-router-dom";
import {
  Shield,
  ScanSearch,
  Lock,
  Database,
  CheckCircle,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: ScanSearch,
    title: "Prompt Injection Detection",
    text: "Detects instruction overrides, malicious prompt manipulation, system prompt extraction, and adversarial instructions before they reach your LLM.",
  },
  {
    number: "02",
    icon: Lock,
    title: "Jailbreak Detection",
    text: "Identifies attempts to bypass model safety controls using role-play, developer-mode tricks, policy overrides, and other jailbreak patterns.",
  },
  {
    number: "03",
    icon: Database,
    title: "Sensitive Data Protection",
    text: "Screens prompts for API keys, credentials, personal information, secrets, and other sensitive information.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Prompt Validation",
    text: "Validates incoming requests against security policies and determines whether they should be allowed, flagged, sanitized, or blocked.",
  },
  {
    number: "05",
    icon: Zap,
    title: "Real-Time Analysis",
    text: "Analyzes incoming requests immediately so malicious prompts can be stopped before reaching the underlying AI model.",
  },
  {
    number: "06",
    icon: BarChart3,
    title: "Security Analytics",
    text: "Provides visibility into blocked prompts, threat categories, risk scores, request activity, and overall security posture.",
  },
];

function FeaturesPage() {
  return (
    <div className="site-page">
      <header className="site-navbar">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <Shield size={20} />
          </div>

          <div>
            <div className="brand-name">LLM Guard</div>
            <div className="brand-subtitle">AI PROMPT FIREWALL</div>
          </div>
        </Link>

        <nav className="main-nav">
          <Link className="nav-active" to="/features">
            Features
          </Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/why">Why LLM Guard</Link>
          <Link to="/preview">Preview</Link>
        </nav>

        <Link to="/login" className="nav-button">
          Get Started
          <ArrowRight size={16} />
        </Link>
      </header>

      <main className="inner-page">
        <div className="page-intro">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            SECURITY CAPABILITIES
          </div>

          <h1>
            Security that watches
            <span> every prompt.</span>
          </h1>

          <p>
            LLM Guard creates a dedicated security layer between your
            application and your AI model, inspecting requests before they
            become a threat.
          </p>
        </div>

        <section className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.number}>
                <div className="feature-number">{feature.number}</div>

                <div className="feature-icon">
                  <Icon size={21} />
                </div>

                <h2>{feature.title}</h2>

                <p>{feature.text}</p>
              </article>
            );
          })}
        </section>

        <div className="page-bottom-action">
          <Link to="/how-it-works" className="primary-button">
            See How It Works
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <span>© 2026 LLM Guard — AI Prompt Firewall.</span>
      </footer>
    </div>
  );
}

export default FeaturesPage;