import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import PageContainer from "./PageContainer";
import "./WorkspaceLayout.css";

const navigation = {
  GOVERNMENT: [
    { label: "Overview", section: "overview", icon: "grid" },
    { label: "Programs", section: "programs", icon: "program" },
    { label: "Providers", section: "providers", icon: "provider" },
    { label: "Batches", section: "batches", icon: "batch" },
    { label: "Trainees", section: "trainees", icon: "trainee" },
    { label: "AI Insights", section: "ai-insights", icon: "ai" },
    { label: "Outcomes", section: "outcomes", icon: "outcome" },
  ],
  PROVIDER: [
    { label: "Overview", section: "overview", icon: "grid" },
    { label: "Batches", section: "batches", icon: "batch" },
    { label: "Trainees", section: "trainees", icon: "trainee" },
    { label: "Assessments", section: "assessments", icon: "assessment" },
    { label: "Outcomes", section: "outcomes", icon: "outcome" },
    { label: "AI Alerts", section: "ai-alerts", icon: "alert" },
    { label: "Interventions", section: "interventions", icon: "intervention" },
  ],
  TRAINEE: [
    { label: "My Journey", section: "overview", icon: "grid" },
    { label: "Skills", section: "skills", icon: "skill" },
    { label: "Assessments", section: "assessments", icon: "assessment" },
    { label: "Certificate", section: "certificate", icon: "certificate" },
    { label: "Employment", section: "employment", icon: "outcome" },
    { label: "AI Guidance", section: "ai-guidance", icon: "ai" },
  ],
  EMPLOYER: [
    { label: "Verify Certificate", section: "verify", icon: "certificate" },
    { label: "Employment", section: "employment", icon: "outcome" },
  ],
};

export function WorkspaceLayout({ role, children }) {
  const { user, logout } = useAuth();
  const effectiveRole = role || user?.role || "GOVERNMENT";

  const items = navigation[effectiveRole] || navigation.GOVERNMENT;

  const roleLabel =
    effectiveRole === "GOVERNMENT"
      ? "Government"
      : effectiveRole === "PROVIDER"
      ? "Training Provider"
      : effectiveRole === "TRAINEE"
      ? "Trainee"
      : "Employer";

  const displayName =
    user?.name ||
    (effectiveRole === "GOVERNMENT"
      ? "Government Admin"
      : `${roleLabel} User`);

  const initial = displayName?.charAt(0)?.toUpperCase() || "U";
  const [activeSection, setActiveSection] = useState(items[0]?.section || "overview");

  const scrollToSection = (section) => {
    setActiveSection(section);
    const target = document.getElementById(section);

    if (target) {
      const headerOffset = 135;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: Math.max(offsetPosition, 0),
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="workspace">
      {/* TOPBAR WITH GOV HEADER AND USER PROFILE */}
      <Topbar
        roleLabel={roleLabel}
        displayName={displayName}
        initial={initial}
        onLogout={logout}
      />

      {/* ROLE NAVIGATION TABS */}
      <Sidebar
        items={items}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        roleLabel={roleLabel}
      />

      {/* PAGE CONTAINER */}
      <PageContainer>{children}</PageContainer>
    </div>
  );
}

export default WorkspaceLayout;
