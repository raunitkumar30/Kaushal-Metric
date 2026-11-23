import React from "react";

export function LatestAssessmentCard({
  latestAssessment,
  upcomingAssessment,
  formatDate,
}) {
  return (
    <article className="trainee-card assessment-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">LATEST ASSESSMENT</span>
          <h2>{upcomingAssessment?.skill || "No assessment yet"}</h2>
        </div>
        {latestAssessment && (
          <span className="score-badge">{latestAssessment.score}/100</span>
        )}
      </div>

      {latestAssessment ? (
        <div className="assessment-summary">
          <div className="assessment-row">
            <span>Assessment date</span>
            <strong>
              {formatDate ? formatDate(latestAssessment.assessmentDate) : latestAssessment.assessmentDate}
            </strong>
          </div>
          <div className="assessment-row">
            <span>Assessor</span>
            <strong>{latestAssessment.assessor || "Not recorded"}</strong>
          </div>
          <div className="assessment-row">
            <span>Maximum score</span>
            <strong>{latestAssessment.maxScore ?? 100}</strong>
          </div>
        </div>
      ) : (
        <div className="empty-mini">
          <span>○</span>
          <p>Your assessment results will appear here.</p>
        </div>
      )}
    </article>
  );
}

export default LatestAssessmentCard;
