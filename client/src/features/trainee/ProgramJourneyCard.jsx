import React from "react";

export function ProgramJourneyCard({
  program,
  batch,
  traineeStatus,
  skillProgress = 0,
  completedSkills = 0,
  totalSkills = 0,
  formatDate,
}) {
  return (
    <article className="trainee-card journey-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">MY PROGRAM</span>
          <h2>{program?.name || "My Training Program"}</h2>
        </div>
        <span
          className={`status-badge ${String(traineeStatus || "").toLowerCase()}`}
        >
          {traineeStatus || "ENROLLED"}
        </span>
      </div>

      <div className="journey-content">
        <div className="journey-main">
          <div className="program-meta">
            <div>
              <span>Provider</span>
              <strong>
                {batch?.providerId?.name || "Training provider"}
              </strong>
            </div>
            <div>
              <span>Batch</span>
              <strong>{batch?.name || "Assigned batch"}</strong>
            </div>
            <div>
              <span>Duration</span>
              <strong>
                {program?.durationWeeks
                  ? `${program.durationWeeks} weeks`
                  : "In progress"}
              </strong>
            </div>
          </div>

          <div className="journey-progress">
            <div className="progress-label">
              <span>Skill progress</span>
              <strong>{skillProgress}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${skillProgress}%` }}
              />
            </div>
            <p>
              {completedSkills} of {totalSkills || 0} recorded skills are
              currently at or above the target level.
            </p>
          </div>
        </div>

        <div className="journey-dates">
          <div>
            <span>Start date</span>
            <strong>
              {formatDate ? formatDate(batch?.startDate) : batch?.startDate}
            </strong>
          </div>
          <div>
            <span>End date</span>
            <strong>
              {formatDate ? formatDate(batch?.endDate) : batch?.endDate}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProgramJourneyCard;
