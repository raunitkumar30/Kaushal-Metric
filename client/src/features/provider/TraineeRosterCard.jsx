export default function TraineeRosterCard({
  trainees = [],
  analyzingSkillGap = false,
  analyzingRetention = false,
  analyzingEmployment = false,
  onAnalyzeSkillGap,
  onAnalyzeRetentionRisk,
  onAnalyzeEmploymentRisk,
}) {
  return (
    <section className="provider-section" id="trainees">
      <div className="provider-section-header">
        <div>
          <h2>Trainees</h2>
          <p>Review learner progress and launch the AI analyses that support action.</p>
        </div>
        <span className="provider-count">{trainees.length}</span>
      </div>
      {trainees.length ? (
        <div className="provider-table-wrap">
          <table className="provider-table trainee-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Skills</th>
                <th style={{ textAlign: "right" }}>AI Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainees.map((trainee) => (
                <tr key={trainee._id}>
                  <td>
                    <div className="trainee-cell-main">
                      <strong>{trainee.name}</strong>
                      <span className="trainee-cell-email">{trainee.email}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`provider-status ${String(
                        trainee.status || "default"
                      ).toLowerCase()}`}
                    >
                      {trainee.status}
                    </span>
                  </td>
                  <td>
                    <strong>{trainee.attendancePercentage}%</strong>
                  </td>
                  <td>
                    <span className="trainee-cell-skills">
                      {trainee.skills?.length
                        ? trainee.skills
                            .map((skill) => `${skill.name} (${skill.level})`)
                            .join(", ")
                        : "No skills recorded"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="trainee-action-cluster inline">
                      <button
                        className="trainee-action-btn"
                        type="button"
                        title="Run AI Skill Gap Analysis"
                        onClick={() => onAnalyzeSkillGap(trainee._id)}
                        disabled={analyzingSkillGap}
                      >
                        {analyzingSkillGap ? "Analyzing..." : "Skill Gap"}
                      </button>
                      <button
                        className="trainee-action-btn"
                        type="button"
                        title="Run AI Retention Risk Analysis"
                        onClick={() => onAnalyzeRetentionRisk(trainee._id)}
                        disabled={analyzingRetention}
                      >
                        {analyzingRetention ? "Analyzing..." : "Retention"}
                      </button>
                      <button
                        className="trainee-action-btn primary"
                        type="button"
                        title="Run AI Employment Risk Analysis"
                        onClick={() => onAnalyzeEmploymentRisk(trainee._id)}
                        disabled={analyzingEmployment}
                      >
                        {analyzingEmployment ? "Analyzing..." : "Employment"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-provider">No trainees available.</div>
      )}
    </section>
  );
}
