import { Link } from "react-router-dom";
import {
  Shield,
  MessageSquare,
  ScanSearch,
  Activity,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "User sends a prompt",
    text: "A user interacts with your AI-powered application and submits a normal natural-language request.",
  },
  {
    number: "02",
    icon: Shield,
    title: "LLM Guard intercepts it",
    text: "The request passes through LLM Guard before it reaches the underlying language model.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Security analysis runs",
    text: "Injection detection, jailbreak detection, risk scoring, rate limiting, and DLP controls analyze the request.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Security decision",
    text: "Safe requests continue to the model. Suspicious or malicious requests are blocked and logged.",
  },
];

function HowItWorksPage() {
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
          <Link className="nav-active" to="/how-it-works">
            How It Works
          </Link>
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
            SECURITY FLOW
          </div>

          <h1>
            Your LLM gets a
            <span> security checkpoint.</span>
          </h1>

          <p>
            LLM Guard operates as a protective layer between your application
            and the AI model, making a security decision before the request
            reaches the LLM.
          </p>
        </div>

        <section className="steps-container">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="step-wrapper" key={step.number}>
                <article className="step-card">
                  <div className="step-top">
                    <div className="step-icon">
                      <Icon size={22} />
                    </div>

                    <span className="step-number">{step.number}</span>
                  </div>

                  <h2>{step.title}</h2>

                  <p>{step.text}</p>
                </article>

                {index < steps.length - 1 && (
                  <div className="step-arrow">
                    <ArrowRight size={22} />
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="security-flow">
          <span>APPLICATION</span>
          <ArrowRight size={20} />
          <strong>LLM GUARD</strong>
          <ArrowRight size={20} />
          <span>AI MODEL</span>
        </section>

        <div className="page-bottom-action">
          <Link to="/why" className="primary-button">
            Why LLM Guard?
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

export default HowItWorksPage;