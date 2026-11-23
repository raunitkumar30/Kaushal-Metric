import React from "react";

export function PlacementStatusCard({
  placementStatus,
  latestEmployment,
  formatDate,
}) {
  return (
    <article className="trainee-card placement-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">PLACEMENT STATUS</span>
          <h2>{placementStatus}</h2>
        </div>
        <span
          className={`placement-pill ${
            latestEmployment?.status === "EMPLOYED"
              ? "positive"
              : latestEmployment?.status === "SEEKING"
                ? "warning"
                : ""
          }`}
        >
          {latestEmployment?.verified ? "Verified" : "Current"}
        </span>
      </div>

      <div className="placement-content">
        <div className="placement-status-main">
          <div className="placement-circle">
            <span>{latestEmployment?.status === "EMPLOYED" ? "✓" : "•"}</span>
          </div>
          <div>
            <strong>
              {latestEmployment?.employerName || "No employer recorded"}
            </strong>
            <span>
              {latestEmployment?.jobTitle ||
                "Employment outcome has not been recorded yet."}
            </span>
          </div>
        </div>

        <div className="placement-details">
          <div>
            <span>Status</span>
            <strong>{latestEmployment?.status || "Not recorded"}</strong>
          </div>
          <div>
            <span>Verified</span>
            <strong>{latestEmployment?.verified ? "Yes" : "No"}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>
              {formatDate ? formatDate(latestEmployment?.employmentDate) : latestEmployment?.employmentDate}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PlacementStatusCard;
