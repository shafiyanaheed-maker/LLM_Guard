import { Link } from "react-router-dom";
import {
  Shield,
  Layers,
  Zap,
  Eye,
  Lock,
  ArrowRight,
} from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Defense in Depth",
    text: "LLM Guard does not depend on a single detection rule. Multiple security layers work together to identify malicious requests.",
  },
  {
    icon: Zap,
    title: "Real-Time Protection",
    text: "Threats are analyzed before they reach the model, allowing dangerous prompts to be stopped at the security boundary.",
  },
  {
    icon: Layers,
    title: "Drop-In Security Layer",
    text: "The firewall sits between your application and your LLM, making it possible to introduce security without redesigning the entire application.",
  },
  {
    icon: Eye,
    title: "Visibility & Auditing",
    text: "Security events can be logged and analyzed so teams can understand attacks, blocked requests, and overall model usage.",
  },
];

function WhyPage() {
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
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link className="nav-active" to="/why">
            Why LLM Guard
          </Link>
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
            WHY LLM GUARD
          </div>

          <h1>
            Your AI needs more than
            <span> a safety prompt.</span>
          </h1>

          <p>
            LLM applications introduce security risks that traditional
            application security controls were never designed to understand.
            LLM Guard is built specifically around those risks.
          </p>
        </div>

        <section className="reason-grid">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article className="reason-card" key={reason.title}>
                <div className="reason-icon">
                  <Icon size={22} />
                </div>

                <h2>{reason.title}</h2>

                <p>{reason.text}</p>
              </article>
            );
          })}
        </section>

        <section className="why-bottom">
          <div>
            <div className="why-bottom-label">SECURITY PRINCIPLE</div>

            <h2>
              Security should happen
              <span> before the model.</span>
            </h2>

            <p>
              Instead of trusting every prompt that reaches your model,
              introduce a dedicated security boundary that can inspect, score,
              block, sanitize, and log requests.
            </p>
          </div>

          <Lock size={48} />
        </section>

        <div className="page-bottom-action">
          <Link to="/preview" className="primary-button">
            View Product Preview
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

export default WhyPage;