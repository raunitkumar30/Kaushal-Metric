import React from "react";

export function RecentCertificatesTable({
  certifications = [],
  totalCertificates = 0,
  formatDate,
}) {
  return (
    <section className="employer-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">RECENT CERTIFICATES</span>
          <h2>Certificate Verification Records</h2>
        </div>
        <span className="count-pill">
          {totalCertificates} total
        </span>
      </div>

      {certifications.length ? (
        <div className="employer-table-wrap">
          <table className="employer-table">
            <thead>
              <tr>
                <th>Certificate</th>
                <th>Status</th>
                <th>Issue Date</th>
                <th>Verification</th>
              </tr>
            </thead>

            <tbody>
              {certifications.map((certification) => {
                const isValid = certification.status === "VALID";

                return (
                  <tr key={certification._id}>
                    <td>
                      <div className="record-primary">
                        <div className="record-icon certificate">
                          ◇
                        </div>
                        <div>
                          <strong>
                            {certification.certificateNumber}
                          </strong>
                          <span>
                            Training credential
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          isValid ? "valid" : "revoked"
                        }`}
                      >
                        {certification.status}
                      </span>
                    </td>

                    <td>{formatDate ? formatDate(certification.issueDate) : certification.issueDate}</td>

                    <td>
                      <span
                        className={`verification-result ${
                          isValid ? "success" : "danger"
                        }`}
                      >
                        <span>{isValid ? "✓" : "!"}</span>
                        {isValid
                          ? "Certificate is valid"
                          : "Certificate is revoked"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="employer-empty">
          <div>◇</div>
          <h3>No certificates available</h3>
          <p>
            Certificate records will appear here when credentials are
            issued.
          </p>
        </div>
      )}
    </section>
  );
}

export default RecentCertificatesTable;
