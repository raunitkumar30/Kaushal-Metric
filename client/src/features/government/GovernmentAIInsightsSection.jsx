import { IconAlert } from "../../components/icons/DashboardIcons";

const getRiskClass = (risk) => {
  const value = String(risk || "").toUpperCase();
  if (value === "HIGH") return "risk-pill risk-high";
  if (value === "MEDIUM") return "risk-pill risk-medium";
  if (value === "LOW") return "risk-pill risk-low";
  return "risk-pill risk-neutral";
};

const getRiskIcon = (risk) => {
  const value = String(risk || "").toUpperCase();
  if (value === "HIGH") return "!";
  if (value === "MEDIUM") return "!";
  return "✓";
};

export default function GovernmentAIInsightsSection({
  aiInsights = null,
  loading = false,
  error = "",
  onLoadAIInsights,
}) {
  return (
    <section id="ai-insights" className="government-ai-section">
      <div className="government-ai-header">
        <div>
          <div className="ai-label">
            <span>✦</span>
            GOVERNMENT INTELLIGENCE
          </div>

          <h2>AI Insights</h2>

          <p>
            Cross-program analysis of learner retention, skill readiness and
            employment risk.
          </p>
        </div>

        <button
          type="button"
          className="ai-header-button"
          onClick={onLoadAIInsights}
          disabled={loading}
        >
          <span className="ai-spark">✦</span>
          {loading ? "Analyzing..." : "Refresh Analysis"}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">!</div>
          <div>
            <strong>AI analysis unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!aiInsights && !loading && !error && (
        <div className="ai-insights-empty">
          <div className="ai-empty-icon">✦</div>

          <h3>Government AI analysis</h3>

          <p>
            Generate AI insights to identify learners who may require retention
            or employment support.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onLoadAIInsights}
          >
            Generate AI Insights
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

          <h3>Analyzing training outcomes</h3>

          <p>
            AI is evaluating learner attendance, assessments, skills,
            certification and employment data.
          </p>
        </div>
      )}

      {aiInsights && (
        <>
          {/* OVERVIEW */}
          <div className="insight-overview-grid">
            <div className="insight-overview-card">
              <span>Programs</span>
              <strong>{aiInsights.overview?.programs ?? 0}</strong>
            </div>

            <div className="insight-overview-card">
              <span>Batches</span>
              <strong>{aiInsights.overview?.batches ?? 0}</strong>
            </div>

            <div className="insight-overview-card">
              <span>Trainees</span>
              <strong>{aiInsights.overview?.trainees ?? 0}</strong>
            </div>

            <div className="insight-overview-card">
              <span>Certified</span>
              <strong>{aiInsights.overview?.certified ?? 0}</strong>
            </div>

            <div className="insight-overview-card">
              <span>Employed</span>
              <strong>{aiInsights.overview?.employed ?? 0}</strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Certification Rate</span>
              <strong>{aiInsights.overview?.certificationRate ?? 0}%</strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Employment Rate</span>
              <strong>{aiInsights.overview?.employmentRate ?? 0}%</strong>
            </div>
          </div>

          {/* RISK OVERVIEW */}
          <div className="risk-overview-card">
            <div className="section-card-heading">
              <div>
                <h3>AI Risk Overview</h3>
                <p>Learners grouped by AI predicted risk level.</p>
              </div>

              <span className="ai-badge">AI</span>
            </div>

            <div className="risk-overview-grid">
              <div className="risk-overview-item high">
                <div className="risk-overview-icon">
                  <IconAlert size={16} strokeWidth={2.2} />
                </div>

                <div>
                  <span>High retention</span>
                  <strong>
                    {aiInsights.overview?.highRetentionRisk ?? 0}
                  </strong>
                </div>
              </div>

              <div className="risk-overview-item medium">
                <div className="risk-overview-icon">
                  <IconAlert size={16} strokeWidth={2.2} />
                </div>

                <div>
                  <span>Medium retention</span>
                  <strong>
                    {aiInsights.overview?.mediumRetentionRisk ?? 0}
                  </strong>
                </div>
              </div>

              <div className="risk-overview-item high">
                <div className="risk-overview-icon">
                  <IconAlert size={16} strokeWidth={2.2} />
                </div>

                <div>
                  <span>High employment</span>
                  <strong>
                    {aiInsights.overview?.highEmploymentRisk ?? 0}
                  </strong>
                </div>
              </div>

              <div className="risk-overview-item medium">
                <div className="risk-overview-icon">
                  <IconAlert size={16} strokeWidth={2.2} />
                </div>

                <div>
                  <span>Medium employment</span>
                  <strong>
                    {aiInsights.overview?.mediumEmploymentRisk ?? 0}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* TRAINEE AI TABLE */}
          <div className="ai-trainee-card">
            <div className="section-card-heading">
              <div>
                <h3>Learner Risk Analysis</h3>
                <p>
                  AI-generated risk, evidence and recommended action for each
                  learner.
                </p>
              </div>
            </div>

            {!aiInsights.trainees || aiInsights.trainees.length === 0 ? (
              <div className="empty-state">
                <span>✦</span>
                <p>No learner AI insights available.</p>
              </div>
            ) : (
              <div className="ai-trainee-list">
                {aiInsights.trainees.map((item) => (
                  <div className="ai-trainee-row" key={item.traineeId}>
                    <div className="ai-trainee-main">
                      <div className="person-avatar">
                        {item.traineeName?.charAt(0)?.toUpperCase() || "T"}
                      </div>

                      <div>
                        <strong>{item.traineeName}</strong>
                        <span>
                          {item.programName || "Program unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="ai-trainee-metrics">
                      <div>
                        <span>Attendance</span>
                        <strong>{item.attendancePercentage}%</strong>
                      </div>

                      <div>
                        <span>Assessment</span>
                        <strong>{item.assessmentAverage}</strong>
                      </div>

                      <div>
                        <span>Skill gaps</span>
                        <strong>
                          {item.skillsWithGaps}/{item.totalSkills}
                        </strong>
                      </div>
                    </div>

                    <div className="ai-risk-column">
                      <span className="risk-label">Retention</span>

                      <div className="risk-result">
                        <span
                          className={getRiskClass(
                            item.retentionRisk?.risk
                          )}
                        >
                          <span>
                            {getRiskIcon(item.retentionRisk?.risk)}
                          </span>
                          {item.retentionRisk?.risk || "UNKNOWN"}
                        </span>

                        <strong>
                          {item.retentionRisk?.score}/100
                        </strong>
                      </div>
                    </div>

                    <div className="ai-risk-column">
                      <span className="risk-label">Employment</span>

                      <div className="risk-result">
                        <span
                          className={getRiskClass(
                            item.employmentRisk?.risk
                          )}
                        >
                          <span>
                            {getRiskIcon(item.employmentRisk?.risk)}
                          </span>
                          {item.employmentRisk?.risk || "UNKNOWN"}
                        </span>

                        <strong>
                          {item.employmentRisk?.score}/100
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EXPLANATIONS */}
          <div className="ai-evidence-grid">
            {aiInsights.trainees
              ?.filter(
                (item) => item.retentionRisk || item.employmentRisk
              )
              .map((item) => (
                <div
                  className="evidence-card"
                  key={`evidence-${item.traineeId}`}
                >
                  <div className="evidence-header">
                    <div>
                      <strong>{item.traineeName}</strong>
                      <span>AI decision evidence</span>
                    </div>

                    <span className="ai-badge">AI</span>
                  </div>

                  <div className="evidence-block">
                    <div className="evidence-title">
                      <span className="evidence-question">?</span>
                      <strong>Why attention may be needed</strong>
                    </div>

                    {item.retentionRisk?.reasons?.length > 0 && (
                      <ul>
                        {item.retentionRisk.reasons.map((reason, index) => (
                          <li key={`retention-${index}`}>{reason}</li>
                        ))}
                      </ul>
                    )}

                    {item.employmentRisk?.reasons?.length > 0 && (
                      <ul>
                        {item.employmentRisk.reasons.map((reason, index) => (
                          <li key={`employment-${index}`}>{reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="recommendation-box government-recommendation">
                    <span>→</span>
                    <div>
                      <strong>Recommended action</strong>
                      <p>
                        {item.retentionRisk?.recommendation ||
                          item.employmentRisk?.recommendation ||
                          "Continue monitoring."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </section>
  );
}
