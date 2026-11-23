export default function CertificationsListCard({ certifications = [] }) {
  return (
    <section className="provider-section">
      <div className="provider-section-header">
        <div>
          <h2>Certifications</h2>
          <p>Certification records linked to your trainees.</p>
        </div>
        <span className="provider-count">{certifications.length}</span>
      </div>
      <div className="provider-list">
        {certifications.length ? (
          certifications.map((certification) => (
            <div className="provider-list-card" key={certification._id}>
              <h3>{certification.certificateNumber}</h3>
              <p>
                <strong>Status:</strong> {certification.status}
              </p>
              <p>
                <strong>Issue date:</strong>{" "}
                {certification.issueDate
                  ? new Date(certification.issueDate).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          ))
        ) : (
          <div className="empty-provider">No certifications recorded yet.</div>
        )}
      </div>
    </section>
  );
}
