import React from "react";

export function OutcomePassportCard({ skillOutcomeId }) {
  return (
    <section className="trainee-card outcome-passport-card">
      <div className="outcome-passport-icon">ID</div>
      <div className="outcome-passport-content">
        <span className="eyebrow">OUTCOME PASSPORT</span>
        <h2>Skill Outcome ID</h2>
        <p>
          Your persistent outcome identity connects your training, skills,
          assessments, certification, employment and follow-up records.
        </p>
      </div>
      <div className="outcome-passport-id">
        <span>SKILL OUTCOME ID</span>
        <strong>{skillOutcomeId || "Generating..."}</strong>
      </div>
    </section>
  );
}

export default OutcomePassportCard;
