import OutcomeCoverageCard from "./OutcomeCoverageCard";

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

export default function ProgramOutcomesCard({
  certifications = [],
  employments = [],
  trainees = [],
  outcomeMetrics,
  traineesCount,
}) {
  const getTraineeName = (traineeRef) => {
    if (!traineeRef) return "Trainee";
    if (typeof traineeRef === "object" && traineeRef.name) {
      return traineeRef.name;
    }
    const matched = trainees.find(
      (t) => String(t._id) === String(traineeRef)
    );
    return matched?.name || "Trainee";
  };

  return (
    <section id="outcomes" className="outcomes-section">
      <div className="section-heading">
        <div>
          <div className="section-kicker">PROGRAM OUTCOMES</div>
          <h2>Outcome Coverage & Placements</h2>
          <p>Track coverage rates, verified certificates and learner employment outcomes.</p>
        </div>
      </div>

      <div className="outcomes-grid">
        {/* OUTCOME COVERAGE */}
        <OutcomeCoverageCard
          outcomeMetrics={outcomeMetrics}
          traineesCount={traineesCount}
        />

        {/* CERTIFICATIONS */}
        <div className="dashboard-card outcome-card">
          <div className="card-header">
            <div>
              <h2>Certifications</h2>
              <p>Issued training certificates.</p>
            </div>

            <span className="mini-number">{certifications.length}</span>
          </div>

          {certifications.length === 0 ? (
            <div className="empty-state">
              <span>✓</span>
              <p>No certifications available.</p>
            </div>
          ) : (
            <div className="outcome-list">
              {certifications.map((certification) => (
                <div className="outcome-row" key={certification._id}>
                  <div className="outcome-icon success">✓</div>

                  <div className="outcome-main">
                    <strong>{getTraineeName(certification.traineeId)}</strong>
                    <span>{certification.certificateNumber}</span>
                  </div>

                  <span className={getStatusClass(certification.status)}>
                    {certification.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EMPLOYMENT */}
        <div className="dashboard-card outcome-card">
          <div className="card-header">
            <div>
              <h2>Employment Outcomes</h2>
              <p>Learner employment results.</p>
            </div>

            <span className="mini-number">{employments.length}</span>
          </div>

          {employments.length === 0 ? (
            <div className="empty-state">
              <span>◎</span>
              <p>No employment outcomes available.</p>
            </div>
          ) : (
            <div className="outcome-list">
              {employments.map((employment) => (
                <div className="outcome-row" key={employment._id}>
                  <div className="outcome-icon blue">◎</div>

                  <div className="outcome-main">
                    <strong>{getTraineeName(employment.traineeId)}</strong>
                    <span>
                      {employment.employerName || "Employer unavailable"}
                    </span>
                    <small>{employment.jobTitle || "Role unavailable"}</small>
                  </div>

                  <span className={getStatusClass(employment.status)}>
                    {employment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
