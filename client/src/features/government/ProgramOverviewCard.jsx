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

export default function ProgramOverviewCard({
  programs = [],
  getProviderName,
}) {
  return (
    <div id="programs" className="dashboard-card program-overview">
      <div className="card-header">
        <div>
          <h2>Program Overview</h2>
          <p>Current government-funded training programs.</p>
        </div>

        <span className="card-count">{programs.length} programs</span>
      </div>

      {programs.length === 0 ? (
        <div className="empty-state">
          <span>▣</span>
          <p>No programs available.</p>
        </div>
      ) : (
        <div className="program-list">
          {programs.map((program) => (
            <div className="program-row" key={program._id}>
              <div className="program-main">
                <div className="program-logo">
                  {program.name?.charAt(0)?.toUpperCase() || "P"}
                </div>

                <div>
                  <h3>{program.name}</h3>
                  <p>{program.sector || "Sector not specified"}</p>
                </div>
              </div>

              <div className="program-details">
                <div>
                  <span>Provider</span>
                  <strong>
                    {getProviderName
                      ? getProviderName(program.providerId)
                      : "Provider"}
                  </strong>
                </div>

                <div>
                  <span>Skills</span>
                  <strong>{program.targetSkills?.length || 0}</strong>
                </div>

                <span className={getStatusClass(program.status)}>
                  {program.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
