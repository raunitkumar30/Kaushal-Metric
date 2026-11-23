export default function CreateProgramCard({
  providers = [],
  programForm = {
    name: "",
    sector: "",
    description: "",
    providerId: "",
    durationWeeks: "",
    targetSkills: "",
  },
  onProgramFormChange,
  onCreateProgram,
  programCreating = false,
  programCreateMessage = "",
  programCreateError = "",
}) {
  return (
    <section id="create-program" className="dashboard-card program-create-card">
      <div className="card-header">
        <div>
          <div className="section-kicker">PROGRAM MANAGEMENT</div>
          <h2>Create Training Program</h2>
          <p>
            Create a government-funded program and assign it to a registered
            training provider.
          </p>
        </div>
        <span className="ai-badge">GOVERNMENT</span>
      </div>

      {programCreateMessage && (
        <div className="alert alert-success">
          <div className="alert-icon">✓</div>
          <div>
            <strong>Program created</strong>
            <p>{programCreateMessage}</p>
          </div>
        </div>
      )}

      {programCreateError && (
        <div className="alert alert-error">
          <div className="alert-icon">!</div>
          <div>
            <strong>Program creation failed</strong>
            <p>{programCreateError}</p>
          </div>
        </div>
      )}

      {providers.length === 0 ? (
        <div className="empty-state">
          <span>◎</span>
          <p>
            No registered training providers are available. Create a provider
            before creating a program.
          </p>
        </div>
      ) : (
        <form className="form-grid" onSubmit={onCreateProgram}>
          <div className="form-field">
            <label htmlFor="program-name">Program name <span className="required-star">*</span></label>
            <input
              id="program-name"
              name="name"
              value={programForm.name}
              onChange={onProgramFormChange}
              placeholder="e.g. Digital Skills Development Program"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="program-sector">Sector <span className="required-star">*</span></label>
            <input
              id="program-sector"
              name="sector"
              value={programForm.sector}
              onChange={onProgramFormChange}
              placeholder="e.g. Information Technology"
              required
            />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="program-description">Description</label>
            <textarea
              id="program-description"
              name="description"
              value={programForm.description}
              onChange={onProgramFormChange}
              placeholder="Describe the training program and intended learner outcome."
              rows="3"
            />
          </div>

          <div className="form-field">
            <label htmlFor="program-provider">Training provider <span className="required-star">*</span></label>
            <select
              id="program-provider"
              name="providerId"
              value={programForm.providerId}
              onChange={onProgramFormChange}
              required
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="program-duration">Duration (weeks)</label>
            <input
              id="program-duration"
              name="durationWeeks"
              type="number"
              min="1"
              max="104"
              value={programForm.durationWeeks}
              onChange={onProgramFormChange}
              placeholder="e.g. 12"
            />
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="program-skills">Target skills</label>
            <input
              id="program-skills"
              name="targetSkills"
              value={programForm.targetSkills}
              onChange={onProgramFormChange}
              placeholder="e.g. Web Development, JavaScript, Database Management"
            />
            <small>
              Separate skills with commas. They become the program's target skill
              list for later AI analysis.
            </small>
          </div>

          <div className="form-actions form-field-wide">
            <button
              type="submit"
              className="primary-button"
              disabled={programCreating}
            >
              {programCreating ? "Creating Program..." : "Create Program"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
