export default function RecordAttendanceCard({
  trainees = [],
  selectedTrainee = "",
  onSelectTrainee,
  attendanceDate = "",
  onAttendanceDateChange,
  attendanceStatus = "PRESENT",
  onAttendanceStatusChange,
  onRecordAttendance,
  savingAttendance = false,
}) {
  return (
    <section className="provider-section">
      <div className="provider-section-header">
        <div>
          <h2>Record Attendance</h2>
          <p>Capture attendance evidence and keep trainee participation current.</p>
        </div>
      </div>
      <form className="provider-form two" onSubmit={onRecordAttendance}>
        <div className="provider-field full">
          <label>Trainee <span className="required-star">*</span></label>
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
          <label>Date <span className="required-star">*</span></label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => onAttendanceDateChange(e.target.value)}
            required
          />
        </div>
        <div className="provider-field">
          <label>Status</label>
          <select
            value={attendanceStatus}
            onChange={(e) => onAttendanceStatusChange(e.target.value)}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
          </select>
        </div>
        <div className="provider-form-actions">
          <button
            className="provider-primary-button"
            type="submit"
            disabled={savingAttendance}
          >
            {savingAttendance ? "Saving..." : "Record Attendance"}
          </button>
        </div>
      </form>
    </section>
  );
}
