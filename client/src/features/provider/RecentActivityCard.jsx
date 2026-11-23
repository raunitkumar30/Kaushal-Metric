import React from "react";
import { IconAssessment, IconIntervention } from "../../components/icons/DashboardIcons";

export default function RecentActivityCard({
  recentAssessments = [],
  recentInterventions = [],
}) {
  const totalCount = recentAssessments.length + recentInterventions.length;

  return (
    <section className="provider-section recent-activity-card">
      <div className="provider-section-header">
        <div>
          <h2>Recent Activity</h2>
          <p>Latest assessment and intervention records.</p>
        </div>
        <span className="provider-count">{totalCount}</span>
      </div>
      <div className="activity-list activity-grid">
        {recentAssessments.map((assessment) => (
          <div
            className="activity-item"
            key={`assessment-${assessment._id}`}
          >
            <div className="activity-icon assessment" title="Assessment Record">
              <IconAssessment size={14} />
            </div>
            <div className="activity-main">
              <strong>
                {assessment.skill} assessment · {assessment.score}/100
              </strong>
              <span>
                {assessment.assessmentDate
                  ? new Date(assessment.assessmentDate).toLocaleDateString()
                  : "Date unavailable"}
              </span>
            </div>
          </div>
        ))}
        {recentInterventions.map((intervention) => (
          <div
            className="activity-item"
            key={`intervention-${intervention._id}`}
          >
            <div className="activity-icon intervention" title="Intervention Record">
              <IconIntervention size={14} />
            </div>
            <div className="activity-main">
              <strong>{intervention.type?.replaceAll("_", " ")}</strong>
              <span>
                {intervention.status} ·{" "}
                {intervention.traineeId?.name || "Trainee"}
              </span>
            </div>
          </div>
        ))}
        {!recentAssessments.length && !recentInterventions.length && (
          <div className="empty-provider">No recent activity recorded.</div>
        )}
      </div>
    </section>
  );
}
