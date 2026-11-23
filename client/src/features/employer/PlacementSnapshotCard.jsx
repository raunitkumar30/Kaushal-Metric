import React from "react";

export function PlacementSnapshotCard({
  totalEmployments = 0,
  employedRecords = 0,
  seekingRecords = 0,
  unknownRecords = 0,
  unemployedRecords = 0,
  verifiedEmployments = 0,
}) {
  const percentage = totalEmployments
    ? Math.min((employedRecords / totalEmployments) * 100, 100)
    : 0;

  return (
    <article className="employer-card outcome-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">EMPLOYMENT OUTCOMES</span>
          <h2>Placement Snapshot</h2>
        </div>
      </div>

      <div className="outcome-stats">
        <div>
          <strong>{employedRecords}</strong>
          <span>Employed</span>
        </div>
        <div>
          <strong>{seekingRecords}</strong>
          <span>Seeking</span>
        </div>
        <div>
          <strong>{unknownRecords}</strong>
          <span>Unknown</span>
        </div>
        <div>
          <strong>{verifiedEmployments}</strong>
          <span>Verified</span>
        </div>
      </div>

      <div className="outcome-bar">
        <div
          className="outcome-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="outcome-caption">
        Employment records currently available in KaushalMetric Tracker.
      </p>

      <div className="outcome-status-breakdown">
        <span>
          Unemployed: <strong>{unemployedRecords}</strong>
        </span>
        <span>
          Unknown: <strong>{unknownRecords}</strong>
        </span>
      </div>
    </article>
  );
}

export default PlacementSnapshotCard;
