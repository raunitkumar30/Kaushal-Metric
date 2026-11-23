const Trainee = require("../models/Trainee");
const Assessment = require("../models/Assessment");
const Batch = require("../models/Batch");
const Program = require("../models/Program");
const Certification = require("../models/Certification");
const Employment = require("../models/Employment");

const {
  predictRetentionRisk,
  predictEmploymentRisk,
} = require("../services/aiService");

// ============================================================
// SKILL NAME NORMALIZATION
// ============================================================

const normalizeSkillName = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

// ============================================================
// GET PROGRAM SKILL GAP DATA
// ============================================================

const getSkillGapData = (program, assessments) => {
  const requiredSkills =
    program.targetSkills || [];

  let assessedSkills = 0;
  let skillsWithGaps = 0;

  requiredSkills.forEach((skillName) => {
    const matchingAssessments =
      assessments.filter(
        (assessment) =>
          normalizeSkillName(
            assessment.skill
          ) ===
          normalizeSkillName(skillName)
      );

    // --------------------------------------------------------
    // No assessment recorded for this required skill.
    // --------------------------------------------------------

    if (matchingAssessments.length === 0) {
      return;
    }

    assessedSkills += 1;

    // --------------------------------------------------------
    // If multiple assessments exist for the same skill,
    // calculate the average score.
    // --------------------------------------------------------

    const average =
      matchingAssessments.reduce(
        (sum, assessment) =>
          sum + Number(assessment.score),
        0
      ) /
      matchingAssessments.length;

    // --------------------------------------------------------
    // Target level is 75.
    // --------------------------------------------------------

    if (average < 75) {
      skillsWithGaps += 1;
    }
  });

  return {
    // ALL required skills in the program.
    totalSkills: requiredSkills.length,

    // Skills that actually have an assessment.
    assessedSkills,

    // Assessed skills below the target.
    skillsWithGaps,

    // Required skills that still need assessment.
    unassessedSkills:
      requiredSkills.length -
      assessedSkills,
  };
};

// ============================================================
// GOVERNMENT AI INSIGHTS
// ============================================================

const getGovernmentAIInsights = async (
  req,
  res
) => {
  try {
    // --------------------------------------------------------
    // Load all required data.
    // --------------------------------------------------------

    const trainees =
      await Trainee.find();

    const programs =
      await Program.find();

    const batches =
      await Batch.find();

    const certifications =
      await Certification.find();

    const employments =
      await Employment.find();

    const assessments =
      await Assessment.find();

    // --------------------------------------------------------
    // Create lookup maps for faster program/batch access.
    // --------------------------------------------------------

    const programMap = new Map(
      programs.map((program) => [
        program._id.toString(),
        program,
      ])
    );

    const batchMap = new Map(
      batches.map((batch) => [
        batch._id.toString(),
        batch,
      ])
    );

    // --------------------------------------------------------
    // Government-level risk counters.
    // --------------------------------------------------------

    let highRetentionRisk = 0;
    let mediumRetentionRisk = 0;

    let highEmploymentRisk = 0;
    let mediumEmploymentRisk = 0;

    // --------------------------------------------------------
    // Outcome counters.
    // --------------------------------------------------------

    let employedTrainees = 0;
    let certifiedTrainees = 0;

    const traineeInsights = [];

    // ========================================================
    // ANALYZE EACH TRAINEE
    // ========================================================

    for (const trainee of trainees) {
      // ------------------------------------------------------
      // Find trainee batch.
      // ------------------------------------------------------

      const batch = trainee.batchId
        ? batchMap.get(
            trainee.batchId.toString()
          )
        : null;

      // ------------------------------------------------------
      // Find trainee program.
      // ------------------------------------------------------

      const program = batch?.programId
        ? programMap.get(
            batch.programId.toString()
          )
        : null;

      // ------------------------------------------------------
      // Get assessments belonging to this trainee.
      // ------------------------------------------------------

      const traineeAssessments =
        assessments.filter(
          (assessment) =>
            assessment.traineeId.toString() ===
            trainee._id.toString()
        );

      // ------------------------------------------------------
      // Calculate assessment average.
      // ------------------------------------------------------

      const assessmentAverage =
        traineeAssessments.length > 0
          ? traineeAssessments.reduce(
              (sum, assessment) =>
                sum +
                Number(assessment.score),
              0
            ) /
            traineeAssessments.length
          : 0;

      // ------------------------------------------------------
      // Calculate required/assessed/gap skills.
      // ------------------------------------------------------

      let skillData = {
        totalSkills: 0,
        assessedSkills: 0,
        skillsWithGaps: 0,
        unassessedSkills: 0,
      };

      if (program) {
        skillData =
          getSkillGapData(
            program,
            traineeAssessments
          );
      }

      const totalSkills =
        skillData.totalSkills;

      const assessedSkills =
        skillData.assessedSkills;

      const skillsWithGaps =
        skillData.skillsWithGaps;

      const unassessedSkills =
        skillData.unassessedSkills;

      // ======================================================
      // RETENTION / DROPOUT RISK
      // ======================================================

      const retentionAnalysis =
        await predictRetentionRisk({
          attendancePercentage:
            trainee.attendancePercentage,

          assessmentAverage,

          skillsWithGaps,

          // IMPORTANT:
          // Use ALL required program skills,
          // not only assessed skills.
          totalSkills,
        });

      // ======================================================
      // CERTIFICATION
      // ======================================================

      const certification =
        certifications.find(
          (item) =>
            item.traineeId.toString() ===
              trainee._id.toString() &&
            item.status === "VALID"
        );

      // ======================================================
      // EMPLOYMENT
      // ======================================================

      const employment =
        employments
          .filter(
            (item) =>
              item.traineeId.toString() ===
              trainee._id.toString()
          )
          .sort(
            (a, b) =>
              new Date(
                b.employmentDate ||
                  b.createdAt
              ) -
              new Date(
                a.employmentDate ||
                  a.createdAt
              )
          )[0];

      const employmentStatus =
        employment?.status ||
        "UNEMPLOYED";

      // ======================================================
      // EMPLOYMENT / PLACEMENT RISK
      // ======================================================

      let employmentAnalysis;

      // ------------------------------------------------------
      // Already employed trainees are not placement-risk
      // cases.
      // ------------------------------------------------------

      if (
        employmentStatus ===
        "EMPLOYED"
      ) {
        employmentAnalysis = {
          risk_score: 0,

          risk_level: "LOW",

          reasons: [
            "The trainee already has a recorded employment outcome.",
          ],

          recommendation:
            "Continue tracking employment retention and career progression.",
        };
      } else {
        // ----------------------------------------------------
        // Trainee still needs employment.
        // Run normal placement-risk analysis.
        // ----------------------------------------------------

        employmentAnalysis =
          await predictEmploymentRisk({
            assessmentAverage,

            attendancePercentage:
              trainee.attendancePercentage,

            skillsWithGaps,

            // IMPORTANT:
            // Use ALL required program skills.
            totalSkills,

            certified:
              Boolean(certification),

            employmentStatus,
          });
      }

      // ======================================================
      // UPDATE RETENTION RISK COUNTERS
      // ======================================================

      if (
        retentionAnalysis.risk_level ===
        "HIGH"
      ) {
        highRetentionRisk += 1;
      } else if (
        retentionAnalysis.risk_level ===
        "MEDIUM"
      ) {
        mediumRetentionRisk += 1;
      }

      // ======================================================
      // UPDATE EMPLOYMENT RISK COUNTERS
      // ======================================================

      if (
        employmentStatus !==
        "EMPLOYED"
      ) {
        if (
          employmentAnalysis.risk_level ===
          "HIGH"
        ) {
          highEmploymentRisk += 1;
        } else if (
          employmentAnalysis.risk_level ===
          "MEDIUM"
        ) {
          mediumEmploymentRisk += 1;
        }
      }

      // ======================================================
      // UPDATE CERTIFICATION COUNTER
      // ======================================================

      if (certification) {
        certifiedTrainees += 1;
      }

      // ======================================================
      // UPDATE EMPLOYMENT COUNTER
      // ======================================================

      if (
        employmentStatus ===
        "EMPLOYED"
      ) {
        employedTrainees += 1;
      }

      // ======================================================
      // STORE TRAINEE AI INSIGHT
      // ======================================================

      traineeInsights.push({
        traineeId: trainee._id,

        traineeName: trainee.name,

        programName:
          program?.name ||
          "Not available",

        attendancePercentage:
          trainee.attendancePercentage,

        assessmentAverage,

        // ----------------------------------------------------
        // Skill information
        // ----------------------------------------------------

        skillsWithGaps,

        // ALL required skills.
        totalSkills,

        // Number actually assessed.
        assessedSkills,

        // Number still waiting for assessment.
        unassessedSkills,

        retentionRisk:
          retentionAnalysis,

        employmentRisk:
          employmentAnalysis,

        certified:
          Boolean(certification),

        employmentStatus,
      });
    }

    // ========================================================
    // GOVERNMENT-LEVEL OUTCOME RATES
    // ========================================================

    const totalTrainees =
      trainees.length;

    const employmentRate =
      totalTrainees > 0
        ? Number(
            (
              (employedTrainees /
                totalTrainees) *
              100
            ).toFixed(2)
          )
        : 0;

    const certificationRate =
      totalTrainees > 0
        ? Number(
            (
              (certifiedTrainees /
                totalTrainees) *
              100
            ).toFixed(2)
          )
        : 0;

    // ========================================================
    // RESPONSE
    // ========================================================

    res.json({
      overview: {
        totalPrograms:
          programs.length,

        totalBatches:
          batches.length,

        totalTrainees,

        certifiedTrainees,

        employedTrainees,

        certificationRate,

        employmentRate,

        highRetentionRisk,

        mediumRetentionRisk,

        highEmploymentRisk,

        mediumEmploymentRisk,
      },

      trainees: traineeInsights,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to generate government AI insights",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getGovernmentAIInsights,
};