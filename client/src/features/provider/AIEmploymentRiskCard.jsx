import { useState, useEffect } from "react";

const getRiskClass = (level) => {
  const value = String(level || "").toLowerCase();
  if (value === "high") return "high";
  if (value === "medium") return "medium";
  return "low";
};

export default function AIEmploymentRiskCard({
  employmentRisk = null,
  analyzing = false,
  analyzingEmployment = false,
  onUseAsIntervention,
  trainees = [],
  onAnalyzeEmploymentRisk,
  selectedTrainee = "",
  onSelectTrainee,
}) {
  const isAnalyzing = analyzing || analyzingEmployment;
  const [localTrainee, setLocalTrainee] = useState(
    selectedTrainee ||
      employmentRisk?.trainee?.id ||
      employmentRisk?.trainee?._id ||
      ""
  );

  useEffect(() => {
    if (selectedTrainee) {
      setLocalTrainee(selectedTrainee);
    } else if (employmentRisk?.trainee?.id || employmentRisk?.trainee?._id) {
      setLocalTrainee(
        employmentRisk.trainee.id || employmentRisk.trainee._id
      );
    }
  }, [selectedTrainee, employmentRisk]);

  const handleTraineeChange = (e) => {
    const val = e.target.value;
    setLocalTrainee(val);
    if (onSelectTrainee) onSelectTrainee(val);
  };

  const handleAnalyze = () => {
    if (localTrainee && onAnalyzeEmploymentRisk) {
      onAnalyzeEmploymentRisk(localTrainee);
    }
  };

  return (
    <section className="provider-section ai-focus">
      <div className="provider-section-header">
        <div>
          <h2>AI Employment / Placement Risk</h2>
          <p>Identify job-readiness barriers and turn the AI recommendation into provider action.</p>
        </div>
      </div>

      {trainees.length > 0 && onAnalyzeEmploymentRisk && (
        <div className="ai-card-controls">
          <select
            value={localTrainee}
            onChange={handleTraineeChange}
            className="ai-card-select"
            aria-label="Select trainee for employment risk analysis"
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
          <span>AI is analyzing employment risk...</span>
        </div>
      )}

      {!employmentRisk && !isAnalyzing && (
        <div className="ai-initial-hint">
          Select a trainee above or launch from the Trainees table.
        </div>
      )}
      {employmentRisk && (
        <div className="provider-ai-result">
          <h3>{employmentRisk.trainee?.name}</h3>
          <div className="risk-panel">
            <div className="risk-header-row">
              <div
                className={`risk-score ${getRiskClass(
                  employmentRisk.analysis?.risk_level
                )}`}
              >
                <div>
                  <strong>{employmentRisk.analysis?.risk_score}</strong>
                  <span>/ 100</span>
                </div>
              </div>
              <div className="risk-meta">
                <span
                  className={`risk-level ${getRiskClass(
                    employmentRisk.analysis?.risk_level
                  )}`}
                >
                  {employmentRisk.analysis?.risk_level} RISK
                </span>
                <span className="risk-status-note">
                  {employmentRisk.analysis?.risk_level === "HIGH"
                    ? "Placement support required"
                    : employmentRisk.analysis?.risk_level === "MEDIUM"
                    ? "Targeted coaching advised"
                    : "On track for placement"}
                </span>
              </div>
            </div>

            <div className="risk-details">
              <h4>Why this risk was detected</h4>
              {employmentRisk.analysis?.reasons?.length ? (
                employmentRisk.analysis.reasons.map((reason, index) => (
                  <p key={index} className="risk-reason-item">{reason}</p>
                ))
              ) : (
                <p>No major employment-risk factors were detected.</p>
              )}
              <div className="ai-inputs-summary">
                <strong>Inputs:</strong> assessment avg{" "}
                {employmentRisk.inputs?.assessmentAverage}, attendance{" "}
                {employmentRisk.inputs?.attendancePercentage}%, gaps{" "}
                {employmentRisk.inputs?.skillsWithGaps}/
                {employmentRisk.inputs?.totalSkills}, certified{" "}
                {employmentRisk.inputs?.certified ? "Yes" : "No"}, status{" "}
                {employmentRisk.inputs?.employmentStatus}.
              </div>
              <div className="ai-recommendation-box">
                <strong>AI Recommendation:</strong>
                <p>{employmentRisk.analysis?.recommendation}</p>
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
