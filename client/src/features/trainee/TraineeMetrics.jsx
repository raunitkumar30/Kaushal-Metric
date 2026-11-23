import React from "react";

export function TraineeMetrics({
  programName,
  programSector,
  attendancePercentage = 0,
  assessmentsCount = 0,
  averageAssessment = 0,
  certificationsCount = 0,
}) {
  return (
    <section className="trainee-metric-grid">
      <article className="trainee-metric-card">
        <div className="metric-icon blue-icon">▣</div>
        <div>
          <span className="metric-label">Training Program</span>
          <strong>{programName || "1"}</strong>
          <small>{programSector || "Active learning journey"}</small>
        </div>
      </article>

      <article className="trainee-metric-card">
        <div className="metric-icon green-icon">✓</div>
        <div>
          <span className="metric-label">Attendance</span>
          <strong>{attendancePercentage}%</strong>
          <small>Overall attendance</small>
        </div>
      </article>

      <article className="trainee-metric-card">
        <div className="metric-icon purple-icon">◈</div>
        <div>
          <span className="metric-label">Assessments</span>
          <strong>{assessmentsCount}</strong>
          <small>
            {assessmentsCount
              ? `Average score ${averageAssessment}`
              : "No assessments yet"}
          </small>
        </div>
      </article>

      <article className="trainee-metric-card">
        <div className="metric-icon orange-icon">◇</div>
        <div>
          <span className="metric-label">Certificates</span>
          <strong>{certificationsCount}</strong>
          <small>
            {certificationsCount ? "Certification recorded" : "Not issued yet"}
          </small>
        </div>
      </article>
    </section>
  );
}

export default TraineeMetrics;
