import React from "react";

export function AIGuidanceCard({ skillGap, analyzing, onAnalyze }) {
  return (
    <section className="trainee-card ai-guidance-card">
      <div className="ai-guidance-header">
        <div className="ai-title-wrap">
          <div className="ai-spark">✦</div>
          <div>
            <span className="eyebrow">AI GUIDANCE</span>
            <h2>Recommended For You</h2>
            <p>
              Compare your current skills with the requirements of your
              training program and get actionable guidance.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onAnalyze}
          disabled={analyzing}
        >
          {analyzing ? "Analyzing..." : "Analyze My Skill Gaps"}
        </button>
      </div>

      {analyzing && (
        <div className="ai-loading">
          <div className="trainee-spinner small-spinner" />
          <span>
            AI is analyzing your current skills against the program
            requirements...
          </span>
        </div>
      )}

      {!skillGap && !analyzing && (
        <div className="ai-empty">
          <div className="ai-empty-icon">✦</div>
          <div>
            <strong>Get personalized skill guidance</strong>
            <p>
              Run an analysis to see which skills need improvement, why
              they matter and what you can do next.
            </p>
          </div>
        </div>
      )}

      {skillGap && (
        <div className="ai-results">
          <div className="ai-results-top">
            <div>
              <span className="eyebrow">AI ANALYSIS</span>
              <h3>{skillGap.program?.name || "Training Program"}</h3>
            </div>
            <span className="analysis-date">
              Analysis completed
            </span>
          </div>

          <div className="ai-skill-grid">
            {skillGap.analysis?.skills?.map((item) => (
              <article
                className={`ai-skill-result ${
                  String(item.priority || "").toLowerCase()
                }`}
                key={item.skill}
              >
                <div className="ai-skill-result-head">
                  <div>
                    <strong>{item.skill}</strong>
                    <span>
                      {item.current_level === null ||
                      item.current_level === undefined
                        ? "Assessment required"
                        : `Current level ${item.current_level}/100`}
                    </span>
                  </div>
                  <span className="priority-badge">
                    {item.priority}
                  </span>
                </div>

                <div className="ai-comparison">
                  <div>
                    <span>Current</span>
                    <strong>
                      {item.current_level === null ||
                      item.current_level === undefined
                        ? "—"
                        : item.current_level}
                    </strong>
                  </div>
                  <div>
                    <span>Target</span>
                    <strong>{item.target_level}</strong>
                  </div>
                  <div>
                    <span>Gap</span>
                    <strong>
                      {item.gap === null || item.gap === undefined
                        ? "—"
                        : item.gap}
                    </strong>
                  </div>
                </div>

                <div className="ai-explanation">
                  <span>Why</span>
                  <p>{item.explanation}</p>
                </div>

                <div className="ai-recommendation">
                  <span>Recommended action</span>
                  <p>{item.recommendation}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AIGuidanceCard;
