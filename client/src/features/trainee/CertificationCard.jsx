import React from "react";

export function CertificationCard({ certifications = [], formatDate }) {
  return (
    <article className="trainee-card certificate-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">CERTIFICATION</span>
          <h2>My Certificate</h2>
        </div>
        <span className="count-label">
          {certifications.length} issued
        </span>
      </div>

      {certifications.length ? (
        <div className="certificate-list">
          {certifications.map((certification) => (
            <div className="certificate-item" key={certification._id}>
              <div className="certificate-icon">✓</div>
              <div>
                <strong>{certification.certificateNumber}</strong>
                <span>
                  {certification.status} · Issued{" "}
                  {formatDate ? formatDate(certification.issueDate) : certification.issueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-mini">
          <span>◇</span>
          <p>No certificate issued yet.</p>
        </div>
      )}
    </article>
  );
}

export default CertificationCard;
