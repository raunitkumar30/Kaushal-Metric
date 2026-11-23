export default function RecordAssessmentCard({
  trainees = [],
  selectedTrainee = "",
  onTraineeChange,
  assessmentSkill = "",
  onSkillChange,
  availableAssessmentSkills = [],
  assessmentScore = "",
  onScoreChange,
  assessmentAssessor = "",
  onAssessorChange,
  assessmentDate = "",
  onDateChange,
  onRecordAssessment,
  savingAssessment = false,
}) {
  return (
    <section className="provider-section">
      <div className="provider-section-header">
        <div>
          <h2>Record Assessment</h2>
          <p>Record a score against one of the trainee's program target skills.</p>
        </div>
      </div>
      <form className="provider-form two" onSubmit={onRecordAssessment}>
        <div className="provider-field">
          <label>Trainee <span className="required-star">*</span></label>
          <select
            value={selectedTrainee}
            onChange={onTraineeChange}
            required
          >
            <option value="">Select trainee</option>
            {trainees.map((trainee) => (
              <option key={trainee._id} value={trainee._id}>
                {trainee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="provider-field">
          <label>Skill <span className="required-star">*</span></label>
          <select
            value={assessmentSkill}
            onChange={(e) => onSkillChange(e.target.value)}
            disabled={
              !selectedTrainee || availableAssessmentSkills.length === 0
            }
            required
          >
            <option value="">
              {selectedTrainee
                ? availableAssessmentSkills.length
                  ? "Select skill"
                  : "No program skills available"
                : "Select trainee first"}
            </option>
            {availableAssessmentSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="provider-field">
          <label>Score <span className="required-star">*</span></label>
          <input
            type="number"
            min="0"
            max="100"
            value={assessmentScore}
            onChange={(e) => onScoreChange(e.target.value)}
            placeholder="0-100"
            required
          />
        </div>
        <div className="provider-field">
          <label>Assessor</label>
          <input
            type="text"
            value={assessmentAssessor}
            onChange={(e) => onAssessorChange(e.target.value)}
            placeholder="Assessor name"
          />
        </div>
        <div className="provider-field full">
          <label>Assessment Date <span className="required-star">*</span></label>
          <input
            type="date"
            value={assessmentDate}
            onChange={(e) => onDateChange(e.target.value)}
            required
          />
        </div>
        <div className="provider-form-actions">
          <button
            className="provider-primary-button"
            type="submit"
            disabled={
              savingAssessment ||
              !selectedTrainee ||
              availableAssessmentSkills.length === 0
            }
          >
            {savingAssessment ? "Saving..." : "Record Assessment"}
          </button>
        </div>
      </form>
    </section>
  );
}
