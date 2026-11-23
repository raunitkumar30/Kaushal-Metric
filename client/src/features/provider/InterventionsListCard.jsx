export default function InterventionsListCard({
  interventions = [],
  onUpdateStatus,
}) {
  return (
    <section className="provider-section" id="interventions">
      <div className="provider-section-header">
        <div>
          <h2>Intervention Tracking</h2>
          <p>Track the provider response and completion state.</p>
        </div>
        <span className="provider-count">{interventions.length}</span>
      </div>
      <div className="provider-list">
        {interventions.length ? (
          interventions.map((intervention) => (
            <div className="provider-compact-row" key={intervention._id}>
              <div className="compact-row-header">
                <div className="compact-row-title">
                  <h3>{intervention.traineeId?.name || "Trainee"}</h3>
                  <span className="intervention-type-pill">
                    {intervention.type?.replaceAll("_", " ")}
                  </span>
                </div>
                <span
                  className={`provider-status ${String(
                    intervention.status || "default"
                  ).toLowerCase()}`}
                >
                  {intervention.status}
                </span>
              </div>

              <div className="compact-row-body">
                <p className="compact-row-text">
                  <strong>Action:</strong> {intervention.action}
                </p>
                <p className="compact-row-text">
                  <strong>Reason:</strong> {intervention.reason}
                </p>
                <div className="compact-row-meta">
                  <span>Assigned: {intervention.assignedTo || "Not assigned"}</span>
                  <span>·</span>
                  <span>
                    Start:{" "}
                    {intervention.startDate
                      ? new Date(intervention.startDate).toLocaleDateString()
                      : "Not available"}
                  </span>
                  {intervention.completionDate && (
                    <>
                      <span>·</span>
                      <span>
                        Completed:{" "}
                        {new Date(intervention.completionDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  {intervention.outcome && (
                    <>
                      <span>·</span>
                      <span>Outcome: {intervention.outcome}</span>
                    </>
                  )}
                </div>
              </div>

              {intervention.status !== "COMPLETED" &&
                intervention.status !== "CANCELLED" && (
                  <div className="compact-row-actions">
                    <button
                      className="provider-secondary-button"
                      type="button"
                      onClick={() =>
                        onUpdateStatus(intervention._id, "IN_PROGRESS")
                      }
                    >
                      Mark In Progress
                    </button>
                    <button
                      className="provider-primary-button"
                      type="button"
                      onClick={() =>
                        onUpdateStatus(intervention._id, "COMPLETED")
                      }
                    >
                      Mark Completed
                    </button>
                    <button
                      className="provider-danger-button"
                      type="button"
                      onClick={() =>
                        onUpdateStatus(intervention._id, "CANCELLED")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="empty-provider">
            No interventions have been recorded yet.
          </div>
        )}
      </div>
    </section>
  );
}
