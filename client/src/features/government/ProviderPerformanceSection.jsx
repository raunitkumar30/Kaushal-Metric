export default function ProviderPerformanceSection({
  outcomeAnalytics = null,
}) {
  if (!outcomeAnalytics) {
    return null;
  }

  const totalAnalyzed = outcomeAnalytics.summary?.providersAnalyzed ?? 0;
  const reviewRequired = outcomeAnalytics.summary?.providersRequiringReview ?? 0;
  const toMonitor = outcomeAnalytics.summary?.providersToMonitor ?? 0;
  const goodStanding = Math.max(totalAnalyzed - reviewRequired - toMonitor, 0);

  return (
    <section id="provider-performance" className="government-ai-section">
      <div className="government-ai-header">
        <div>
          <div className="ai-label">
            <span>◎</span>
            PROVIDER PERFORMANCE
          </div>

          <h2>Provider Performance & Review</h2>

          <p>
            Compare training providers using outcome coverage, employment
            results and employer verification signals.
          </p>
        </div>
      </div>

      <div className="insight-overview-grid">
        <div className="insight-overview-card">
          <span>Providers Analyzed</span>
          <strong>{totalAnalyzed}</strong>
        </div>

        <div className="insight-overview-card">
          <span>Review Required</span>
          <strong>{reviewRequired}</strong>
        </div>

        <div className="insight-overview-card">
          <span>Monitor</span>
          <strong>{toMonitor}</strong>
        </div>

        <div className="insight-overview-card emphasis">
          <span>Good Standing</span>
          <strong>{goodStanding}</strong>
        </div>
      </div>

      <div className="dashboard-card compact-card">
        <div className="card-header">
          <div>
            <h2>Provider Performance</h2>
            <p>
              Government review signals based on recorded program outcomes.
            </p>
          </div>

          <span className="card-count">
            {outcomeAnalytics.byProvider?.length ?? 0} providers
          </span>
        </div>

        {!outcomeAnalytics.byProvider?.length ? (
          <div className="empty-state">
            <span>◎</span>
            <p>No provider performance data available.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Programs</th>
                  <th>Trainees</th>
                  <th>Outcome Coverage</th>
                  <th>Employed</th>
                  <th>Employment Rate</th>
                  <th>Verification</th>
                  <th>Review</th>
                </tr>
              </thead>

              <tbody>
                {outcomeAnalytics.byProvider.map((provider) => {
                  const review = outcomeAnalytics.providerReview?.find(
                    (item) =>
                      String(item.providerId) === String(provider.providerId)
                  );

                  const reviewStatus = review?.reviewStatus || "GOOD";

                  const reviewClass =
                    reviewStatus === "REVIEW_REQUIRED"
                      ? "status status-danger"
                      : reviewStatus === "MONITOR"
                        ? "status status-warning"
                        : "status status-success";

                  return (
                    <tr key={String(provider.providerId)}>
                      <td>
                        <div className="person-cell">
                          <div className="provider-avatar">
                            {provider.providerName
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>
                            <strong>{provider.providerName}</strong>

                            <span>
                              {provider.registrationNumber ||
                                "Registration unavailable"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{provider.programs}</td>
                      <td>{provider.trainees}</td>
                      <td>{provider.outcomeCoverage}%</td>
                      <td>{provider.employed}</td>

                      <td>
                        <span
                          className={
                            provider.employmentRate >= 60
                              ? "status status-success"
                              : provider.employmentRate >= 30
                                ? "status status-warning"
                                : "status status-danger"
                          }
                        >
                          {provider.employmentRate}%
                        </span>
                      </td>

                      <td>{provider.verificationRate}%</td>

                      <td>
                        <span className={reviewClass}>
                          {reviewStatus === "REVIEW_REQUIRED"
                            ? "REVIEW REQUIRED"
                            : reviewStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-card compact-card">
        <div className="card-header">
          <div>
            <h2>Provider Review Signals</h2>
            <p>
              Reasons Government may need to monitor or review a provider.
            </p>
          </div>

          <span className="ai-badge">REVIEW</span>
        </div>

        {!outcomeAnalytics.providerReview?.length ? (
          <div className="empty-state">
            <span>◎</span>
            <p>No provider review signals available.</p>
          </div>
        ) : (
          <div className="provider-list">
            {outcomeAnalytics.providerReview.map((item) => (
              <div
                className="provider-row"
                key={String(item.providerId)}
              >
                <div className="provider-avatar">
                  {item.providerName?.charAt(0)?.toUpperCase() || "P"}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>{item.providerName}</strong>

                  <span>
                    {item.reviewStatus === "REVIEW_REQUIRED"
                      ? "Government review recommended"
                      : item.reviewStatus === "MONITOR"
                        ? "Continue monitoring provider performance"
                        : "No immediate review signal"}
                  </span>

                  {item.reasons?.length > 0 && (
                    <span>
                      {item.reasons
                        .map((reason) =>
                          reason.replaceAll("_", " ").toLowerCase()
                        )
                        .join(" • ")}
                    </span>
                  )}
                </div>

                <span
                  className={
                    item.reviewStatus === "REVIEW_REQUIRED"
                      ? "status status-danger"
                      : item.reviewStatus === "MONITOR"
                        ? "status status-warning"
                        : "status status-success"
                  }
                >
                  {item.reviewStatus === "REVIEW_REQUIRED"
                    ? "REVIEW REQUIRED"
                    : item.reviewStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
