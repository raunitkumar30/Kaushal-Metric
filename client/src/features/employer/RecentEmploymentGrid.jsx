import React from "react";

export function RecentEmploymentGrid({
  employments = [],
  totalEmployments = 0,
  formatDate,
}) {
  return (
    <section className="employer-card employment-records-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">EMPLOYMENT RECORDS</span>
          <h2>Recent Employment Outcomes</h2>
        </div>
        <span className="count-pill">
          {totalEmployments} total
        </span>
      </div>

      {employments.length ? (
        <div className="employment-record-grid">
          {employments.map((employment) => (
            <article
              className="employment-record"
              key={employment._id}
            >
              <div className="employment-record-top">
                <div className="record-icon employer">▣</div>

                <span
                  className={`status-pill ${
                    employment.status === "EMPLOYED"
                      ? "valid"
                      : employment.status === "SEEKING"
                        ? "warning"
                        : employment.status === "UNKNOWN"
                          ? "warning"
                          : "neutral"
                  }`}
                >
                  {employment.status}
                </span>
              </div>

              <h3>{employment.employerName}</h3>

              <p className="job-title">
                {employment.jobTitle}
              </p>

              <div className="employment-meta">
                <div>
                  <span>Employment date</span>
                  <strong>
                    {formatDate ? formatDate(employment.employmentDate) : employment.employmentDate}
                  </strong>
                </div>

                <div>
                  <span>Verification</span>
                  <strong
                    className={
                      employment.verified ? "verified-text" : ""
                    }
                  >
                    {employment.verified
                      ? "Verified"
                      : "Not verified"}
                  </strong>
                </div>
              </div>

              {employment.verified && (
                <div className="verified-banner">
                  <span>✓</span>
                  Employment outcome verified
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="employer-empty">
          <div>▣</div>
          <h3>No employment outcomes recorded</h3>
          <p>
            Employment outcomes will appear here once they are recorded.
          </p>
        </div>
      )}
    </section>
  );
}

export default RecentEmploymentGrid;
