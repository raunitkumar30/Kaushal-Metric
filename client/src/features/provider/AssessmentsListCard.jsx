export default function AssessmentsListCard({ assessments = [] }) {
  return (
    <section className="provider-section" id="assessments">
      <div className="provider-section-header">
        <div>
          <h2>Assessments</h2>
          <p>Recorded evidence used by the AI analysis.</p>
        </div>
        <span className="provider-count">{assessments.length}</span>
      </div>
      {assessments.length ? (
        <div className="provider-table-wrap">
          <table className="provider-table">
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
                    <span className="score-badge">
                      {assessment.score}/100
                    </span>
                  </td>
                  <td>{assessment.assessor || "Not available"}</td>
                  <td>
                    {assessment.assessmentDate
                      ? new Date(
                          assessment.assessmentDate
                        ).toLocaleDateString()
                      : "Not available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-provider">No assessments recorded yet.</div>
      )}
    </section>
  );
}
