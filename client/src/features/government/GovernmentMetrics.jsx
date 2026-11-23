import {
  IconProgram,
  IconProvider,
  IconTrainee,
  IconOutcome,
} from "../../components/icons/DashboardIcons";

export default function GovernmentMetrics({
  programsCount = 0,
  activePrograms = 0,
  providersCount = 0,
  traineesCount = 0,
  averageAttendance = 0,
  employedCount = 0,
  certifiedCount = 0,
}) {
  return (
    <section className="metric-grid">
      <div className="metric-card">
        <div className="metric-icon blue">
          <IconProgram size={22} strokeWidth={2} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Total Programs</span>
          <strong>{programsCount}</strong>
          <small>{activePrograms} active</small>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon cyan">
          <IconProvider size={22} strokeWidth={2} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Training Providers</span>
          <strong>{providersCount}</strong>
          <small>Registered providers</small>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon purple">
          <IconTrainee size={22} strokeWidth={2} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Total Trainees</span>
          <strong>{traineesCount}</strong>
          <small>{Number(averageAttendance || 0).toFixed(0)}% avg attendance</small>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon green">
          <IconOutcome size={22} strokeWidth={2} />
        </div>
        <div className="metric-content">
          <span className="metric-label">Employment Outcomes</span>
          <strong>{employedCount}</strong>
          <small>{certifiedCount} certified</small>
        </div>
      </div>
    </section>
  );
}
