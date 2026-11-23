import React from "react";

export function FollowUpTimelineCard({ followUps = [], formatDate }) {
  return (
    <section className="trainee-card followup-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">POST-TRAINING FOLLOW-UP</span>
          <h2>30 / 90 Day Follow-Up</h2>
        </div>
        <span className="count-label">{followUps.length} scheduled</span>
      </div>

      {followUps.length ? (
        <div className="followup-list">
          {followUps.map((followUp) => (
            <article className="followup-item" key={followUp._id}>
              <div className="followup-main">
                <div className="followup-title-row">
                  <strong>
                    {followUp.type === "30_DAY"
                      ? "30-Day Follow-Up"
                      : "90-Day Follow-Up"}
                  </strong>
                  <span
                    className={`followup-status ${
                      String(followUp.status || "").toLowerCase()
                    }`}
                  >
                    {followUp.status}
                  </span>
                </div>

                <div className="followup-details">
                  <div>
                    <span>Scheduled</span>
                    <strong>
                      {formatDate ? formatDate(followUp.scheduledDate) : followUp.scheduledDate}
                    </strong>
                  </div>

                  {followUp.completedDate && (
                    <div>
                      <span>Completed</span>
                      <strong>
                        {formatDate ? formatDate(followUp.completedDate) : followUp.completedDate}
                      </strong>
                    </div>
                  )}

                  {followUp.status === "COMPLETED" &&
                    followUp.currentlyEmployed !== undefined && (
                      <div>
                        <span>Employment</span>
                        <strong>
                          {followUp.currentlyEmployed
                            ? "Currently employed"
                            : "Not employed"}
                        </strong>
                      </div>
                    )}

                  {followUp.status === "COMPLETED" &&
                    followUp.sameRole !== undefined && (
                      <div>
                        <span>Same role</span>
                        <strong>
                          {followUp.sameRole ? "Yes" : "No"}
                        </strong>
                      </div>
                    )}
                </div>

                {followUp.notes && (
                  <p className="followup-notes">
                    <span>Notes</span>
                    {followUp.notes}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-mini">
          <span>○</span>
          <p>No post-training follow-ups have been scheduled yet.</p>
        </div>
      )}
    </section>
  );
}

export default FollowUpTimelineCard;
