import React from "react";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import { IconLogout } from "../../components/icons/DashboardIcons";

export function Topbar({
  roleLabel,
  displayName,
  initial,
  onLogout,
  className = "",
}) {
  return (
    <header className={`workspace-topbar ${className}`}>
        <div className="workspace-topbar-inner">
          <div className="topbar-left">
            <Link to="/" className="workspace-brand-link" title="KaushalMetric Tracker Home">
              <div className="workspace-logo-mark">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>

              <div className="brand-copy">
                <p className="brand-name">
                  <span>KaushalMetric</span> Tracker
                </p>
                <p className="brand-subtitle">
                  Skills Today. Opportunities Tomorrow.
                </p>
              </div>
            </Link>

            <span className="topbar-divider">/</span>

            <span className="topbar-role-badge">{roleLabel} Workspace</span>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span className="system-dot" />
              <span>Platform operational</span>
            </div>

            <UserProfile
              displayName={displayName}
              roleLabel={roleLabel}
              initial={initial}
            />

            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
              title="Sign out"
            >
              <IconLogout size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>
  );
}

export default Topbar;
