import React from "react";

export function BatchEnrollmentCard({
  availableBatches = [],
  enrollments = [],
  currentEnrollment,
  enrollmentLoading,
  enrollingBatchId,
  enrollmentMessage,
  onEnroll,
  formatDate,
}) {
  return (
    <section className="trainee-card enrollment-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">ENROLLMENT</span>
          <h2>Choose Your Training Batch</h2>
        </div>
        <span className="count-label">
          {availableBatches.length} open
        </span>
      </div>

      {enrollmentMessage && (
        <div className="enrollment-message">
          <span>✓</span>
          <p>{enrollmentMessage}</p>
        </div>
      )}

      {enrollmentLoading ? (
        <div className="empty-mini">
          <div className="trainee-spinner small-spinner" />
          <p>Loading available training batches...</p>
        </div>
      ) : availableBatches.length ? (
        <div className="batch-enrollment-grid">
          {availableBatches.map((batchItem) => {
            const batchProgram =
              typeof batchItem.programId === "object"
                ? batchItem.programId
                : null;

            const batchProvider =
              typeof batchItem.providerId === "object"
                ? batchItem.providerId
                : null;

            const isAlreadyEnrolled = enrollments.some(
              (enrollment) =>
                String(
                  enrollment.batchId?._id || enrollment.batchId
                ) === String(batchItem._id)
            );

            return (
              <article
                className="batch-enrollment-item"
                key={batchItem._id}
              >
                <div className="batch-enrollment-top">
                  <div>
                    <span className="eyebrow">TRAINING BATCH</span>
                    <h3>{batchItem.name}</h3>
                  </div>
                  <span
                    className={`status-badge ${String(
                      batchItem.status || ""
                    ).toLowerCase()}`}
                  >
                    {batchItem.status}
                  </span>
                </div>

                <div className="batch-enrollment-meta">
                  <div>
                    <span>Program</span>
                    <strong>
                      {batchProgram?.name || "Training program"}
                    </strong>
                  </div>
                  <div>
                    <span>Provider</span>
                    <strong>
                      {batchProvider?.name || "Training provider"}
                    </strong>
                  </div>
                  <div>
                    <span>Start</span>
                    <strong>
                      {formatDate ? formatDate(batchItem.startDate) : batchItem.startDate}
                    </strong>
                  </div>
                  <div>
                    <span>End</span>
                    <strong>
                      {formatDate ? formatDate(batchItem.endDate) : batchItem.endDate}
                    </strong>
                  </div>
                  <div>
                    <span>Capacity</span>
                    <strong>
                      {batchItem.capacity || "Not specified"}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-button enrollment-button"
                  onClick={() => onEnroll(batchItem._id)}
                  disabled={
                    enrollingBatchId === batchItem._id ||
                    isAlreadyEnrolled
                  }
                >
                  {enrollingBatchId === batchItem._id
                    ? "Enrolling..."
                    : isAlreadyEnrolled
                      ? "Already Enrolled"
                      : "Enroll in This Batch"}
                </button>
              </article>
            );
          })}
        </div>
      ) : currentEnrollment ? (
        <div className="enrollment-message">
          <span>✓</span>
          <p>
            You are currently enrolled in{" "}
            <strong>
              {currentEnrollment.batchId?.name || "your training batch"}
            </strong>
            .
          </p>
        </div>
      ) : (
        <div className="empty-state compact-empty">
          <div className="empty-icon">◇</div>
          <h3>No open training batches</h3>
          <p>
            New batches will appear here when a provider opens enrollment.
          </p>
        </div>
      )}
    </section>
  );
}

export default BatchEnrollmentCard;
