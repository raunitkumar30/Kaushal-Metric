export default function OutcomeCoverageCard({
  outcomeMetrics = {
    outcomeCoverage: 0,
    outcomeTrainees: 0,
    employed: 0,
    seeking: 0,
    unemployed: 0,
    unknown: 0,
  },
  traineesCount = 0,
}) {
  return (
    <div className="dashboard-card compact-card outcome-card">
      <div className="card-header">
        <div>
          <h2>Outcome Coverage</h2>
          <p>Trainees with a recorded employment outcome.</p>
        </div>

        <span className="mini-number">
          {outcomeMetrics.outcomeCoverage}%
        </span>
      </div>

      <div className="batch-summary">
        <div className="batch-big-number">
          {outcomeMetrics.outcomeCoverage}%
        </div>

        <div>
          <strong>
            {outcomeMetrics.outcomeTrainees} of {traineesCount} trainees covered
          </strong>

          <span>Recorded outcome coverage</span>
        </div>
      </div>

      <div className="status-breakdown">
        {[
          ["EMPLOYED", outcomeMetrics.employed],
          ["SEEKING", outcomeMetrics.seeking],
          ["UNEMPLOYED", outcomeMetrics.unemployed],
          ["UNKNOWN", outcomeMetrics.unknown],
        ].map(([status, count]) => (
          <div className="breakdown-row" key={status}>
            <span>{status}</span>

            <div className="breakdown-track">
              <div
                className="breakdown-fill"
                style={{
                  width: `${
                    outcomeMetrics.outcomeTrainees
                      ? (count / outcomeMetrics.outcomeTrainees) * 100
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
  );
}
