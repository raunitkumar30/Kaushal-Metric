const getPriorityClass = (priority) => {
  const value = String(priority || "").toUpperCase();
  if (value === "HIGH") return "priority priority-high";
  if (value === "MEDIUM") return "priority priority-medium";
  if (value === "LOW") return "priority priority-low";
  return "priority priority-required";
};

export default function AggregateSkillInsightsSection({
  aggregateSkillInsights = null,
  loading = false,
  error = "",
  onLoadAggregateInsights,
}) {
  return (
    <section id="aggregate-ai" className="government-ai-section">
      <div className="government-ai-header">
        <div>
          <div className="ai-label">
            <span>✦</span>
            COURSE & PROVIDER INTELLIGENCE
          </div>

          <h2>Recurring Skill Gap Insights</h2>

          <p>
            AI aggregates assessed learner performance to identify recurring
            skill gaps across programs and providers.
          </p>
        </div>

        <button
          type="button"
          className="ai-header-button"
          onClick={onLoadAggregateInsights}
          disabled={loading}
        >
          <span className="ai-spark">✦</span>
          {loading
            ? "Analyzing..."
            : aggregateSkillInsights
              ? "Refresh Skill Analysis"
              : "Analyze Skill Gaps"}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">!</div>
          <div>
            <strong>Aggregate AI analysis unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!aggregateSkillInsights && !loading && !error && (
        <div className="ai-insights-empty">
          <div className="ai-empty-icon">✦</div>

          <h3>Program-level skill intelligence</h3>

          <p>
            Run aggregate analysis to find recurring skill gaps that may require
            changes to training delivery.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={onLoadAggregateInsights}
          >
            Analyze Skill Gaps
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

          <h3>Analyzing recurring skill gaps</h3>

          <p>
            AI is comparing required skills with recorded assessment results
            across programs.
          </p>
        </div>
      )}

      {aggregateSkillInsights && (
        <>
          <div className="insight-overview-grid">
            <div className="insight-overview-card">
              <span>Programs Analyzed</span>
              <strong>
                {aggregateSkillInsights.summary?.totalPrograms ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card">
              <span>Trainees Analyzed</span>
              <strong>
                {aggregateSkillInsights.summary?.totalTrainees ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card">
              <span>Assessments</span>
              <strong>
                {aggregateSkillInsights.summary?.totalAssessments ?? 0}
              </strong>
            </div>

            <div className="insight-overview-card emphasis">
              <span>Recurring Gaps</span>
              <strong>
                {aggregateSkillInsights.summary?.recurringSkillGaps ?? 0}
              </strong>
            </div>
          </div>

          <div className="risk-overview-card">
            <div className="section-card-heading">
              <div>
                <h3>Skill Gap Priorities</h3>
                <p>
                  Skills ranked by the frequency and severity of assessed gaps.
                </p>
              </div>

              <span className="ai-badge">AI</span>
            </div>

            {!aggregateSkillInsights.skillGaps ||
            aggregateSkillInsights.skillGaps.length === 0 ? (
              <div className="empty-state">
                <span>✦</span>
                <p>No required skills are available for analysis.</p>
              </div>
            ) : (
              <div className="ai-evidence-grid">
                {aggregateSkillInsights.skillGaps.map((item) => (
                  <div className="evidence-card" key={item.skill}>
                    <div className="evidence-header">
                      <div>
                        <strong>{item.skill}</strong>
                        <span>
                          {item.programsAffected} program
                          {item.programsAffected === 1 ? "" : "s"} affected
                        </span>
                      </div>

                      <span className={getPriorityClass(item.priority)}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="ai-trainee-metrics">
                      <div>
                        <span>Assessed</span>
                        <strong>{item.traineesAssessed}</strong>
                      </div>

                      <div>
                        <span>With gap</span>
                        <strong>{item.traineesWithGaps}</strong>
                      </div>

                      <div>
                        <span>Gap rate</span>
                        <strong>{item.gapRate}%</strong>
                      </div>

                      <div>
                        <span>Avg. score</span>
                        <strong>
                          {item.averageScore == null ? "—" : item.averageScore}
                        </strong>
                      </div>
                    </div>

                    <div className="evidence-block">
                      <div className="evidence-title">
                        <span className="evidence-question">?</span>
                        <strong>Why this matters</strong>
                      </div>

                      <p>
                        {item.explanation || "No explanation available."}
                      </p>
                    </div>

                    <div className="recommendation-box government-recommendation">
                      <span>→</span>
                      <div>
                        <strong>Recommended action</strong>
                        <p>
                          {item.recommendation ||
                            "Continue monitoring this skill."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ai-trainee-card">
            <div className="section-card-heading">
              <div>
                <h3>Provider Skill Signals</h3>
                <p>
                  Training providers ranked by recorded below-target assessment
                  results.
                </p>
              </div>
            </div>

            {!aggregateSkillInsights.providerInsights ||
            aggregateSkillInsights.providerInsights.length === 0 ? (
              <div className="empty-state">
                <span>◎</span>
                <p>No provider-level insights available.</p>
              </div>
            ) : (
              <div className="ai-trainee-list">
                {aggregateSkillInsights.providerInsights.map((provider) => (
                  <div
                    className="ai-trainee-row"
                    key={String(provider.providerId)}
                  >
                    <div className="ai-trainee-main">
                      <div className="person-avatar">
                        {provider.providerName?.charAt(0)?.toUpperCase() || "P"}
                      </div>

                      <div>
                        <strong>{provider.providerName}</strong>

                        <span>
                          {provider.programs} program
                          {provider.programs === 1 ? "" : "s"} ·{" "}
                          {provider.trainees} trainee
                          {provider.trainees === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    <div className="ai-trainee-metrics">
                      <div>
                        <span>Assessments</span>
                        <strong>{provider.assessments}</strong>
                      </div>

                      <div>
                        <span>Below target</span>
                        <strong>{provider.skillGapAssessments}</strong>
                      </div>
                    </div>

                    <div className="recommendation-box government-recommendation">
                      <span>→</span>
                      <div>
                        <strong>AI recommendation</strong>
                        <p>{provider.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
