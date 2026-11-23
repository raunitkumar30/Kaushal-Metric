export default function EmploymentOutcomesCard({
  children,
  certificationsCard = null,
  employments = [],
  trainees = [],
  selectedTrainee = "",
  onSelectTrainee,
  employerName = "",
  onEmployerNameChange,
  jobTitle = "",
  onJobTitleChange,
  startingSalary = "",
  onStartingSalaryChange,
  currentSalary = "",
  onCurrentSalaryChange,
  salaryUpdatedDate = "",
  onSalaryUpdatedDateChange,
  employmentDate = "",
  onEmploymentDateChange,
  employmentStatus = "SEEKING",
  onEmploymentStatusChange,
  jobRelevance = "NOT_ASSESSED",
  onJobRelevanceChange,
  failureReason = "",
  onFailureReasonChange,
  evidenceType = "NOT_PROVIDED",
  onEvidenceTypeChange,
  evidenceReference = "",
  onEvidenceReferenceChange,
  verificationConfidence = "0",
  onVerificationConfidenceChange,
  verified = false,
  onVerifiedChange,
  onRecordEmployment,
  savingEmployment = false,
  employmentMessage = "",
}) {
  return (
    <>
      {(certificationsCard || children) && (
        <div className="provider-section-group">
          {certificationsCard || children}
        </div>
      )}

      <section className="provider-section" id="outcomes">
          <div className="provider-section-header">
            <div>
              <h2>Employment Outcomes</h2>
              <p>Post-training employment records for your trainees.</p>
            </div>
            <span className="provider-count">{employments.length}</span>
          </div>
          <div className="provider-list">
            {employments.length ? (
              employments.map((employment) => (
                <div className="provider-list-card" key={employment._id}>
                  <h3>{employment.traineeId?.name || "Trainee"}</h3>
                  <p>
                    <strong>Employer:</strong> {employment.employerName}
                  </p>
                  <p>
                    <strong>Job:</strong> {employment.jobTitle}
                  </p>
                  {employment.startingSalary !== undefined &&
                    employment.startingSalary !== null && (
                      <p>
                        <strong>Starting salary:</strong>{" "}
                        {Number(employment.startingSalary).toLocaleString()}
                      </p>
                    )}
                  {employment.currentSalary !== undefined &&
                    employment.currentSalary !== null && (
                      <p>
                        <strong>Current salary:</strong>{" "}
                        {Number(employment.currentSalary).toLocaleString()}
                      </p>
                    )}
                  {employment.salaryUpdatedDate && (
                    <p>
                      <strong>Salary updated:</strong>{" "}
                      {new Date(
                        employment.salaryUpdatedDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    <strong>Status:</strong> {employment.status}
                  </p>
                  <p>
                    <strong>Job relevance:</strong>{" "}
                    {employment.jobRelevance || "Not assessed"}
                  </p>
                  {employment.failureReason && (
                    <p>
                      <strong>Failure reason:</strong>{" "}
                      {employment.failureReason}
                    </p>
                  )}
                  <p>
                    <strong>Evidence:</strong>{" "}
                    {employment.evidenceType || "Not provided"}
                  </p>
                  {employment.evidenceReference && (
                    <p>
                      <strong>Evidence reference:</strong>{" "}
                      {employment.evidenceReference}
                    </p>
                  )}
                  <p>
                    <strong>Verification confidence:</strong>{" "}
                    {employment.verificationConfidence ?? 0}%
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {employment.verified ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Employment date:</strong>{" "}
                    {employment.employmentDate
                      ? new Date(employment.employmentDate).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              ))
            ) : (
              <div className="empty-provider">
                No employment outcomes recorded yet.
              </div>
            )}
          </div>
        </section>

        <section className="provider-section">
          <div className="provider-section-header">
            <div>
              <h2>Record Employment Outcome</h2>
              <p>Capture the trainee's current employment or placement status.</p>
            </div>
          </div>

          <form className="provider-form two" onSubmit={onRecordEmployment}>
            <div className="provider-field">
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
              <label>Employer Name <span className="required-star">*</span></label>
              <input
                type="text"
                value={employerName}
                onChange={(e) => onEmployerNameChange(e.target.value)}
                placeholder="e.g. Tech Solutions Pvt Ltd"
                required
              />
            </div>

            <div className="provider-field">
              <label>Job Title <span className="required-star">*</span></label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => onJobTitleChange(e.target.value)}
                placeholder="e.g. Junior Web Developer"
                required
              />
            </div>

            <div className="provider-field">
              <label>Employment Date <span className="required-star">*</span></label>
              <input
                type="date"
                value={employmentDate}
                onChange={(e) => onEmploymentDateChange(e.target.value)}
                required
              />
            </div>

            <div className="provider-field">
              <label>Starting Salary</label>
              <input
                type="number"
                min="0"
                value={startingSalary}
                onChange={(e) => onStartingSalaryChange(e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>

            <div className="provider-field">
              <label>Current Salary</label>
              <input
                type="number"
                min="0"
                value={currentSalary}
                onChange={(e) => onCurrentSalaryChange(e.target.value)}
                placeholder="e.g. 30000"
              />
            </div>

            <div className="provider-field">
              <label>Salary Updated Date</label>
              <input
                type="date"
                value={salaryUpdatedDate}
                onChange={(e) => onSalaryUpdatedDateChange(e.target.value)}
              />
            </div>

            <div className="provider-field">
              <label>Status</label>
              <select
                value={employmentStatus}
                onChange={(e) => onEmploymentStatusChange(e.target.value)}
              >
                <option value="EMPLOYED">EMPLOYED</option>
                <option value="SELF_EMPLOYED">SELF EMPLOYED</option>
                <option value="APPRENTICESHIP">APPRENTICESHIP</option>
                <option value="SEEKING">SEEKING</option>
                <option value="UNEMPLOYED">UNEMPLOYED</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </div>

            <div className="provider-field">
              <label>Job Relevance</label>
              <select
                value={jobRelevance}
                onChange={(e) => onJobRelevanceChange(e.target.value)}
              >
                <option value="NOT_ASSESSED">NOT ASSESSED</option>
                <option value="RELEVANT">RELEVANT</option>
                <option value="PARTIALLY_RELEVANT">PARTIALLY RELEVANT</option>
                <option value="NOT_RELEVANT">NOT RELEVANT</option>
              </select>
            </div>

            <div className="provider-field">
              <label>Evidence Type</label>
              <select
                value={evidenceType}
                onChange={(e) => onEvidenceTypeChange(e.target.value)}
              >
                <option value="NOT_PROVIDED">NOT PROVIDED</option>
                <option value="EMPLOYER_VERIFICATION">
                  EMPLOYER VERIFICATION
                </option>
                <option value="OFFER_LETTER">OFFER LETTER</option>
                <option value="APPOINTMENT_LETTER">APPOINTMENT LETTER</option>
                <option value="PAYSLIP">PAYSLIP</option>
                <option value="SELF_DECLARATION">SELF DECLARATION</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="provider-field">
              <label>Verification Confidence (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={verificationConfidence}
                onChange={(e) => onVerificationConfidenceChange(e.target.value)}
                placeholder="0-100"
              />
            </div>

            <div className="provider-field">
              <label>Verification</label>
              <select
                value={verified ? "VERIFIED" : "UNVERIFIED"}
                onChange={(e) =>
                  onVerifiedChange(e.target.value === "VERIFIED")
                }
              >
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="VERIFIED">VERIFIED</option>
              </select>
            </div>

            <div className="provider-field full">
              <label>Evidence Reference</label>
              <input
                type="text"
                value={evidenceReference}
                onChange={(e) => onEvidenceReferenceChange(e.target.value)}
                placeholder="Reference number, document name, or verification note"
              />
            </div>

            <div className="provider-field full">
              <label>Failure Reason</label>
              <textarea
                value={failureReason}
                onChange={(e) => onFailureReasonChange(e.target.value)}
                placeholder="Record why the expected employment outcome was not achieved, if applicable."
              />
            </div>

            <div className="provider-form-actions">
              <button
                className="provider-primary-button"
                type="submit"
                disabled={savingEmployment}
              >
                {savingEmployment
                  ? "Saving..."
                  : "Record Employment Outcome"}
              </button>
            </div>
          </form>

          {employmentMessage && (
            <div
              className="provider-message success"
              style={{ margin: "0 20px 20px" }}
            >
              {employmentMessage}
            </div>
          )}
        </section>
    </>
  );
}
