import React from "react";

export function EmployerMetrics({
  totalCertificates = 0,
  validCertificates = 0,
  verificationRate = 0,
  totalEmployments = 0,
  employedRecords = 0,
  verifiedEmployments = 0,
}) {
  return (
    <section className="employer-metric-grid">
      <article className="employer-metric-card">
        <div className="employer-metric-icon blue">◇</div>
        <div>
          <span>Certificates</span>
          <strong>{totalCertificates}</strong>
          <small>Total certificates available</small>
        </div>
      </article>

      <article className="employer-metric-card">
        <div className="employer-metric-icon green">✓</div>
        <div>
          <span>Valid Certificates</span>
          <strong>{validCertificates}</strong>
          <small>{verificationRate}% currently valid</small>
        </div>
      </article>

      <article className="employer-metric-card">
        <div className="employer-metric-icon purple">▣</div>
        <div>
          <span>Employment Records</span>
          <strong>{totalEmployments}</strong>
          <small>{employedRecords} employed records</small>
        </div>
      </article>

      <article className="employer-metric-card">
        <div className="employer-metric-icon orange">✓</div>
        <div>
          <span>Verified Outcomes</span>
          <strong>{verifiedEmployments}</strong>
          <small>Employment records verified</small>
        </div>
      </article>
    </section>
  );
}

export default EmployerMetrics;
