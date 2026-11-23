export default function OutcomeAnalyticsSection({
  outcomeAnalytics = null,
  loading = false,
  error = "",
  onLoadAnalytics,
}) {
  return (
    <section id="outcome-analytics" className="government-ai-section">
      <div className="government-ai-header">
        <div>
          <div className="ai-label">
            <span>▣</span>
            OUTCOME ANALYTICS
          </div>

          <h2>Government Outcome Analytics</h2>

          <p>
            Compare employment outcomes and outcome coverage across
            districts and training programs.
          </p>
        </div>

        <button
          type="button"
          className="ai-header-button"
          onClick={onLoadAnalytics}
          disabled={loading}
        >
          <span className="ai-spark">↗</span>
          {loading
            ? "Loading..."
            : outcomeAnalytics
              ? "Refresh Analytics"
              : "Load Outcome Analytics"}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">!</div>
          <div>
            <strong>Outcome analytics unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!outcomeAnalytics && !loading && !error && (
        <div className="ai-insights-empty">
          <div className="ai-empty-icon">▣</div>

          <h3>Outcome performance intelligence</h3>

          <p>
            Load the latest outcome analytics to review employment rates and
            coverage by district and program.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onLoadAnalytics}
          >
            Load Outcome Analytics
          </button>
        </div>
      )}

      {loading && (
        <div className="ai-insights-empty">
          <div className="ai-loader">
            <span />
            <span />
            <span />
          </div>

          <h3>Analyzing outcome performance</h3>

          <p>
            Government outcome data is being grouped by district and training
            program.
          </p>
        </div>
      )}

      {outcomeAnalytics && !loading && (
        <>
          <div className="insight-overview-grid">
            <div className="insight-overview-card">
              <span>Total Trainees</span>
              <strong>{outcomeAnalytics.summary?.totalTrainees ?? 0}</strong>
            </div>

            <div className="insight-overview-card">
              <span>Outcome Coverage</span>
              <strong>
                {outcomeAnalytics.summary?.outcomeCoverage ?? 0}%
              </strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Employed</span>
              <strong>{outcomeAnalytics.summary?.employed ?? 0}</strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Employment Rate</span>
              <strong>
                {outcomeAnalytics.summary?.employmentRate ?? 0}%
              </strong>
            </div>
          </div>

          <div className="insight-overview-grid">
            <div className="insight-overview-card">
              <span>Verified Outcomes</span>
              <strong>
                {outcomeAnalytics.verificationSummary?.verified ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card">
              <span>Pending Verification</span>
              <strong>
                {outcomeAnalytics.verificationSummary?.pending ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card">
              <span>Rejected Verification</span>
              <strong>
                {outcomeAnalytics.verificationSummary?.rejected ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Verification Coverage</span>
              <strong>
                {outcomeAnalytics.verificationSummary?.verificationCoverage ?? 0}
                %
              </strong>
            </div>
          </div>

          <div className="dashboard-card compact-card">
            <div className="card-header">
              <div>
                <h2>Employer Verification Status</h2>
                <p>Government view of employment verification progress.</p>
              </div>

              <span className="ai-badge">VERIFICATION</span>
            </div>

            <div className="status-breakdown">
              {[
                [
                  "VERIFIED",
                  outcomeAnalytics.verificationSummary?.verified ?? 0,
                ],
                [
                  "PENDING",
                  outcomeAnalytics.verificationSummary?.pending ?? 0,
                ],
                [
                  "REJECTED",
                  outcomeAnalytics.verificationSummary?.rejected ?? 0,
                ],
                [
                  "NOT SUBMITTED",
                  outcomeAnalytics.verificationSummary?.notSubmitted ?? 0,
                ],
              ].map(([status, count]) => (
                <div className="breakdown-row" key={status}>
                  <span>{status}</span>

                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${
                          outcomeAnalytics.summary?.totalTrainees
                            ? Math.min(
                                (count /
                                  outcomeAnalytics.summary.totalTrainees) *
                                  100,
                                100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="outcomes-grid">
            <div className="dashboard-card compact-card">
              <div className="card-header">
                <div>
                  <h2>District Performance</h2>
                  <p>
                    Outcome coverage and employment performance by district.
                  </p>
                </div>

                <span className="card-count">
                  {outcomeAnalytics.byDistrict?.length ?? 0} districts
                </span>
              </div>

            {!outcomeAnalytics.byDistrict?.length ? (
                <div className="empty-state">
                  <span>◎</span>
                  <p>No district outcome data available.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>District</th>
                        <th>Trainees</th>
                        <th>Outcomes</th>
                        <th>Coverage</th>
                        <th>Employed</th>
                        <th>Employment Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {outcomeAnalytics.byDistrict.map((item) => (
                        <tr key={item.district}>
                          <td>
                            <strong>{item.district}</strong>
                          </td>
                          <td>{item.trainees}</td>
                          <td>{item.outcomeRecorded}</td>
                          <td>{item.outcomeCoverage}%</td>
                          <td>{item.employed}</td>
                          <td>
                            <span
                              className={
                                item.employmentRate >= 60
                                  ? "status status-success"
                                  : item.employmentRate >= 30
                                    ? "status status-warning"
                                    : "status status-danger"
                              }
                            >
                              {item.employmentRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="dashboard-card compact-card">
              <div className="card-header">
                <div>
                  <h2>Program Performance</h2>
                  <p>Employment outcomes across training programs.</p>
                </div>

                <span className="card-count">
                  {outcomeAnalytics.byProgram?.length ?? 0} programs
                </span>
              </div>

              {!outcomeAnalytics.byProgram?.length ? (
                <div className="empty-state">
                  <span>▣</span>
                  <p>No program outcome data available.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Program</th>
                        <th>Trainees</th>
                        <th>Outcomes</th>
                        <th>Coverage</th>
                        <th>Employed</th>
                        <th>Employment Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {outcomeAnalytics.byProgram.map((item) => (
                        <tr key={String(item.programId)}>
                          <td>
                            <strong>{item.programName}</strong>
                          </td>
                          <td>{item.trainees}</td>
                          <td>{item.outcomeRecorded}</td>
                          <td>{item.outcomeCoverage}%</td>
                          <td>{item.employed}</td>
                          <td>
                            <span
                              className={
                                item.employmentRate >= 60
                                  ? "status status-success"
                                  : item.employmentRate >= 30
                                    ? "status status-warning"
                                    : "status status-danger"
                              }
                            >
                              {item.employmentRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
