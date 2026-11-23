import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYER");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigateByRole = (userRole) => {
    if (userRole === "GOVERNMENT") {
      navigate("/government");
    } else if (userRole === "PROVIDER") {
      navigate("/provider");
    } else if (userRole === "TRAINEE") {
      navigate("/trainee");
    } else if (userRole === "EMPLOYER") {
      navigate("/employer");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const user = await login(email, password);
      navigateByRole(user.role);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please verify your email and password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess(
        "Registration successful. You can now sign in with your credentials."
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("EMPLOYER");

      setMode("login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setSuccess("");
  };

  const quickLoginAccounts = [
    {
      role: "GOVERNMENT",
      label: "Government",
      email: "gov@test.com",
      password: "Test123456",
      icon: "🏛️",
      color: "#07366d",
    },
    {
      role: "PROVIDER",
      label: "Provider",
      email: "provider@test.com",
      password: "Provider123456",
      icon: "🏢",
      color: "#1266c4",
    },
    {
      role: "TRAINEE",
      label: "Trainee",
      email: "rahul@test.com",
      password: "Trainee123456",
      icon: "👤",
      color: "#159957",
    },
    {
      role: "EMPLOYER",
      label: "Employer",
      email: "employer@test.com",
      password: "employer123",
      icon: "💼",
      color: "#f36b21",
    },
  ];

  const handleQuickLogin = async (account) => {
    if (submitting) return;

    setMode("login");
    setError("");
    setSuccess("");
    setEmail(account.email);
    setPassword(account.password);
    setSubmitting(true);

    try {
      const user = await login(account.email, account.password);
      navigateByRole(user.role);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to sign in to the ${account.label} dashboard.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLogin = mode === "login";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }

        .kaushalmetric-login {
          height: 100vh;
          height: 100dvh;
          min-height: 100vh;
          min-height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          width: 100%;
          background: #f0f4f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(8px, 2vh, 18px) 16px;
          box-sizing: border-box;
          overflow: hidden;
          overscroll-behavior: none;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 1020px;
          max-height: calc(100vh - clamp(16px, 4vh, 36px));
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          overflow: hidden;
          background: #ffffff;
          border-radius: 16px;
          box-shadow:
            0 20px 48px -10px rgba(7, 54, 109, 0.12),
            0 4px 16px rgba(7, 54, 109, 0.04);
          border: 1px solid #dce8f3;
        }

        @media (min-width: 921px) {
          .login-container {
            zoom: 1.25;
            max-width: 940px;
            max-height: calc(80vh - 20px);
          }
        }

        /* LEFT SIDE */
        .login-brand {
          position: relative;
          overflow: hidden;
          background: linear-gradient(150deg, #052d5b 0%, #07366d 45%, #0b4b84 100%);
          padding: clamp(16px, 2.6vh, 26px) clamp(18px, 2.2vw, 30px);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-glow-one {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(243, 107, 33, 0.18) 0%, transparent 70%);
          top: -120px;
          right: -80px;
          pointer-events: none;
        }

        .brand-glow-two {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(18, 102, 196, 0.25) 0%, transparent 70%);
          bottom: -90px;
          left: -70px;
          pointer-events: none;
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .brand-logo-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: clamp(10px, 1.6vh, 18px);
          text-decoration: none;
          color: white;
        }

        .brand-logo-mark {
          width: 34px;
          height: 34px;
          position: relative;
          flex-shrink: 0;
        }

        .brand-logo-mark span {
          position: absolute;
          font-size: 19px;
          line-height: 1;
        }

        .brand-logo-mark span:nth-child(1) {
          left: 0;
          top: 9px;
          color: #f36b21;
        }

        .brand-logo-mark span:nth-child(2) {
          left: 9px;
          top: 0;
          color: #159957;
        }

        .brand-logo-mark span:nth-child(3) {
          left: 17px;
          top: 10px;
          color: #38bdf8;
        }

        .brand-logo-text {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.4px;
          color: #ffffff;
        }

        .brand-logo-text span {
          color: #f36b21;
        }

        .brand-tagline {
          font-size: 10.5px;
          color: #bfdbfe;
          margin-top: 2px;
          font-weight: 500;
        }

        .brand-heading {
          font-size: clamp(19px, 2vw, 23px);
          line-height: 1.22;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin: 0 0 6px;
        }

        .brand-heading span {
          color: #f36b21;
        }

        .brand-description {
          font-size: 12.5px;
          line-height: 1.45;
          color: #dce8f3;
          margin: 0 0 clamp(10px, 1.6vh, 18px);
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1vh, 9px);
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255, 255, 255, 0.07);
          padding: clamp(6px, 1vh, 8px) 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
        }

        .feature-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.15);
          display: grid;
          place-items: center;
          font-size: 13px;
          flex-shrink: 0;
          color: #ffffff;
        }

        .feature-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .feature-description {
          font-size: 11px;
          line-height: 1.35;
          color: #cbd5e1;
          margin-top: 1px;
        }

        .brand-footer-note {
          position: relative;
          z-index: 2;
          padding-top: clamp(10px, 1.5vh, 14px);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10.5px;
          color: #94a3b8;
        }

        .brand-footer-note span:last-child {
          color: #fdba74;
          font-weight: 600;
        }

        /* RIGHT SIDE */
        .login-form-panel {
          background: #ffffff;
          padding: clamp(16px, 2.6vh, 26px) clamp(18px, 2.2vw, 30px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .login-form-panel::-webkit-scrollbar {
          display: none;
        }

        .form-top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: clamp(8px, 1.4vh, 13px);
        }

        .back-home-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: #1266c4;
          text-decoration: none;
          transition: color 0.15s;
        }

        .back-home-link:hover {
          color: #07366d;
        }

        .form-welcome {
          margin-bottom: clamp(8px, 1.4vh, 13px);
        }

        .form-welcome h1 {
          margin: 0;
          color: #07366d;
          font-size: clamp(19px, 1.8vw, 22px);
          line-height: 1.22;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .form-welcome p {
          margin: 3px 0 0;
          color: #607993;
          font-size: 12px;
          line-height: 1.4;
        }

        .form-group {
          margin-bottom: clamp(6px, 1.1vh, 10px);
        }

        .form-label {
          display: block;
          margin-bottom: 3px;
          color: #183b63;
          font-size: 11.5px;
          font-weight: 650;
        }

        .form-input,
        .form-select {
          width: 100%;
          height: 36px;
          border: 1px solid #dce8f3;
          border-radius: 7px;
          background: #ffffff;
          color: #183b63;
          padding: 0 11px;
          outline: none;
          font-size: 12.5px;
          box-sizing: border-box;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #1266c4;
          box-shadow: 0 0 0 3px rgba(18, 102, 196, 0.12);
        }

        .submit-button {
          width: 100%;
          height: 38px;
          margin-top: 4px;
          border: none;
          border-radius: 7px;
          background: linear-gradient(135deg, #f36b21 0%, #e05307 100%);
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.18s ease;
          box-shadow: 0 3px 12px rgba(243, 107, 33, 0.28);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(243, 107, 33, 0.38);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .switch-text {
          margin-top: clamp(6px, 1vh, 10px);
          text-align: center;
          font-size: 11.5px;
          color: #607993;
        }

        .switch-button {
          margin-left: 5px;
          border: none;
          background: none;
          color: #1266c4;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        .quick-login-panel {
          margin-top: clamp(8px, 1.3vh, 13px);
          padding-top: clamp(7px, 1.1vh, 10px);
          border-top: 1px solid #e5edf5;
        }

        .quick-login-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .quick-login-title {
          font-size: 11px;
          font-weight: 750;
          color: #07366d;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin: 0;
        }

        .quick-login-hint {
          font-size: 10px;
          color: #159957;
          font-weight: 600;
          background: #e6f9f0;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .quick-login-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
        }

        .quick-login-button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border: 1px solid #dce8f3;
          border-radius: 7px;
          background: #f8fafc;
          cursor: pointer;
          text-align: left;
          transition: all 0.16s ease;
        }

        .quick-login-button:hover:not(:disabled) {
          background: #eaf5ff;
          border-color: #93c5fd;
          transform: translateY(-1px);
        }

        .quick-login-icon {
          font-size: 15px;
          flex-shrink: 0;
        }

        .quick-login-label {
          display: block;
          color: #07366d;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.2;
        }

        .quick-login-email {
          display: block;
          margin-top: 1px;
          color: #607993;
          font-size: 10px;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .message {
          padding: 8px 12px;
          border-radius: 7px;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 500;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .success-message {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }

        .register-note {
          margin-top: clamp(6px, 1vh, 10px);
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.35;
          text-align: center;
        }

        @media (max-width: 920px) {
          html, body {
            height: auto !important;
            overflow: auto !important;
          }

          .kaushalmetric-login {
            height: auto;
            min-height: 100vh;
            max-height: none;
            overflow-y: auto;
            padding: 24px 16px;
          }

          .login-container {
            zoom: 1;
            grid-template-columns: 1fr;
            max-height: none;
          }

          .login-brand {
            padding: 28px 24px;
          }

          .login-form-panel {
            padding: 28px 24px;
          }
        }
      `}</style>

      <main className="kaushalmetric-login">
        <div className="login-container">
          {/* ================================================
              LEFT BRAND SECTION
          ================================================= */}
          <section className="login-brand">
            <div className="brand-glow-one" />
            <div className="brand-glow-two" />

            <div className="brand-content">
              {/* Logo */}
              <Link to="/" className="brand-logo-link" title="Go to KaushalMetric Tracker Home">
                <div className="brand-logo-mark">
                  <span>●</span>
                  <span>●</span>
                  <span>●</span>
                </div>

                <div>
                  <div className="brand-logo-text">
                    <span>KaushalMetric</span> Tracker
                  </div>
                  <div className="brand-tagline">
                    Skills Today. Opportunities Tomorrow.
                  </div>
                </div>
              </Link>

              {/* Main message */}
              <h2 className="brand-heading">
                Measure Skills. Track Outcomes. Build a <span>Skilled Maharashtra.</span>
              </h2>

              <p className="brand-description">
                A consent-based, longitudinal platform connecting training programs,
                learner progress, certification, and verified employment outcomes.
              </p>

              {/* Features */}
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">💡</div>
                  <div>
                    <div className="feature-title">AI-Powered Insights</div>
                    <div className="feature-description">
                      Identify skill gaps, dropout risks, and employability barriers.
                    </div>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">🏛️</div>
                  <div>
                    <div className="feature-title">Multi-Stakeholder Portals</div>
                    <div className="feature-description">
                      Dedicated workspaces for Government, Providers, Trainees, and Employers.
                    </div>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <div>
                    <div className="feature-title">Verified Long-Term Impact</div>
                    <div className="feature-description">
                      Track 30, 90, 180, and 365-day retention, salary growth, and career progression.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-footer-note">
              <span>© 2026 KaushalMetric Tracker</span>
              <span>कौशल्यसंपन्न महाराष्ट्र</span>
            </div>
          </section>

          {/* ================================================
              RIGHT LOGIN SECTION
          ================================================= */}
          <section className="login-form-panel">
            <div className="form-top-nav">
              <Link to="/" className="back-home-link">
                ← Back to Landing Page
              </Link>

              <span style={{ fontSize: "12px", color: "#607993" }}>
                {isLogin ? "Sign-in portal" : "Registration"}
              </span>
            </div>

            <div className="form-inner">
              <div className="form-welcome">
                <h1>
                  {isLogin ? "Sign in to your workspace" : "Create your account"}
                </h1>
                <p>
                  {isLogin
                    ? "Enter your credentials or choose a quick demo account below"
                    : "Join the KaushalMetric Tracker platform to access your portal"}
                </p>
              </div>

              {error && <div className="message error-message">{error}</div>}
              {success && <div className="message success-message">{success}</div>}

              <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    minLength={6}
                    required
                    className="form-input"
                  />
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Portal Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-select"
                    >
                      <option value="GOVERNMENT">Government Department</option>
                      <option value="PROVIDER">Training Provider</option>
                      <option value="TRAINEE">Trainee / Learner</option>
                      <option value="EMPLOYER">Employer / Industry Partner</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="submit-button"
                >
                  {submitting
                    ? isLogin
                      ? "Signing in..."
                      : "Creating account..."
                    : isLogin
                      ? "Sign In to Workspace →"
                      : "Create Account →"}
                </button>
              </form>

              <div className="switch-text">
                {isLogin
                  ? "Don't have an account yet?"
                  : "Already registered?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="switch-button"
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </div>

              {isLogin && (
                <div className="quick-login-panel">
                  <div className="quick-login-heading">
                    <p className="quick-login-title">Quick Demo Sign-In</p>
                    <span className="quick-login-hint">Instant Access</span>
                  </div>

                  <div className="quick-login-grid">
                    {quickLoginAccounts.map((account) => (
                      <button
                        key={account.role}
                        type="button"
                        className="quick-login-button"
                        onClick={() => handleQuickLogin(account)}
                        disabled={submitting}
                        title={`Sign in as ${account.label}`}
                      >
                        <span className="quick-login-icon">
                          {account.icon}
                        </span>
                        <span className="quick-login-copy">
                          <span className="quick-login-label">
                            {account.label}
                          </span>
                          <span className="quick-login-email">
                            {account.email}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="register-note">
                By continuing, you agree to use KaushalMetric Tracker for authorized training,
                assessment, and employment activities.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;