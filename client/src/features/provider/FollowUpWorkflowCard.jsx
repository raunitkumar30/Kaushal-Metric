export default function FollowUpWorkflowCard({
  followUps = [],
  trainees = [],
  selectedTrainee = "",
  onSelectTrainee,
  followUpType = "30_DAY",
  onTypeChange,
  scheduledDate = "",
  onScheduledDateChange,
  onCreateFollowUp,
  savingFollowUp = false,
  followUpMessage = "",
  onCompleteFollowUp,
}) {
  return (
    <section className="provider-section">
      <div className="provider-section-header">
        <div>
          <h2>30 / 90 Day Follow-Up</h2>
          <p>Track what happens after training and capture employment progress.</p>
        </div>
        <span className="provider-count">{followUps.length}</span>
      </div>

      <form className="provider-form" onSubmit={onCreateFollowUp}>
        <div className="provider-field">
          <label>Trainee</label>
          <select
            value={selectedTrainee}
            onChange={(e) => onSelectTrainee(e.target.value)}
            required
          >
            <option value="">Select trainee</option>
            {trainees.map((trainee) => (
              <option key={trainee._id} value={trainee._id}>
                {trainee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="provider-field">
          <label>Follow-Up Type</label>
          <select
            value={followUpType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="30_DAY">30 Day</option>
            <option value="90_DAY">90 Day</option>
          </select>
        </div>

        <div className="provider-field">
          <label>Scheduled Date</label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => onScheduledDateChange(e.target.value)}
            required
          />
        </div>

        <div className="provider-form-actions">
          <button
            className="provider-primary-button"
            type="submit"
            disabled={savingFollowUp}
          >
            {savingFollowUp ? "Saving..." : "Schedule Follow-Up"}
          </button>
        </div>
      </form>

      {followUpMessage && (
        <div
          className="provider-message success"
          style={{ margin: "0 20px 16px" }}
        >
          {followUpMessage}
        </div>
      )}

      <div className="provider-list">
        {followUps.length ? (
          followUps.map((followUp) => (
            <div className="provider-compact-row" key={followUp._id}>
              <div className="compact-row-header">
                <div className="compact-row-title">
                  <h3>{followUp.traineeId?.name || "Trainee"}</h3>
                  <span className="intervention-type-pill">
                    {String(followUp.type || "").replace("_", " ")}
                  </span>
                </div>
                <span
                  className={`provider-status ${String(
                    followUp.status || "default"
                  ).toLowerCase()}`}
                >
                  {followUp.status}
                </span>
              </div>

              <div className="compact-row-body">
                <div className="compact-row-meta">
                  <span>
                    Scheduled:{" "}
                    {followUp.scheduledDate
                      ? new Date(followUp.scheduledDate).toLocaleDateString()
                      : "Not available"}
                  </span>
                  {followUp.status === "COMPLETED" && (
                    <>
                      <span>·</span>
                      <span>
                        Employed: {followUp.currentlyEmployed ? "Yes" : "No"}
                      </span>
                      <span>·</span>
                      <span>
                        Same role: {followUp.sameRole ? "Yes" : "No"}
                      </span>
                    </>
                  )}
                </div>

                {followUp.status === "COMPLETED" && followUp.notes && (
                  <p className="compact-row-text" style={{ marginTop: 4 }}>
                    <strong>Notes:</strong> {followUp.notes}
                  </p>
                )}
              </div>

              {followUp.status === "PENDING" && (
                <div className="compact-row-actions">
                  <button
                    className="provider-primary-button"
                    type="button"
                    onClick={() =>
                      onCompleteFollowUp(
                        followUp._id,
                        true,
                        true,
                        "Trainee confirmed employment and continued in the same role."
                      )
                    }
                  >
                    Complete — Employed
                  </button>
                  <button
                    className="provider-secondary-button"
                    type="button"
                    onClick={() =>
                      onCompleteFollowUp(
                        followUp._id,
                        false,
                        false,
                        "Trainee follow-up completed; employment not confirmed."
                      )
                    }
                  >
                    Complete — Not Employed
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-provider">
            No follow-ups have been scheduled yet.
          </div>
        )}
      </div>
    </section>
  );
}
