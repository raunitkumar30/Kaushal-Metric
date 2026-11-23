export default function InterventionFormCard({
  trainees = [],
  selectedTrainee = "",
  onSelectTrainee,
  interventionType = "SKILL_TRAINING",
  onTypeChange,
  interventionReason = "",
  onReasonChange,
  interventionAction = "",
  onActionChange,
  interventionAssignedTo = "",
  onAssignedToChange,
  onCreateIntervention,
  savingIntervention = false,
}) {
  return (
    <section className="provider-section" id="ai-intervention-form">
      <div className="provider-section-header">
        <div>
          <h2>AI Recommended Interventions</h2>
          <p>Record the action taken after an AI risk or skill-gap finding.</p>
        </div>
      </div>
      <form className="provider-form two" onSubmit={onCreateIntervention}>
        <div className="provider-field">
          <label>Trainee</label>
          <select
            value={selectedTrainee}
            onChange={(e) => onSelectTrainee(e.target.value)}
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
          <label>Intervention Type</label>
          <select
            value={interventionType}
            onChange={(e) => onTypeChange(e.target.value)}
            required
          >
            <option value="SKILL_TRAINING">Skill Training</option>
            <option value="MENTORING">Mentoring</option>
            <option value="ATTENDANCE_SUPPORT">Attendance Support</option>
            <option value="PLACEMENT_SUPPORT">Placement Support</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="provider-field full">
          <label>Reason</label>
          <textarea
            value={interventionReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Why is this intervention required?"
            required
          />
        </div>
        <div className="provider-field full">
          <label>Action</label>
          <textarea
            value={interventionAction}
            onChange={(e) => onActionChange(e.target.value)}
            placeholder="What action will be taken?"
            required
          />
        </div>
        <div className="provider-field full">
          <label>Assigned To</label>
          <input
            type="text"
            value={interventionAssignedTo}
            onChange={(e) => onAssignedToChange(e.target.value)}
            placeholder="Trainer, mentor or placement officer"
          />
        </div>
        <div className="provider-form-actions">
          <button
            className="provider-primary-button"
            type="submit"
            disabled={savingIntervention}
          >
            {savingIntervention ? "Saving..." : "Create Intervention"}
          </button>
        </div>
      </form>
    </section>
  );
}
