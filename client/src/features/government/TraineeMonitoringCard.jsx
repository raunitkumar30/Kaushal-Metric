const getStatusClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (
    ["ACTIVE", "CERTIFIED", "EMPLOYED", "VALID", "COMPLETED"].includes(value)
  ) {
    return "status status-success";
  }
  if (["DRAFT", "UPCOMING", "ENROLLED", "TRAINING"].includes(value)) {
    return "status status-neutral";
  }
  if (["MEDIUM", "SEEKING", "UNKNOWN"].includes(value)) {
    return "status status-warning";
  }
  if (
    ["HIGH", "DROPPED", "CANCELLED", "REVOKED", "UNEMPLOYED"].includes(value)
  ) {
    return "status status-danger";
  }
  return "status status-neutral";
};

export default function TraineeMonitoringCard({
  trainees = [],
  getTraineeProgram,
  analyzing = false,
  onAnalyzeSkillGap,
}) {
  return (
    <section id="trainees" className="dashboard-card trainees-card">
      <div className="card-header">
        <div>
          <h2>Trainee Monitoring</h2>
          <p>
            Review learner progress and run individual AI skill-gap analysis.
          </p>
        </div>

        <span className="card-count">{trainees.length} trainees</span>
      </div>

      {trainees.length === 0 ? (
        <div className="empty-state">
          <span>◎</span>
          <p>No trainees available.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Program</th>
                <th>Attendance</th>
                <th>Skills</th>
                <th>Status</th>
                <th>AI Analysis</th>
              </tr>
            </thead>

            <tbody>
              {trainees.map((trainee) => (
                <tr key={trainee._id}>
                  <td>
                    <div className="person-cell">
                      <div className="person-avatar">
                        {trainee.name?.charAt(0)?.toUpperCase() || "T"}
                      </div>

                      <div>
                        <strong>{trainee.name}</strong>
                        <span>{trainee.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="muted-text">
                      {getTraineeProgram
                        ? getTraineeProgram(trainee)
                        : "Program unavailable"}
                    </span>
                  </td>

                  <td>
                    <div className="attendance-cell">
                      <div className="attendance-track">
                        <div
                          className="attendance-fill"
                          style={{
                            width: `${Math.min(
                              Number(trainee.attendancePercentage || 0),
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <strong>{trainee.attendancePercentage || 0}%</strong>
                    </div>
                  </td>

                  <td>
                    <div className="skill-count">
                      {trainee.skills?.length || 0}
                      <span>recorded</span>
                    </div>
                  </td>

                  <td>
                    <span className={getStatusClass(trainee.status)}>
                      {trainee.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="table-ai-button"
                      onClick={() => onAnalyzeSkillGap(trainee._id)}
                      disabled={analyzing}
                    >
                      <span>✦</span>
                      {analyzing ? "Analyzing..." : "Analyze"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
