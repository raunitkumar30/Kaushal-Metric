export default function CreateBatchFormCard({
  programs = [],
  batchForm = {
    name: "",
    programId: "",
    capacity: "",
    startDate: "",
    endDate: "",
  },
  onBatchFormChange,
  onCreateBatch,
  savingBatch = false,
}) {
  return (
    <section className="provider-section">
      <div className="provider-section-header">
        <div>
          <h2>Create Training Batch</h2>
          <p>Create a delivery batch under one of your assigned training programs.</p>
        </div>
        <span className="provider-count">New</span>
      </div>

      {programs.length ? (
        <form className="provider-form" onSubmit={onCreateBatch}>
          <div className="provider-field">
            <label htmlFor="batch-name">Batch name</label>
            <input
              id="batch-name"
              name="name"
              type="text"
              value={batchForm.name}
              onChange={onBatchFormChange}
              placeholder="e.g. Digital Skills Batch 2026-B"
              required
            />
          </div>

          <div className="provider-field">
            <label htmlFor="batch-program">Training program</label>
            <select
              id="batch-program"
              name="programId"
              value={batchForm.programId}
              onChange={onBatchFormChange}
              required
            >
              <option value="">Select program</option>
              {programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div className="provider-field">
            <label htmlFor="batch-capacity">Capacity</label>
            <input
              id="batch-capacity"
              name="capacity"
              type="number"
              min="1"
              step="1"
              value={batchForm.capacity}
              onChange={onBatchFormChange}
              placeholder="30"
              required
            />
          </div>

          <div className="provider-field">
            <label htmlFor="batch-start-date">Start date</label>
            <input
              id="batch-start-date"
              name="startDate"
              type="date"
              value={batchForm.startDate}
              onChange={onBatchFormChange}
              required
            />
          </div>

          <div className="provider-field">
            <label htmlFor="batch-end-date">End date</label>
            <input
              id="batch-end-date"
              name="endDate"
              type="date"
              value={batchForm.endDate}
              onChange={onBatchFormChange}
              required
            />
          </div>

          <div className="provider-field">
            <label>Status</label>
            <input type="text" value="UPCOMING" disabled />
          </div>

          <div className="provider-form-actions">
            <button
              className="provider-primary-button"
              type="submit"
              disabled={savingBatch}
            >
              {savingBatch ? "Creating..." : "Create Batch"}
            </button>
          </div>
        </form>
      ) : (
        <div className="empty-provider">
          No training programs are assigned to this provider yet. Ask Government to create or assign a program first.
        </div>
      )}
    </section>
  );
}
