import React from "react";

export function MySkillsCard({ skills = [], totalSkills = 0 }) {
  return (
    <article className="trainee-card skills-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">SKILLS</span>
          <h2>My Skills</h2>
        </div>
        <span className="count-label">{totalSkills} skills</span>
      </div>

      {skills?.length ? (
        <div className="skill-list">
          {skills.map((skill) => {
            const level = Number(skill.level || 0);
            const state =
              level >= 75
                ? "On target"
                : level >= 50
                  ? "Developing"
                  : "Needs focus";

            return (
              <div className="skill-item" key={skill.name}>
                <div className="skill-item-top">
                  <div>
                    <strong>{skill.name}</strong>
                    <span>{state}</span>
                  </div>
                  <b>{level}/100</b>
                </div>
                <div className="skill-track">
                  <div
                    className="skill-fill"
                    style={{ width: `${Math.min(level, 100)}%` }}
                  />
                  <span className="target-line" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <h3>No skills recorded yet</h3>
          <p>Skills will appear after assessments are recorded.</p>
        </div>
      )}
    </article>
  );
}

export default MySkillsCard;
