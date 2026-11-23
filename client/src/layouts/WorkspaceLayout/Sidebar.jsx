import React from "react";
import {
  IconGrid,
  IconProgram,
  IconProvider,
  IconBatch,
  IconTrainee,
  IconOutcome,
  IconAI,
  IconAssessment,
  IconAlert,
  IconIntervention,
  IconSkill,
  IconCertificate,
} from "../../components/icons/DashboardIcons";

function renderNavigationIcon(iconName, size = 15) {
  switch (iconName) {
    case "grid":
      return <IconGrid size={size} />;
    case "program":
      return <IconProgram size={size} />;
    case "provider":
      return <IconProvider size={size} />;
    case "batch":
      return <IconBatch size={size} />;
    case "trainee":
      return <IconTrainee size={size} />;
    case "outcome":
      return <IconOutcome size={size} />;
    case "ai":
      return <IconAI size={size} />;
    case "assessment":
      return <IconAssessment size={size} />;
    case "alert":
      return <IconAlert size={size} />;
    case "intervention":
      return <IconIntervention size={size} />;
    case "skill":
      return <IconSkill size={size} />;
    case "certificate":
    case "verify":
      return <IconCertificate size={size} />;
    default:
      return null;
  }
}

export function Sidebar({
  items = [],
  activeSection,
  onSectionClick,
  roleLabel,
  className = "",
}) {
  return (
    <nav className={`workspace-navigation ${className}`} aria-label={`${roleLabel} navigation`}>
      <div className="navigation-inner">
        <div className="navigation-role-tag">{roleLabel}</div>

        {items.map((item) => {
          const isActive = activeSection === item.section;
          return (
            <button
              key={item.section}
              type="button"
              className={`section-nav-button ${isActive ? "active" : ""}`}
              onClick={() => onSectionClick(item.section)}
            >
              {renderNavigationIcon(item.icon, 15)}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Sidebar;
