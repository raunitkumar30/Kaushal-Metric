import React from "react";

export default function AttendanceOverviewCard({
  averageAttendance = 0,
  attendanceRing = 0,
  certifiedTrainees = 0,
  employmentRecords = 0,
}) {
  return (
    <article className="provider-card attendance-overview-card">
      <div className="provider-card-header">
        <div>
          <h2>Attendance Overview</h2>
          <p>Average attendance across your trainees.</p>
        </div>
      </div>
      <div className="attendance-card-body">
        <div
          className="attendance-ring"
          style={{ "--attendance": attendanceRing }}
        >
          <div className="attendance-ring-content">
            <strong>{attendanceRing}%</strong>
            <span>Attendance</span>
          </div>
        </div>
        <div className="attendance-legend">
          <div className="attendance-legend-row">
            <span className="legend-dot" /> Present / attendance{" "}
            <strong>{averageAttendance}%</strong>
          </div>
          <div className="attendance-legend-row">
            <span className="legend-dot muted" /> Certified trainees{" "}
            <strong>{certifiedTrainees}</strong>
          </div>
          <div className="attendance-legend-row">
            <span className="legend-dot muted" /> Employment records{" "}
            <strong>{employmentRecords}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
