import { useState, useEffect } from "react";

export default function AISkillGapAnalysisCard({
  skillGap = null,
  analyzing = false,
  analyzingSkillGap = false,
  onUseAsIntervention,
  trainees = [],
  onAnalyzeSkillGap,
  selectedTrainee = "",
  onSelectTrainee,
}) {
  const isAnalyzing = analyzing || analyzingSkillGap;
  const [localTrainee, setLocalTrainee] = useState(
    selectedTrainee || skillGap?.trainee?.id || skillGap?.trainee?._id || ""
  );

  useEffect(() => {
    if (selectedTrainee) {
      setLocalTrainee(selectedTrainee);
    } else if (skillGap?.trainee?.id || skillGap?.trainee?._id) {
      setLocalTrainee(skillGap.trainee.id || skillGap.trainee._id);
    }
  }, [selectedTrainee, skillGap]);

  const handleTraineeChange = (e) => {
    const val = e.target.value;
    setLocalTrainee(val);
    if (onSelectTrainee) onSelectTrainee(val);
  };

  const handleAnalyze = () => {
    if (localTrainee && onAnalyzeSkillGap) {
      onAnalyzeSkillGap(localTrainee);
    }
  };

  return (
    <section className="provider-section ai-focus">
      <div className="provider-section-header">
        <div>
          <h2>AI Skill Gap Analysis</h2>
          <p>Understand which required skills need evidence or additional development.</p>
        </div>
      </div>

      {trainees.length > 0 && onAnalyzeSkillGap && (
        <div className="ai-card-controls">
          <select
            value={localTrainee}
            onChange={handleTraineeChange}
            className="ai-card-select"
            aria-label="Select trainee for skill gap analysis"
          >
            <option value="">Select trainee...</option>
            {trainees.map((trainee) => (
              <option key={trainee._id} value={trainee._id}>
                {trainee.name}
              </option>
            ))}
          </select>
          <button
            className="ai-card-run-btn"
            type="button"
            disabled={isAnalyzing || !localTrainee}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="ai-analyzing-indicator">
          <span className="provider-spinner small" />
          <span>AI is analyzing skill gaps...</span>
        </div>
      )}

      {!skillGap && !isAnalyzing && (
        <div className="ai-initial-hint">
          Select a trainee above or launch from the Trainees table.
        </div>
      )}
      {skillGap && (
        <div className="provider-ai-result">
          <h3>{skillGap.trainee?.name}</h3>
          <p className="ai-program-label">Program: {skillGap.program?.name}</p>
          <div className="ai-skill-grid">
            {skillGap.analysis?.skills?.map((item) => (
              <article className="ai-skill-card" key={item.skill}>
                <div className="ai-skill-header">
                  <h4>{item.skill}</h4>
                  <span
                    className={`ai-priority ${
                      item.priority === "ASSESSMENT_REQUIRED"
                        ? "assessment"
                        : String(item.priority || "").toLowerCase()
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="ai-value-row">
                  <span>Target</span>
                  <strong>{item.target_level}</strong>
                </div>
                <div className="ai-value-row">
                  <span>Current</span>
                  <strong>
                    {item.current_level === null ? "Not assessed" : item.current_level}
                  </strong>
                </div>
                <div className="ai-value-row">
                  <span>Gap</span>
                  <strong>{item.gap === null ? "Not available" : item.gap}</strong>
                </div>
                <p className="ai-skill-why">
                  <strong>Why:</strong> {item.explanation}
                </p>
                <div className="ai-recommendation-box">
                  <strong>Recommendation:</strong>
                  <p>{item.recommendation}</p>
                </div>
                <button
                  className="provider-primary-button"
                  type="button"
                  style={{ width: "100%", marginTop: 8 }}
                  onClick={() => onUseAsIntervention && onUseAsIntervention(item)}
                >
                  Use as Intervention
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
