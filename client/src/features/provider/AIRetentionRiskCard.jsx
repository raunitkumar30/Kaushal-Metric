import { useState, useEffect } from "react";

const getRiskClass = (level) => {
  const value = String(level || "").toLowerCase();
  if (value === "high") return "high";
  if (value === "medium") return "medium";
  return "low";
};

export default function AIRetentionRiskCard({
  retentionRisk = null,
  analyzing = false,
  analyzingRetention = false,
  onUseAsIntervention,
  trainees = [],
  onAnalyzeRetentionRisk,
  selectedTrainee = "",
  onSelectTrainee,
}) {
  const isAnalyzing = analyzing || analyzingRetention;
  const [localTrainee, setLocalTrainee] = useState(
    selectedTrainee ||
      retentionRisk?.trainee?.id ||
      retentionRisk?.trainee?._id ||
      ""
  );

  useEffect(() => {
    if (selectedTrainee) {
      setLocalTrainee(selectedTrainee);
    } else if (retentionRisk?.trainee?.id || retentionRisk?.trainee?._id) {
      setLocalTrainee(
        retentionRisk.trainee.id || retentionRisk.trainee._id
      );
    }
  }, [selectedTrainee, retentionRisk]);

  const handleTraineeChange = (e) => {
    const val = e.target.value;
    setLocalTrainee(val);
    if (onSelectTrainee) onSelectTrainee(val);
  };

  const handleAnalyze = () => {
    if (localTrainee && onAnalyzeRetentionRisk) {
      onAnalyzeRetentionRisk(localTrainee);
    }
  };

  return (
    <section className="provider-section ai-focus">
      <div className="provider-section-header">
        <div>
          <h2>AI Retention / Dropout Risk</h2>
          <p>Combine attendance, assessments, and skill gaps to prioritize learner support.</p>
        </div>
      </div>

      {trainees.length > 0 && onAnalyzeRetentionRisk && (
        <div className="ai-card-controls">
          <select
            value={localTrainee}
            onChange={handleTraineeChange}
            className="ai-card-select"
            aria-label="Select trainee for retention risk analysis"
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
          <span>AI is analyzing retention risk...</span>
        </div>
      )}

      {!retentionRisk && !isAnalyzing && (
        <div className="ai-initial-hint">
          Select a trainee above or launch from the Trainees table.
        </div>
      )}
      {retentionRisk && (
        <div className="provider-ai-result">
          <h3>{retentionRisk.trainee?.name}</h3>
          <div className="risk-panel">
            <div className="risk-header-row">
              <div
                className={`risk-score ${getRiskClass(
                  retentionRisk.analysis?.risk_level
                )}`}
              >
                <div>
                  <strong>{retentionRisk.analysis?.risk_score}</strong>
                  <span>/ 100</span>
                </div>
              </div>
              <div className="risk-meta">
                <span
                  className={`risk-level ${getRiskClass(
                    retentionRisk.analysis?.risk_level
                  )}`}
                >
                  {retentionRisk.analysis?.risk_level} RISK
                </span>
                <span className="risk-status-note">
                  {retentionRisk.analysis?.risk_level === "HIGH"
                    ? "Critical intervention needed"
                    : retentionRisk.analysis?.risk_level === "MEDIUM"
                    ? "Monitor and support"
                    : "Low risk profile"}
                </span>
              </div>
            </div>

            <div className="risk-details">
              <h4>Why this risk was detected</h4>
              {retentionRisk.analysis?.reasons?.length ? (
                retentionRisk.analysis.reasons.map((reason, index) => (
                  <p key={index} className="risk-reason-item">{reason}</p>
                ))
              ) : (
                <p>No major retention-risk factors were detected.</p>
              )}
              <div className="ai-inputs-summary">
                <strong>Inputs:</strong> attendance{" "}
                {retentionRisk.inputs?.attendancePercentage}%, assessment avg{" "}
                {retentionRisk.inputs?.assessmentAverage}, skills with gaps{" "}
                {retentionRisk.inputs?.skillsWithGaps}/
                {retentionRisk.inputs?.totalSkills}.
              </div>
              <div className="ai-recommendation-box">
                <strong>AI Recommendation:</strong>
                <p>{retentionRisk.analysis?.recommendation}</p>
              </div>
              <button
                className="provider-primary-button"
                type="button"
                style={{ width: "100%", marginTop: 8 }}
                onClick={onUseAsIntervention}
              >
                Use Recommendation as Intervention
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
