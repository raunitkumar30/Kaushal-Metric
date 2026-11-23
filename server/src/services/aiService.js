const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8001";

// ============================================================
// IN-PROCESS DETERMINISTIC AI ENGINE (ZERO DEPENDENCY / HIGH RESILIENCE)
// ============================================================

const localSkillGap = (skills = []) => {
  const results = [];

  for (const skill of skills) {
    if (skill.current_level === null || skill.current_level === undefined) {
      results.push({
        skill: skill.name,
        target_level: skill.target_level,
        current_level: null,
        gap: null,
        priority: "ASSESSMENT_REQUIRED",
        explanation: `No assessment has been recorded for ${skill.name}.`,
        recommendation: `Assess ${skill.name} before determining the trainee's skill gap.`,
      });
      continue;
    }

    const gap = Math.max(skill.target_level - skill.current_level, 0);
    let priority = "LOW";
    let recommendation = "";

    if (gap >= 30) {
      priority = "HIGH";
      recommendation = `Prioritize ${skill.name} with focused practical training and reassess the skill after the intervention.`;
    } else if (gap >= 15) {
      priority = "MEDIUM";
      recommendation = `Provide additional practice in ${skill.name} and monitor the next assessment.`;
    } else {
      priority = "LOW";
      recommendation = `${skill.name} is close to the target; continue regular practice.`;
    }

    results.push({
      skill: skill.name,
      target_level: skill.target_level,
      current_level: skill.current_level,
      gap,
      priority,
      explanation: `${skill.name} is ${Math.round(gap)} points below the target level.`,
      recommendation,
    });
  }

  return { skills: results };
};

const localRetentionRisk = ({
  attendance_percentage = 0,
  assessment_average = 0,
  skills_with_gaps = 0,
  total_skills = 0,
}) => {
  let risk_score = 0;
  const reasons = [];

  const att = Number(attendance_percentage) || 0;
  const ass = Number(assessment_average) || 0;
  const gaps = Number(skills_with_gaps) || 0;
  const total = Number(total_skills) || 0;

  if (att < 60) {
    risk_score += 50;
    reasons.push("Attendance is below 60%.");
  } else if (att < 75) {
    risk_score += 25;
    reasons.push("Attendance is below the recommended level.");
  }

  if (ass < 40) {
    risk_score += 30;
    reasons.push("Assessment performance is low.");
  } else if (ass < 60) {
    risk_score += 15;
    reasons.push("Assessment performance needs improvement.");
  }

  if (total > 0) {
    const gap_ratio = gaps / total;
    if (gap_ratio >= 0.75) {
      risk_score += 20;
      reasons.push("Most required skills have significant gaps.");
    } else if (gap_ratio >= 0.5) {
      risk_score += 10;
      reasons.push("Several required skills have significant gaps.");
    }
  }

  risk_score = Math.min(risk_score, 100);

  let risk_level = "LOW";
  let recommendation = "";

  if (risk_score >= 60) {
    risk_level = "HIGH";
    recommendation =
      "Contact the trainee, identify barriers to participation, and provide targeted academic or mentoring support.";
  } else if (risk_score >= 30) {
    risk_level = "MEDIUM";
    recommendation =
      "Increase monitoring, provide additional learning support, and review attendance and assessment progress.";
  } else {
    risk_level = "LOW";
    recommendation =
      "Continue regular monitoring and maintain the current training support.";
  }

  return {
    risk_score,
    risk_level,
    reasons,
    recommendation,
  };
};

const localEmploymentRisk = ({
  assessment_average = 0,
  attendance_percentage = 0,
  skills_with_gaps = 0,
  total_skills = 0,
  certified = false,
  employment_status = "UNKNOWN",
}) => {
  let risk_score = 0;
  const reasons = [];

  const ass = Number(assessment_average) || 0;
  const att = Number(attendance_percentage) || 0;
  const gaps = Number(skills_with_gaps) || 0;
  const total = Number(total_skills) || 0;
  const isCert = Boolean(certified);
  const status = String(employment_status || "").toUpperCase();

  if (ass < 40) {
    risk_score += 35;
    reasons.push("Assessment performance is significantly below the expected level.");
  } else if (ass < 60) {
    risk_score += 20;
    reasons.push("Assessment performance needs improvement.");
  }

  if (att < 60) {
    risk_score += 20;
    reasons.push("Low attendance may reduce training completion and job readiness.");
  } else if (att < 75) {
    risk_score += 10;
    reasons.push("Attendance is below the recommended level.");
  }

  if (total > 0) {
    const gap_ratio = gaps / total;
    if (gap_ratio >= 0.75) {
      risk_score += 30;
      reasons.push("Most required program skills have significant gaps.");
    } else if (gap_ratio >= 0.5) {
      risk_score += 15;
      reasons.push("Several required program skills have significant gaps.");
    }
  }

  if (!isCert) {
    risk_score += 10;
    reasons.push("The trainee has not yet received certification.");
  }

  if (status === "UNEMPLOYED") {
    risk_score += 10;
    reasons.push("No current employment outcome has been recorded.");
  } else if (status === "SEEKING") {
    risk_score += 15;
    reasons.push("The trainee is currently seeking employment.");
  }

  risk_score = Math.min(risk_score, 100);

  let risk_level = "LOW";
  let recommendation = "";

  if (risk_score >= 60) {
    risk_level = "HIGH";
    recommendation =
      "Prioritize placement support, strengthen the largest skill gaps, and connect the trainee with suitable employers.";
  } else if (risk_score >= 30) {
    risk_level = "MEDIUM";
    recommendation =
      "Monitor placement progress, address key skill gaps, and provide resume and interview preparation.";
  } else {
    risk_level = "LOW";
    recommendation =
      "Maintain current career support and monitor job placement opportunities.";
  }

  return {
    risk_score,
    risk_level,
    reasons,
    recommendation,
  };
};

// ============================================================
// EXPORTED AI SERVICE METHODS WITH AUTO-FALLBACK
// ============================================================

const detectSkillGap = async (skills) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/skill-gap`,
      { skills },
      { timeout: 800 }
    );
    return response.data;
  } catch (err) {
    return localSkillGap(skills);
  }
};

const predictRetentionRisk = async ({
  attendancePercentage,
  assessmentAverage,
  skillsWithGaps,
  totalSkills,
}) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/retention-risk`,
      {
        attendance_percentage: attendancePercentage,
        assessment_average: assessmentAverage,
        skills_with_gaps: skillsWithGaps,
        total_skills: totalSkills,
      },
      { timeout: 800 }
    );
    return response.data;
  } catch (err) {
    return localRetentionRisk({
      attendance_percentage: attendancePercentage,
      assessment_average: assessmentAverage,
      skills_with_gaps: skillsWithGaps,
      total_skills: totalSkills,
    });
  }
};

const predictEmploymentRisk = async ({
  assessmentAverage,
  attendancePercentage,
  skillsWithGaps,
  totalSkills,
  certified,
  employmentStatus,
}) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/employment-risk`,
      {
        assessment_average: assessmentAverage,
        attendance_percentage: attendancePercentage,
        skills_with_gaps: skillsWithGaps,
        total_skills: totalSkills,
        certified,
        employment_status: employmentStatus,
      },
      { timeout: 800 }
    );
    return response.data;
  } catch (err) {
    return localEmploymentRisk({
      assessment_average: assessmentAverage,
      attendance_percentage: attendancePercentage,
      skills_with_gaps: skillsWithGaps,
      total_skills: totalSkills,
      certified,
      employment_status: employmentStatus,
    });
  }
};

module.exports = {
  detectSkillGap,
  predictRetentionRisk,
  predictEmploymentRisk,
};