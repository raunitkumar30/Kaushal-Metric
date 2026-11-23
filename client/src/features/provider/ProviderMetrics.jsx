import {
  IconBatch,
  IconTrainee,
  IconGrid,
  IconOutcome,
} from "../../components/icons/DashboardIcons";

export default function ProviderMetrics({
  batchesCount = 0,
  activeBatches = 0,
  traineesCount = 0,
  totalCapacity = 0,
  averageAttendance = 0,
  certifiedTrainees = 0,
  employmentRecords = 0,
}) {
  return (
    <section className="provider-metrics">
      <article className="provider-metric">
        <div className="provider-metric-icon blue">
          <IconBatch size={22} strokeWidth={2} />
        </div>
        <div className="provider-metric-content">
          <p className="provider-metric-label">Total Batches</p>
          <p className="provider-metric-value">{batchesCount}</p>
          <p className="provider-metric-note">{activeBatches} currently active</p>
        </div>
      </article>

      <article className="provider-metric">
        <div className="provider-metric-icon cyan">
          <IconTrainee size={22} strokeWidth={2} />
        </div>
        <div className="provider-metric-content">
          <p className="provider-metric-label">Trainees</p>
          <p className="provider-metric-value">{traineesCount}</p>
          <p className="provider-metric-note">Across assigned batches</p>
        </div>
      </article>

      <article className="provider-metric">
        <div className="provider-metric-icon purple">
          <IconGrid size={22} strokeWidth={2} />
        </div>
        <div className="provider-metric-content">
          <p className="provider-metric-label">Capacity</p>
          <p className="provider-metric-value">{Number(totalCapacity || 0).toLocaleString()}</p>
          <p className="provider-metric-note">Total seats across batches</p>
        </div>
      </article>

      <article className="provider-metric">
        <div className="provider-metric-icon green">
          <IconOutcome size={22} strokeWidth={2} />
        </div>
        <div className="provider-metric-content">
          <p className="provider-metric-label">Avg. Attendance</p>
          <p className="provider-metric-value">{averageAttendance}%</p>
          <p className="provider-metric-note">
            {certifiedTrainees} certified · {employmentRecords} employed
          </p>
        </div>
      </article>
    </section>
  );
}
