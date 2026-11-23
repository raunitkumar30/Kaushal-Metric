export default function AIRiskSignalsCard({
  aiInsights = null,
  aiLoading = false,
  onLoadAIInsights,
}) {
  return (
    <div className="dashboard-card risk-summary">
      <div className="card-header">
        <div>
          <div className="ai-title">
            <span className="ai-spark small">✦</span>
            <h2>AI Risk Signals</h2>
          </div>

          <p>Learners requiring attention.</p>
        </div>

        {aiInsights && (
          <span className="live-indicator">
            <span />
            Live
          </span>
        )}
      </div>

      {!aiInsights ? (
        <div className="ai-empty">
          <div className="ai-empty-icon">✦</div>

          <h3>AI analysis not generated</h3>

          <p>
            Run AI analysis to identify retention and employment risks.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={onLoadAIInsights}
            disabled={aiLoading}
          >
            {aiLoading ? "Analyzing..." : "Analyze now"}
          </button>
        </div>
      ) : (
        <div className="risk-list">
          <div className="risk-row">
            <div className="risk-row-left">
              <span className="risk-dot danger" />

              <div>
                <strong>High retention risk</strong>
                <span>Trainees at risk of dropping out</span>
              </div>
            </div>

            <strong className="risk-number">
              {aiInsights.overview?.highRetentionRisk ?? 0}
            </strong>
          </div>

          <div className="risk-row">
            <div className="risk-row-left">
              <span className="risk-dot warning" />

              <div>
                <strong>Medium retention risk</strong>
                <span>Trainees needing monitoring</span>
              </div>
            </div>

            <strong className="risk-number">
              {aiInsights.overview?.mediumRetentionRisk ?? 0}
            </strong>
          </div>

          <div className="risk-row">
            <div className="risk-row-left">
              <span className="risk-dot danger" />

              <div>
                <strong>High employment risk</strong>
                <span>Learners needing placement support</span>
              </div>
            </div>

            <strong className="risk-number">
              {aiInsights.overview?.highEmploymentRisk ?? 0}
            </strong>
          </div>

          <div className="risk-row">
            <div className="risk-row-left">
              <span className="risk-dot warning" />

              <div>
                <strong>Medium employment risk</strong>
                <span>Learners requiring placement monitoring</span>
              </div>
            </div>

            <strong className="risk-number">
              {aiInsights.overview?.mediumEmploymentRisk ?? 0}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
