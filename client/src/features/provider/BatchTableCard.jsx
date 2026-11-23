const getStatusClass = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "active") return "active";
  if (value === "upcoming") return "upcoming";
  if (value === "completed") return "completed";
  if (value === "cancelled") return "cancelled";
  return "default";
};

export default function BatchTableCard({ batches = [] }) {
  return (
    <article className="provider-card">
      <div className="provider-card-header">
        <div>
          <h2>My Batches</h2>
          <p>Programs and delivery windows assigned to your organization.</p>
        </div>
        <span className="provider-count">{batches.length}</span>
      </div>
      {batches.length ? (
        <div className="provider-table-wrap">
          <table className="provider-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch._id}>
                  <td>
                    <div className="batch-name">{batch.name}</div>
                    <div className="batch-subtext">
                      {typeof batch.programId === "object"
                        ? batch.programId?.name || "Program"
                        : "Assigned program"}
                    </div>
                  </td>
                  <td>
                    <span className={`provider-status ${getStatusClass(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td>{batch.capacity}</td>
                  <td>
                    {batch.startDate
                      ? new Date(batch.startDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {batch.endDate
                      ? new Date(batch.endDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-provider">No batches available.</div>
      )}
    </article>
  );
}
