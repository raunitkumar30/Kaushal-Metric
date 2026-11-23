import React from "react";

export function AssessmentHistoryTable({ assessments = [], formatDate }) {
  return (
    <section className="trainee-card assessment-history-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">ASSESSMENTS</span>
          <h2>Assessment History</h2>
        </div>
        <span className="count-label">{assessments.length} total</span>
      </div>

      {assessments.length ? (
        <div className="trainee-table-wrap">
          <table className="trainee-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Score</th>
                <th>Assessor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment._id}>
                  <td>
                    <strong>{assessment.skill}</strong>
                  </td>
                  <td>
                    <span className="table-score">
                      {assessment.score}/{assessment.maxScore ?? 100}
                    </span>
                  </td>
                  <td>{assessment.assessor || "Not recorded"}</td>
                  <td>
                    {formatDate ? formatDate(assessment.assessmentDate) : assessment.assessmentDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state compact-empty">
          <div className="empty-icon">◈</div>
          <h3>No assessments recorded yet</h3>
          <p>Your assessment history will appear here.</p>
        </div>
      )}
    </section>
  );
}

export default AssessmentHistoryTable;
