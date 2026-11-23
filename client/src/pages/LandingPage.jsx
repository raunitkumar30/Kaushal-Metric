import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

/* =========================================================
   LIGHTWEIGHT ENTERPRISE SVG ICONS
========================================================= */

function IconSearch({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconClose({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconArrowRight({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck({ size = 15, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconUserGraduate({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconBriefcase({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconTrendingUp({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconUsers({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconGovernment({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
    </svg>
  );
}

function IconProvider({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function IconTarget({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconShieldAlert({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconBook({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10M6 10h10" />
    </svg>
  );
}

function IconFlag({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function IconLayers({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconSparkle({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function IconFacebook({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTwitterX({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedIn({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
}

function IconYouTube({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#071e3d" />
    </svg>
  );
}

/* =========================================================
   PAGE DATA (EXACT MATCH TO MOCKUP)
========================================================= */

const navLinks = [
  { id: "home", label: "Home" },
  { id: "schemes", label: "Schemes" },
  { id: "services", label: "Services" },
  { id: "information", label: "Information" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Contact" },
];

const platformCards = [
  {
    icon: <IconGovernment size={24} />,
    colorClass: "card-blue",
    title: "For Government",
    desc: "Policy planning, monitoring and impact assessment",
    linkText: "Learn More",
    target: "contact",
  },
  {
    icon: <IconProvider size={24} />,
    colorClass: "card-green",
    title: "For Training Providers",
    desc: "Manage training programs and track trainee progress",
    linkText: "Learn More",
    target: "contact",
  },
  {
    icon: <IconUserGraduate size={24} />,
    colorClass: "card-orange",
    title: "For Trainees",
    desc: "Access training opportunities and build your career",
    linkText: "Learn More",
    target: "contact",
  },
  {
    icon: <IconBriefcase size={24} />,
    colorClass: "card-purple",
    title: "For Employers",
    desc: "Find skilled talent and verify credentials",
    linkText: "Learn More",
    target: "contact",
  },
];

const aiCards = [
  {
    icon: <IconSparkle size={24} />,
    colorClass: "ai-blue",
    title: "Skill Gap Analysis",
    desc: "Identify current and emerging skill gaps across sectors and regions.",
    linkText: "Learn More",
    target: "contact",
  },
  {
    icon: <IconShieldAlert size={24} />,
    colorClass: "ai-orange",
    title: "Retention Risk Analysis",
    desc: "Predict and prevent dropouts with AI-powered analytics.",
    linkText: "Learn More",
    target: "contact",
  },
  {
    icon: <IconTrendingUp size={24} />,
    colorClass: "ai-green",
    title: "Employment & Wage Insights",
    desc: "Track employment outcomes and wage progression over time.",
    linkText: "Learn More",
    target: "contact",
  },
];

const bannerMiniCards = [
  { icon: <IconBook size={20} />, label: "Training", color: "mini-blue" },
  { icon: <IconTarget size={20} />, label: "Skill Gaps", color: "mini-green" },
  { icon: <IconUserGraduate size={20} />, label: "Employability", color: "mini-cyan" },
  { icon: <IconBriefcase size={20} />, label: "Employment", color: "mini-purple" },
  { icon: <IconFlag size={20} />, label: "Long-Term", color: "mini-blue" },
];

const workflowSteps = [
  { num: 1, title: "Training Onboarding", desc: "Register and join training programs" },
  { num: 2, title: "Training Support", desc: "Access learning resources and assessments" },
  { num: 3, title: "Outcome Capture", desc: "Track employment and wage outcomes" },
  { num: 4, title: "Continuous Updates", desc: "Get real-time data and insights" },
  { num: 5, title: "Employer Verification", desc: "Verify credentials and employment details" },
  { num: 6, title: "Policy & Evaluation", desc: "Analyze impact and improve policies" },
  { num: 7, title: "AI Analytics", desc: "Generate insights for better decisions" },
  { num: 8, title: "Inclusive Support", desc: "Ensure no one is left behind" },
];

const publicationCards = [
  {
    badge: "SUCCESS STORY",
    badgeClass: "badge-blue",
    date: "Sept 15, 2023",
    title: "Training to Career Progression Benchmark",
    desc: "How skilled youth are transforming their futures through targeted training programs.",
    action: "Read Full Story",
  },
  {
    badge: "RESEARCH",
    badgeClass: "badge-green",
    date: "Sept 13, 2023",
    title: "Consent-Driven Privacy Architecture",
    desc: "Building trust through transparent data governance in skilling initiatives.",
    action: "Read Full Paper",
  },
  {
    badge: "ANNOUNCEMENT",
    badgeClass: "badge-orange",
    date: "Sept 10, 2023",
    title: "Measuring Real Economic Mobility in Maharashtra",
    desc: "New framework to track long-term impact of skilling programs.",
    action: "Read More",
  },
];

const searchableItems = [
  { title: "Home", category: "Section", targetId: "home", desc: "Hero, key mission and skill outcomes" },
  { title: "Schemes & Programs", category: "Section", targetId: "schemes", desc: "Explore all skilling schemes in Maharashtra" },
  { title: "Our Mission: Towards a Skilled Maharashtra", category: "Section", targetId: "schemes", desc: "Employability, skill gaps, and data-driven monitoring" },
  { title: "About KaushalMetric Tracker", category: "Section", targetId: "about", desc: "Maharashtra's Unified Longitudinal Skilling Ecosystem" },
  { title: "Platform Services", category: "Section", targetId: "services", desc: "Workspaces for Government, Providers, Trainees & Employers" },
  { title: "Information & AI Insights", category: "Section", targetId: "information", desc: "Skill gap analysis and retention risk algorithms" },
  { title: "How KaushalMetric Tracker Works", category: "Section", targetId: "services", desc: "8-step longitudinal process" },
  { title: "Latest Updates & Publications", category: "Section", targetId: "contact", desc: "Policy briefs and longitudinal research reports" },
  { title: "Government Workspace", category: "Portal", route: "/login", desc: "Policy planning, monitoring and impact assessment" },
  { title: "Training Provider Portal", category: "Portal", route: "/login", desc: "Manage training programs and track trainee progress" },
  { title: "Trainee Portfolio", category: "Portal", route: "/login", desc: "Access training opportunities and verifiable credentials" },
  { title: "Employer Verification Portal", category: "Portal", route: "/login", desc: "Find skilled talent and verify employment credentials" },
  { title: "Skill Gap Analysis Engine", category: "AI Tool", targetId: "information", desc: "Identify current and emerging skill deficits" },
  { title: "Retention Risk Prediction", category: "AI Tool", targetId: "information", desc: "Predict and prevent dropouts with AI analytics" },
  { title: "Employment & Wage Tracer", category: "AI Tool", targetId: "information", desc: "Track longitudinal career progression and salary mobility" },
  { title: "MAHA-DBT Schemes", category: "Scheme", targetId: "schemes", desc: "Direct benefit transfer skilling initiatives" },
  { title: "Contact & Support", category: "Section", targetId: "contact", desc: "Secretariat, Mantralaya, Mumbai contact details" },
];

/* =========================================================
   MAIN LANDING PAGE COMPONENT
========================================================= */

export default function LandingPage() {
  const [activeNav, setActiveNav] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;

  // Keyboard shortcut: Ctrl+K / Cmd+K to open, ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus input automatically on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Smooth scroll handler
  const scrollToSection = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    setActiveNav(id);
    setSearchOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      const navOffset = 70;
      const top = elem.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleSearchResultClick = (item) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (item.route) {
      if (user && user.role) {
        navigate(`/${user.role.toLowerCase()}`);
      } else {
        navigate(item.route);
      }
    } else if (item.targetId) {
      scrollToSection(null, item.targetId);
    }
  };

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableItems.slice(0, 6);
    }
    const q = searchQuery.toLowerCase();
    return searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleLogin = () => {
    if (user && user.role) {
      navigate(`/${user.role.toLowerCase()}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="km-site">
      {/* =====================================================
          1. CLEAN STICKY NAVBAR
      ===================================================== */}
      <header className="km-navbar">
        <div className="km-container km-nav-inner">
          <a href="#home" className="km-brand" onClick={(e) => scrollToSection(e, "home")}>
            <div className="km-brand-logo">
              <span className="dot dot-orange"></span>
              <span className="dot dot-green"></span>
              <span className="dot dot-blue"></span>
            </div>
            <div className="km-brand-text">
              <span className="brand-name">
                <strong>KaushalMetric</strong> Tracker
              </span>
              <span className="brand-sub">कौशल्य विकास, समृद्ध महाराष्ट्र</span>
            </div>
          </a>

          <nav className="km-nav-menu">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`km-nav-link ${activeNav === link.id ? "active" : ""}`}
                onClick={(e) => scrollToSection(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="km-nav-action">
            <button
              className="km-search-btn"
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search platform"
              title="Search KaushalMetric Tracker (Ctrl+K)"
            >
              <IconSearch size={17} />
            </button>
            <button className="km-login-btn" type="button" onClick={handleLogin}>
              {user ? "Workspace" : "Login"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          SEARCH MODAL DIALOG (CTRL+K)
      ===================================================== */}
      {searchOpen && (
        <div className="km-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="km-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="km-search-modal-header">
              <IconSearch size={19} className="km-search-modal-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="km-search-modal-input"
                placeholder="Search schemes, services, information, portals, AI insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="km-search-modal-close"
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <IconClose size={17} />
              </button>
            </div>

            <div className="km-search-modal-body">
              <div className="km-search-section-label">
                {searchQuery.trim() ? "Search Results" : "Suggested Quick Links"}
              </div>

              <div className="km-search-results-list">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="km-search-result-item"
                      onClick={() => handleSearchResultClick(item)}
                    >
                      <div className="km-search-result-icon">
                        {item.category === "Portal" ? (
                          <IconUserGraduate size={16} />
                        ) : item.category === "AI Tool" ? (
                          <IconSparkle size={16} />
                        ) : item.category === "Scheme" ? (
                          <IconLayers size={16} />
                        ) : (
                          <IconArrowRight size={16} />
                        )}
                      </div>
                      <div className="km-search-result-info">
                        <div className="km-search-result-title">{item.title}</div>
                        <div className="km-search-result-desc">{item.desc}</div>
                      </div>
                      <span className="km-search-result-tag">{item.category}</span>
                    </div>
                  ))
                ) : (
                  <div className="km-search-no-results">
                    No results found for "{searchQuery}". Try searching for "Schemes", "AI", "Government", or "Services".
                  </div>
                )}
              </div>
            </div>

            <div className="km-search-modal-footer">
              <span>Press <kbd>ESC</kbd> to close</span>
              <span>•</span>
              <span>Quick Navigation for KaushalMetric Tracker</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          2. HERO SECTION
      ===================================================== */}
      <section id="home" className="km-hero">
        <div className="km-container km-hero-grid">
          <div className="km-hero-copy">
            <h1 className="km-hero-title">
              Measure Skills.
              <br />
              Track Outcomes.
              <br />
              Build a <span className="highlight-saffron">Skilled Maharashtra.</span>
            </h1>

            <p className="km-hero-desc">
              A unified platform for tracking skilling initiatives, employment outcomes and
              socio-economic impact across Maharashtra. Bringing government, training providers,
              employers and citizens together for a stronger, more inclusive future.
            </p>

            <div className="km-hero-cta-row">
              <button
                className="km-btn-primary"
                type="button"
                onClick={(e) => scrollToSection(e, "schemes")}
              >
                Explore All Schemes
              </button>
              <button
                className="km-btn-secondary"
                type="button"
                onClick={(e) => scrollToSection(e, "about")}
              >
                Learn More
              </button>
            </div>

            <div className="km-hero-pills">
              <div className="km-pill">
                <IconUserGraduate size={14} className="pill-icon" />
                <span>Skilled Youth</span>
              </div>
              <div className="km-pill">
                <IconBriefcase size={14} className="pill-icon" />
                <span>Better Opportunities</span>
              </div>
              <div className="km-pill">
                <IconTrendingUp size={14} className="pill-icon" />
                <span>Stronger Economy</span>
              </div>
              <div className="km-pill">
                <IconUsers size={14} className="pill-icon" />
                <span>Inclusive Growth</span>
              </div>
            </div>
          </div>

          <div className="km-hero-visual">
            <div className="km-hero-visual-frame">
              <img
                src="/images/hero.png"
                alt="कौशल्य समृद्ध महाराष्ट्र - Skilled Maharashtra"
                className="km-hero-img"
              />

              {/* Floating Stat Card: Top-Right */}
              <div className="floating-card float-top-right">
                <div className="float-icon-wrap icon-blue">
                  <IconUserGraduate size={16} />
                </div>
                <div className="float-copy">
                  <span className="float-title">Skilled Youth</span>
                  <span className="float-sub">Brighter Future</span>
                </div>
              </div>

              {/* Floating Stat Card: Bottom-Left */}
              <div className="floating-card float-bottom-left">
                <div className="float-icon-wrap icon-orange">
                  <IconLayers size={16} />
                </div>
                <div className="float-copy">
                  <span className="float-title">Skill Development</span>
                  <span className="float-sub">for All</span>
                </div>
              </div>

              {/* Floating Stat Card: Bottom-Right */}
              <div className="floating-card float-bottom-right">
                <div className="float-icon-wrap icon-green">
                  <IconSparkle size={16} />
                </div>
                <div className="float-copy">
                  <span className="float-title">Stronger Maharashtra</span>
                  <span className="float-sub">Together</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          3. OUR MISSION / TOWARDS A SKILLED MAHARASHTRA
      ===================================================== */}
      <section id="schemes" className="km-section km-mission-section">
        <div className="km-container">
          <div className="km-section-header">
            <span className="km-kicker">OUR MISSION</span>
            <h2 className="km-section-title">TOWARDS A SKILLED MAHARASHTRA</h2>
            <p className="km-section-subtitle">
              Empowering individuals, strengthening communities and building a prosperous Maharashtra
              through skill development, innovation and collaboration.
            </p>
          </div>

          <div className="km-mission-grid">
            {/* Left 3 Pillar Cards */}
            <div className="km-mission-pillars">
              <div className="km-pillar-card pillar-border-blue">
                <div className="km-pillar-icon icon-bg-blue">
                  <IconUserGraduate size={20} />
                </div>
                <div className="km-pillar-content">
                  <h3 className="km-pillar-title">Enhance Employability</h3>
                  <p className="km-pillar-desc">
                    Equip youth with industry-relevant skills to improve employment opportunities across sectors.
                  </p>
                  <a
                    href="#contact"
                    className="km-card-link"
                    onClick={(e) => scrollToSection(e, "contact")}
                  >
                    <span>Learn More</span>
                    <IconArrowRight size={13} />
                  </a>
                </div>
              </div>

              <div className="km-pillar-card pillar-border-orange">
                <div className="km-pillar-icon icon-bg-orange">
                  <IconTarget size={20} />
                </div>
                <div className="km-pillar-content">
                  <h3 className="km-pillar-title">Identify Skill Gaps</h3>
                  <p className="km-pillar-desc">
                    Use data-driven insights to identify skill gaps and design targeted interventions.
                  </p>
                  <a
                    href="#contact"
                    className="km-card-link"
                    onClick={(e) => scrollToSection(e, "contact")}
                  >
                    <span>Learn More</span>
                    <IconArrowRight size={13} />
                  </a>
                </div>
              </div>

              <div className="km-pillar-card pillar-border-green">
                <div className="km-pillar-icon icon-bg-green">
                  <IconTrendingUp size={20} />
                </div>
                <div className="km-pillar-content">
                  <h3 className="km-pillar-title">Data-Driven Monitoring</h3>
                  <p className="km-pillar-desc">
                    Track progress and measure outcomes to ensure transparency and impact.
                  </p>
                  <a
                    href="#contact"
                    className="km-card-link"
                    onClick={(e) => scrollToSection(e, "contact")}
                  >
                    <span>Learn More</span>
                    <IconArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Dark Navy Showcase Card */}
            <div className="km-showcase-card">
              <div className="showcase-badge">SKILLED MAHARASHTRA</div>
              <div className="showcase-marathi-heading">
                <span>कौशल्ययुक्त</span>
                <strong>समृद्ध महाराष्ट्र</strong>
              </div>
              <p className="showcase-desc">
                Join the movement towards a skilled and prosperous Maharashtra. Explore schemes, track progress and be a part of the change.
              </p>

              <div className="showcase-stats-grid">
                <div className="showcase-stat-box">
                  <span className="stat-value">16</span>
                  <span className="stat-label">Schemes</span>
                </div>
                <div className="showcase-stat-box">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Transparency</span>
                </div>
                <div className="showcase-stat-box">
                  <span className="stat-value">365d</span>
                  <span className="stat-label">Real-time Updates</span>
                </div>
                <div className="showcase-stat-box">
                  <span className="stat-value">AI</span>
                  <span className="stat-label">Powered Insights</span>
                </div>
              </div>

              <button
                className="showcase-cta-btn"
                type="button"
                onClick={(e) => scrollToSection(e, "services")}
              >
                <span>Explore All Schemes</span>
                <IconArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. ABOUT KAUSHALMETRIC TRACKER
      ===================================================== */}
      <section id="about" className="km-section km-about-section">
        <div className="km-container">
          <div className="km-section-header">
            <span className="km-dark-pill-badge">ABOUT KAUSHALMETRIC TRACKER</span>
          </div>

          <div className="km-about-grid">
            <div className="km-about-copy">
              <h2 className="km-about-title">
                Maharashtra's Unified Longitudinal Skilling Ecosystem
              </h2>
              <p className="km-about-text">
                KaushalMetric Tracker is a comprehensive platform that brings together all skilling
                initiatives in Maharashtra. From training to employment, we enable data-driven
                decisions, better policy-making and improved outcomes for every citizen.
              </p>

              <div className="km-about-checks">
                <div className="km-check-item">
                  <span className="km-check-icon"><IconCheck size={14} /></span>
                  <span>Track skilling initiatives across departments and schemes</span>
                </div>
                <div className="km-check-item">
                  <span className="km-check-icon"><IconCheck size={14} /></span>
                  <span>Monitor employment outcomes and wage progression</span>
                </div>
                <div className="km-check-item">
                  <span className="km-check-icon"><IconCheck size={14} /></span>
                  <span>Identify regional and sectoral skill gaps</span>
                </div>
                <div className="km-check-item">
                  <span className="km-check-icon"><IconCheck size={14} /></span>
                  <span>Enable evidence-based policy making</span>
                </div>
              </div>

              <button
                className="km-btn-navy"
                type="button"
                onClick={(e) => scrollToSection(e, "services")}
              >
                Learn More About Us
              </button>
            </div>

            <div className="km-about-visual">
              <div className="km-fort-frame">
                <img
                  src="/images/about-fort.png"
                  alt="Historical Fort - Skilled Maharashtra"
                  className="km-fort-img"
                />
                <div className="km-fort-badge">
                  <strong>Skilled Maharashtra</strong>
                  <span>Builds Opportunities for a better Tomorrow.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          5. A COMPREHENSIVE PLATFORM (4 STAKEHOLDER CARDS)
      ===================================================== */}
      <section id="services" className="km-section km-platform-section">
        <div className="km-container">
          <div className="km-section-header">
            <h2 className="km-section-title-sm">A COMPREHENSIVE PLATFORM</h2>
            <p className="km-section-subtitle">
              Everything you need to access, track and benefit from skilling initiatives.
            </p>
          </div>

          <div className="km-platform-grid">
            {platformCards.map((card, idx) => (
              <div className="km-stakeholder-card" key={idx}>
                <div className={`stakeholder-icon-wrap ${card.colorClass}`}>
                  {card.icon}
                </div>
                <h3 className="stakeholder-title">{card.title}</h3>
                <p className="stakeholder-desc">{card.desc}</p>
                <a
                  href={`#${card.target}`}
                  className="km-card-link"
                  onClick={(e) => scrollToSection(e, card.target)}
                >
                  <span>{card.linkText}</span>
                  <IconArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          6. AI-POWERED INSIGHTS (3 CARDS)
      ===================================================== */}
      <section id="information" className="km-section km-ai-section">
        <div className="km-container">
          <div className="km-section-header">
            <h2 className="km-section-title-sm">AI-POWERED INSIGHTS</h2>
            <p className="km-section-subtitle">
              Leveraging artificial intelligence for better outcomes.
            </p>
          </div>

          <div className="km-ai-grid">
            {aiCards.map((card, idx) => (
              <div className="km-ai-card" key={idx}>
                <div className={`ai-icon-wrap ${card.colorClass}`}>
                  {card.icon}
                </div>
                <h3 className="ai-card-title">{card.title}</h3>
                <p className="ai-card-desc">{card.desc}</p>
                <a
                  href={`#${card.target}`}
                  className="km-card-link"
                  onClick={(e) => scrollToSection(e, card.target)}
                >
                  <span>{card.linkText}</span>
                  <IconArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          7. PANORAMIC LANDMARK BANNER WITH 5 MINI-CARDS
      ===================================================== */}
      <section className="km-landmark-banner">
        <img
          src="/images/outcomes.png"
          alt="Maharashtra Skilling Landscape Panorama"
          className="km-landmark-bg"
        />
        <div className="km-landmark-overlay"></div>

        <div className="km-container km-landmark-content">
          <div className="km-landmark-heading">
            <h2>Skilled Maharashtra</h2>
            <h3>Builds Opportunities for a Better Tomorrow.</h3>
          </div>

          <div className="km-landmark-pills-row">
            {bannerMiniCards.map((mini, idx) => (
              <div className="km-mini-card" key={idx}>
                <span className={`mini-card-icon ${mini.color}`}>{mini.icon}</span>
                <span className="mini-card-label">{mini.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          8. HOW KAUSHALMETRIC TRACKER WORKS (4x2 GRID)
      ===================================================== */}
      <section className="km-section km-workflow-section">
        <div className="km-container">
          <div className="km-section-header">
            <h2 className="km-section-title-sm">HOW KAUSHALMETRIC TRACKER WORKS</h2>
            <p className="km-section-subtitle">
              A simple, transparent and effective process for all stakeholders
            </p>
          </div>

          <div className="km-workflow-grid">
            {workflowSteps.map((step) => (
              <div className="km-step-card" key={step.num}>
                <div className="km-step-badge">{step.num}</div>
                <div className="km-step-copy">
                  <h4 className="km-step-title">{step.title}</h4>
                  <p className="km-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          9. LATEST UPDATES & PUBLICATIONS
      ===================================================== */}
      <section className="km-section km-updates-section">
        <div className="km-container">
          <div className="km-updates-header">
            <div>
              <h2 className="km-updates-title">LATEST UPDATES & PUBLICATIONS</h2>
              <p className="km-updates-subtitle">
                Insights, success stories and announcements from the Maharashtra skilling ecosystem
              </p>
            </div>
            <button
              className="km-view-all-btn"
              type="button"
              onClick={(e) => scrollToSection(e, "contact")}
            >
              <span>View All Updates</span>
              <IconArrowRight size={14} />
            </button>
          </div>

          <div className="km-publications-grid">
            {publicationCards.map((pub, idx) => (
              <article className="km-pub-card" key={idx}>
                <div className="km-pub-meta">
                  <span className={`km-pub-badge ${pub.badgeClass}`}>{pub.badge}</span>
                  <span className="km-pub-date">{pub.date}</span>
                </div>
                <h3 className="km-pub-title">{pub.title}</h3>
                <p className="km-pub-desc">{pub.desc}</p>
                <a
                  href="#contact"
                  className="km-card-link"
                  onClick={(e) => scrollToSection(e, "contact")}
                >
                  <span>{pub.action}</span>
                  <IconArrowRight size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          10. FOOTER (DARK NAVY)
      ===================================================== */}
      <footer id="contact" className="km-footer">
        <div className="km-container">
          {/* Footer Top Row */}
          <div className="km-footer-top">
            <div className="km-footer-brand-area">
              <div className="km-footer-logo">
                <span className="dot dot-orange"></span>
                <span className="dot dot-green"></span>
                <span className="dot dot-blue"></span>
                <span className="km-footer-brand-name">
                  <strong>KaushalMetric</strong> Tracker
                </span>
              </div>
              <p className="km-footer-brand-desc">
                Building a skilled, prosperous and inclusive Maharashtra through data-driven insights and collaborative action.
              </p>
              <button
                className="km-footer-cta-btn"
                type="button"
                onClick={(e) => scrollToSection(e, "schemes")}
              >
                Explore All Schemes
              </button>
            </div>

            <div className="km-footer-seal-area">
              <div className="seal-marathi-block">
                <span>कौशल्ययुक्त</span>
                <strong>समृद्ध महाराष्ट्र</strong>
                <span>शासन निर्णय</span>
                <span>आमचा संकल्प</span>
              </div>
            </div>
          </div>

          <div className="km-footer-divider"></div>

          {/* Footer 4-Column Links Grid */}
          <div className="km-footer-links-grid">
            <div className="km-footer-col">
              <h4 className="footer-col-title">Popular Schemes</h4>
              <ul className="footer-list">
                <li><a href="#schemes" onClick={(e) => scrollToSection(e, "schemes")}>MAHA-DBT</a></li>
                <li><a href="#schemes" onClick={(e) => scrollToSection(e, "schemes")}>Skill Development</a></li>
                <li><a href="#schemes" onClick={(e) => scrollToSection(e, "schemes")}>Farmer Welfare</a></li>
              </ul>
            </div>

            <div className="km-footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-list">
                <li><a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a></li>
                <li><a href="#schemes" onClick={(e) => scrollToSection(e, "schemes")}>Schemes</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, "services")}>Services</a></li>
                <li><a href="#information" onClick={(e) => scrollToSection(e, "information")}>Information</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, "about")}>About Us</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</a></li>
              </ul>
            </div>

            <div className="km-footer-col">
              <h4 className="footer-col-title">Resources</h4>
              <ul className="footer-list">
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Documents</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Forms</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Notifications</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Reports</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>FAQs</a></li>
              </ul>
            </div>

            <div className="km-footer-col">
              <h4 className="footer-col-title">Maharashtra State</h4>
              <ul className="footer-list">
                <li><a href="https://maharashtra.gov.in" target="_blank" rel="noreferrer">Government Portal</a></li>
                <li><a href="https://mahaswayam.gov.in" target="_blank" rel="noreferrer">Mahaswayam.gov.in</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Skill Development Dept.</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Employment Dept.</a></li>
              </ul>

              <div className="km-footer-socials">
                <a href="#facebook" className="social-icon-btn" aria-label="Facebook"><IconFacebook /></a>
                <a href="#twitter" className="social-icon-btn" aria-label="Twitter"><IconTwitterX /></a>
                <a href="#linkedin" className="social-icon-btn" aria-label="LinkedIn"><IconLinkedIn /></a>
                <a href="#youtube" className="social-icon-btn" aria-label="YouTube"><IconYouTube /></a>
              </div>
            </div>
          </div>

          <div className="km-footer-bottom">
            <div className="km-footer-bottom-copy">
              © 2026 Government of Maharashtra. All rights reserved.
            </div>
            <div className="km-footer-bottom-links">
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <span>|</span>
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Use</a>
              <span>|</span>
              <a href="#disclaimer" onClick={(e) => e.preventDefault()}>Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
