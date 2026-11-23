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

export default function ProgramDeliverySnapshots({
  programs = [],
  batches = [],
  providers = [],
  activeBatchesCount = 0,
}) {
  return (
    <section className="dashboard-grid three-columns">
      {/* PROGRAMS BREAKDOWN */}
      <div className="dashboard-card compact-card">
        <div className="card-header">
          <div>
            <h2>Programs</h2>
            <p>Program delivery status.</p>
          </div>

          <span className="mini-number">{programs.length}</span>
        </div>

        <div className="status-breakdown">
          {["ACTIVE", "DRAFT", "COMPLETED"].map((status) => {
            const count = programs.filter(
              (item) => item.status === status
            ).length;

            return (
              <div className="breakdown-row" key={status}>
                <span>{status}</span>

                <div className="breakdown-track">
                  <div
                    className="breakdown-fill"
                    style={{
                      width: `${
                        programs.length
                          ? (count / programs.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* BATCHES SNAPSHOT */}
      <div id="batches" className="dashboard-card compact-card">
        <div className="card-header">
          <div>
            <h2>Batches</h2>
            <p>Current training delivery.</p>
          </div>

          <span className="mini-number">{batches.length}</span>
        </div>

        <div className="batch-summary">
          <div className="batch-big-number">{activeBatchesCount}</div>

          <div>
            <strong>Active batches</strong>
            <span>
              {batches.length === 1
                ? "1 total batch"
                : `${batches.length} total batches`}
            </span>
          </div>
        </div>

        <div className="batch-list">
          {batches.slice(0, 3).map((batch) => (
            <div className="small-list-row" key={batch._id}>
              <div>
                <strong>{batch.name}</strong>
                <span>Capacity {batch.capacity || 0}</span>
              </div>

              <span className={getStatusClass(batch.status)}>
                {batch.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PROVIDERS SNAPSHOT */}
      <div id="providers" className="dashboard-card compact-card">
        <div className="card-header">
          <div>
            <h2>Training Providers</h2>
            <p>Registered delivery partners.</p>
          </div>

          <span className="mini-number">{providers.length}</span>
        </div>

        <div className="provider-list">
          {providers.slice(0, 4).map((provider) => (
            <div className="provider-row" key={provider._id}>
              <div className="provider-avatar">
                {provider.name?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div>
                <strong>{provider.name}</strong>
                <span>
                  {provider.registrationNumber || "Registration unavailable"}
                </span>
              </div>
            </div>
          ))}

          {providers.length === 0 && (
            <div className="empty-small">No providers available.</div>
          )}
        </div>
      </div>
    </section>
  );
}
