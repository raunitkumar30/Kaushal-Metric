const getPriorityClass = (priority) => {
  const value = String(priority || "").toUpperCase();
  if (value === "HIGH") return "priority priority-high";
  if (value === "MEDIUM") return "priority priority-medium";
  if (value === "LOW") return "priority priority-low";
  return "priority priority-required";
};

export default function AISkillGapAnalysisCard({
  skillGap = null,
  analyzing = false,
}) {
  return (
    <section id="ai-skill-gap" className="ai-section">
      <div className="ai-section-header">
        <div>
          <div className="ai-label">
            <span>✦</span>
            AI ANALYSIS
          </div>

          <h2>Skill Gap Intelligence</h2>

          <p>
            Identify missing skills against the target requirements of a
            training program.
          </p>
        </div>

        {analyzing && (
          <div className="ai-processing">
            <span className="processing-dot" />
            AI is analyzing...
          </div>
        )}
      </div>

      {!skillGap && !analyzing && (
        <div className="ai-placeholder">
          <div className="placeholder-icon">✦</div>

          <div>
            <h3>No trainee selected for analysis</h3>

            <p>
              Select a trainee above and run AI Skill Gap Analysis to see
              evidence-based recommendations.
            </p>
          </div>
        </div>
      )}

      {analyzing && (
        <div className="ai-placeholder">
          <div className="ai-loader">
            <span />
            <span />
            <span />
          </div>

          <div>
            <h3>Analyzing trainee skills</h3>

            <p>
              Comparing recorded skills with the program's target skill
              requirements.
            </p>
          </div>
        </div>
      )}

      {skillGap && (
        <div className="skill-analysis">
          <div className="analysis-header">
            <div>
              <div className="analysis-person">
                <div className="large-avatar">
                  {skillGap.trainee?.name?.charAt(0)?.toUpperCase() || "T"}
                </div>

                <div>
                  <h3>{skillGap.trainee?.name}</h3>
                  <p>{skillGap.program?.name || "Program unavailable"}</p>
                </div>
              </div>
            </div>

            <div className="analysis-summary">
              <span>Skills analyzed</span>
              <strong>{skillGap.analysis?.skills?.length || 0}</strong>
            </div>
          </div>

          <div className="skill-analysis-grid">
            {skillGap.analysis?.skills?.map((item) => {
              const currentLevel =
                item.current_level == null
                  ? null
                  : Number(item.current_level);
              const targetLevel = Number(item.target_level || 0);
              const gap = item.gap == null ? null : Number(item.gap);
              const progress =
                currentLevel == null
                  ? 0
                  : Math.min(currentLevel, 100);

              return (
                <div className="skill-analysis-card" key={item.skill}>
                  <div className="skill-card-top">
                    <div>
                      <h4>{item.skill}</h4>
                      <span>Target level {targetLevel}</span>
                    </div>

                    <span className={getPriorityClass(item.priority)}>
                      {item.priority}
                    </span>
                  </div>

                  <div className="skill-progress">
                    <div className="skill-progress-header">
                      <span>Current level</span>
                      <strong>
                        {currentLevel == null ? "Not assessed" : currentLevel}
                      </strong>
                    </div>

                    <div className="skill-track">
                      <div
                        className="skill-fill"
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="target-marker"
                        style={{
                          left: `${Math.min(targetLevel, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="skill-gap-number">
                    <span>Skill gap</span>
                    <strong>{gap == null ? "—" : gap}</strong>
                  </div>

                  <div className="why-box">
                    <span className="why-icon">?</span>
                    <div>
                      <strong>Why</strong>
                      <p>
                        {item.explanation || "No explanation available."}
                      </p>
                    </div>
                  </div>

                  <div className="recommendation-box">
                    <span>→</span>
                    <div>
                      <strong>Recommendation</strong>
                      <p>
                        {item.recommendation || "No recommendation available."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
