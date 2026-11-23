import React from "react";

export function EmploymentVerificationWorkflow({
  employments = [],
  verifications = [],
  selectedEmploymentId,
  onSelectEmploymentId,
  verificationNote,
  onChangeVerificationNote,
  verificationMessage,
  verificationSaving,
  onCreateVerification,
  onUpdateVerification,
}) {
  return (
    <section className="employer-card employer-verification-action-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">EMPLOYER VERIFICATION</span>
          <h2>Verify an Employment Outcome</h2>
        </div>
        <span className="count-pill">
          {verifications.length} requests
        </span>
      </div>

      <p className="verification-action-intro">
        Confirm whether a reported employment outcome is genuine. The
        verification is stored as a separate record for auditability.
      </p>

      {verificationMessage && (
        <div className="verification-success-message">
          <span>✓</span>
          <p>{verificationMessage}</p>
        </div>
      )}

      <div className="verification-action-form">
        <div className="verification-field">
          <label htmlFor="employment-verification">
            Employment record
          </label>
          <select
            id="employment-verification"
            value={selectedEmploymentId}
            onChange={(event) => onSelectEmploymentId(event.target.value)}
          >
            <option value="">Select an employment record</option>
            {employments.map((employment) => {
              const traineeName =
                employment.traineeId?.name ||
                "Trainee";

              return (
                <option
                  key={employment._id}
                  value={employment._id}
                >
                  {traineeName} — {employment.employerName} —{" "}
                  {employment.jobTitle}
                </option>
              );
            })}
          </select>
        </div>

        <div className="verification-field">
          <label htmlFor="verification-note">
            Note
          </label>
          <input
            id="verification-note"
            type="text"
            value={verificationNote}
            onChange={(event) => onChangeVerificationNote(event.target.value)}
            placeholder="Optional verification note"
          />
        </div>

        <button
          type="button"
          className="verification-primary-button"
          onClick={onCreateVerification}
          disabled={verificationSaving || !selectedEmploymentId}
        >
          {verificationSaving ? "Saving..." : "Start Verification"}
        </button>
      </div>

      <div className="verification-request-list">
        {verifications.length ? (
          verifications.map((verification) => {
            const employment = verification.employmentId;
            const trainee = verification.traineeId;

            return (
              <article
                className="verification-request"
                key={verification._id}
              >
                <div>
                  <strong>
                    {trainee?.name || "Trainee"}
                  </strong>
                  <span>
                    {employment?.employerName || verification.employerName}
                    {" · "}
                    {employment?.jobTitle || "Employment outcome"}
                  </span>
                </div>

                <div className="verification-request-actions">
                  <span
                    className={`status-pill ${
                      verification.status === "VERIFIED"
                        ? "valid"
                        : verification.status === "REJECTED"
                        ? "revoked"
                        : "warning"
                    }`}
                  >
                    {verification.status}
                  </span>

                  {verification.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        className="verification-secondary-button success"
                        onClick={() =>
                          onUpdateVerification(verification._id, "VERIFIED")
                        }
                        disabled={verificationSaving}
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        className="verification-secondary-button danger"
                        onClick={() =>
                          onUpdateVerification(verification._id, "REJECTED")
                        }
                        disabled={verificationSaving}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="verification-request-empty">
            No employer verification requests yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default EmploymentVerificationWorkflow;
