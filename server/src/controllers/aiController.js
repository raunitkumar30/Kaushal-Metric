const mongoose = require("mongoose");
const Trainee = require("../models/Trainee");
const Assessment = require("../models/Assessment");
const Batch = require("../models/Batch");
const Program = require("../models/Program");
const Certification = require("../models/Certification");
const Employment = require("../models/Employment");

const {
  detectSkillGap,
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
// GET PROGRAM SKILL STATUS
// ============================================================

const getSkillStatus = (program, assessments) => {
  return program.targetSkills.map((skillName) => {
    const matchingAssessments = assessments.filter(
      (assessment) =>
        normalizeSkillName(assessment.skill) ===
        normalizeSkillName(skillName)
    );

    // Skill has not been assessed yet
    if (matchingAssessments.length === 0) {
      return {
        skill: skillName,
        assessed: false,
        currentLevel: null,
        gap: null,
      };
    }

    // Calculate average score when multiple
    // assessments exist for the same skill.
    const average =
      matchingAssessments.reduce(
        (sum, assessment) =>
          sum + Number(assessment.score),
        0
      ) / matchingAssessments.length;

    return {
      skill: skillName,
      assessed: true,
      currentLevel: average,
      gap: Math.max(75 - average, 0),
    };
  });
};

// ============================================================
// GET SKILL METRICS FOR AI RISK ANALYSIS
// ============================================================

const getSkillMetrics = (program, assessments) => {
  if (!program) {
    return {
      requiredSkills: 0,
      assessedSkills: 0,
      skillsWithGaps: 0,
      unassessedSkills: 0,
    };
  }

  const skillStatus = getSkillStatus(
    program,
    assessments
  );

  const requiredSkills = skillStatus.length;

  const assessedSkills = skillStatus.filter(
    (item) => item.assessed
  ).length;

  const skillsWithGaps = skillStatus.filter(
    (item) =>
      item.assessed &&
      item.gap > 0
  ).length;

  const unassessedSkills =
    requiredSkills - assessedSkills;

  return {
    requiredSkills,
    assessedSkills,
    skillsWithGaps,
    unassessedSkills,
  };
};

// ============================================================
// AI SKILL GAP ANALYSIS
// ============================================================

const analyzeTraineeSkillGap = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const trainee = await Trainee.findById(
      traineeId
    );

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const batch = await Batch.findById(
      trainee.batchId
    );

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    const program = await Program.findById(
      batch.programId
    );

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    const assessments = await Assessment.find({
      traineeId: trainee._id,
    });

    // Build AI input for every required program skill.
    // Unassessed skills are explicitly sent as null.
    const skills = program.targetSkills.map(
      (skillName) => {
        const matchingAssessments =
          assessments.filter(
            (assessment) =>
              normalizeSkillName(
                assessment.skill
              ) ===
              normalizeSkillName(skillName)
          );

        if (matchingAssessments.length === 0) {
          return {
            name: skillName,
            target_level: 75,
            current_level: null,
          };
        }

        const currentLevel =
          matchingAssessments.reduce(
            (sum, assessment) =>
              sum +
              Number(assessment.score),
            0
          ) /
          matchingAssessments.length;

        return {
          name: skillName,
          target_level: 75,
          current_level: currentLevel,
        };
      }
    );

    const analysis =
      await detectSkillGap(skills);

    res.json({
      trainee: {
        id: trainee._id,
        name: trainee.name,
      },

      program: {
        id: program._id,
        name: program.name,
      },

      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to analyze trainee skill gap",
    });
  }
};

// ============================================================
// AI RETENTION / DROPOUT RISK
// ============================================================

const analyzeTraineeRetentionRisk = async (
  req,
  res
) => {
  try {
    const { traineeId } = req.params;

    const trainee =
      await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    // Get all assessments for trainee
    const assessments =
      await Assessment.find({
        traineeId: trainee._id,
      });

    // Calculate overall assessment average
    const assessmentAverage =
      assessments.length > 0
        ? assessments.reduce(
            (sum, assessment) =>
              sum +
              Number(assessment.score),
            0
          ) / assessments.length
        : 0;

    // Find trainee's program
    const batch =
      await Batch.findById(
        trainee.batchId
      );

    let skillMetrics = {
      requiredSkills: 0,
      assessedSkills: 0,
      skillsWithGaps: 0,
      unassessedSkills: 0,
    };

    if (batch) {
      const program =
        await Program.findById(
          batch.programId
        );

      if (program) {
        skillMetrics =
          getSkillMetrics(
            program,
            assessments
          );
      }
    }

    // Send corrected skill metrics to AI.
    //
    // totalSkills = ALL required program skills
    // skillsWithGaps = ONLY assessed skills with gaps

    const analysis =
      await predictRetentionRisk({
        attendancePercentage:
          trainee.attendancePercentage,

        assessmentAverage,

        skillsWithGaps:
          skillMetrics.skillsWithGaps,

        totalSkills:
          skillMetrics.requiredSkills,
      });

    res.json({
      trainee: {
        id: trainee._id,
        name: trainee.name,
      },

      inputs: {
        attendancePercentage:
          trainee.attendancePercentage,

        assessmentAverage,

        skillsWithGaps:
          skillMetrics.skillsWithGaps,

        totalSkills:
          skillMetrics.requiredSkills,

        assessedSkills:
          skillMetrics.assessedSkills,

        unassessedSkills:
          skillMetrics.unassessedSkills,
      },

      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to analyze trainee retention risk",
    });
  }
};

// ============================================================
// AI EMPLOYMENT / PLACEMENT RISK
// ============================================================

const analyzeTraineeEmploymentRisk =
  async (req, res) => {
    try {
      const { traineeId } = req.params;

      const trainee =
        await Trainee.findById(
          traineeId
        );

      if (!trainee) {
        return res.status(404).json({
          message: "Trainee not found",
        });
      }

      // Get all trainee assessments
      const assessments =
        await Assessment.find({
          traineeId: trainee._id,
        });

      // Calculate assessment average
      const assessmentAverage =
        assessments.length > 0
          ? assessments.reduce(
              (sum, assessment) =>
                sum +
                Number(
                  assessment.score
                ),
              0
            ) / assessments.length
          : 0;

      // Find trainee's program
      const batch =
        await Batch.findById(
          trainee.batchId
        );

      let skillMetrics = {
        requiredSkills: 0,
        assessedSkills: 0,
        skillsWithGaps: 0,
        unassessedSkills: 0,
      };

      if (batch) {
        const program =
          await Program.findById(
            batch.programId
          );

        if (program) {
          skillMetrics =
            getSkillMetrics(
              program,
              assessments
            );
        }
      }

      // Find valid certification
      const certification =
        await Certification.findOne({
          traineeId: trainee._id,
          status: "VALID",
        });

      // Find latest employment outcome
      const employment =
        await Employment.findOne({
          traineeId: trainee._id,
        }).sort({
          employmentDate: -1,
          createdAt: -1,
        });

      let employmentStatus =
        "UNEMPLOYED";

      if (employment) {
        employmentStatus =
          employment.status;
      }

      // Already employed trainees are not
      // placement-risk cases.
      if (
        employmentStatus ===
        "EMPLOYED"
      ) {
        return res.json({
          trainee: {
            id: trainee._id,
            name: trainee.name,
          },

          inputs: {
            assessmentAverage,

            attendancePercentage:
              trainee.attendancePercentage,

            skillsWithGaps:
              skillMetrics.skillsWithGaps,

            totalSkills:
              skillMetrics.requiredSkills,

            assessedSkills:
              skillMetrics.assessedSkills,

            unassessedSkills:
              skillMetrics.unassessedSkills,

            certified:
              Boolean(certification),

            employmentStatus,
          },

          analysis: {
            risk_score: 0,

            risk_level: "LOW",

            reasons: [
              "The trainee already has a recorded employment outcome.",
            ],

            recommendation:
              "Continue tracking employment retention and career progression.",
          },
        });
      }

      // Trainee still needs employment.
      // Run normal placement-risk analysis.
      const analysis =
        await predictEmploymentRisk({
          assessmentAverage,

          attendancePercentage:
            trainee.attendancePercentage,

          skillsWithGaps:
            skillMetrics.skillsWithGaps,

          totalSkills:
            skillMetrics.requiredSkills,

          certified:
            Boolean(certification),

          employmentStatus,
        });

      res.json({
        trainee: {
          id: trainee._id,
          name: trainee.name,
        },

        inputs: {
          assessmentAverage,

          attendancePercentage:
            trainee.attendancePercentage,

          skillsWithGaps:
            skillMetrics.skillsWithGaps,

          totalSkills:
            skillMetrics.requiredSkills,

          assessedSkills:
            skillMetrics.assessedSkills,

          unassessedSkills:
            skillMetrics.unassessedSkills,

          certified:
            Boolean(certification),

          employmentStatus,
        },

        analysis,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to analyze trainee employment risk",
      });
    }
  };

// ============================================================
// AGGREGATE AI SKILL GAP INSIGHTS
// ============================================================

const analyzeAggregateSkillGaps = async (
  req,
  res
) => {
  try {
    const {
      programId,
      providerId,
    } = req.query;

    // --------------------------------------------------------
    // Validate optional filters
    // --------------------------------------------------------

    if (
      programId &&
      !mongoose.Types.ObjectId.isValid(
        programId
      )
    ) {
      return res.status(400).json({
        message: "Invalid programId",
      });
    }

    if (
      providerId &&
      !mongoose.Types.ObjectId.isValid(
        providerId
      )
    ) {
      return res.status(400).json({
        message: "Invalid providerId",
      });
    }

    // --------------------------------------------------------
    // Build program filter
    // --------------------------------------------------------

    const programFilter = {};

    if (programId) {
      programFilter._id = programId;
    }

    if (providerId) {
      programFilter.providerId =
        providerId;
    }

    // --------------------------------------------------------
    // Get programs
    // --------------------------------------------------------

    const programs =
      await Program.find(
        programFilter
      )
        .populate(
          "providerId",
          "name registrationNumber"
        )
        .sort({
          name: 1,
        });

    // --------------------------------------------------------
    // No programs found
    // --------------------------------------------------------

    if (programs.length === 0) {
      return res.json({
        scope: {
          programId:
            programId || null,

          providerId:
            providerId || null,
        },

        summary: {
          totalPrograms: 0,
          totalTrainees: 0,
          totalAssessments: 0,
          recurringSkillGaps: 0,
        },

        skillGaps: [],

        providerInsights: [],
      });
    }

    // --------------------------------------------------------
    // Get all batches belonging to these programs
    // --------------------------------------------------------

    const programIds =
      programs.map(
        (program) => program._id
      );

    const batches =
      await Batch.find({
        programId: {
          $in: programIds,
        },
      }).select(
        "_id programId providerId"
      );

    const batchIds =
      batches.map(
        (batch) => batch._id
      );

    // --------------------------------------------------------
    // Get trainees belonging to those batches
    // --------------------------------------------------------

    const trainees =
      batchIds.length > 0
        ? await Trainee.find({
            batchId: {
              $in: batchIds,
            },
          }).select(
            "_id name batchId"
          )
        : [];

    const traineeIds =
      trainees.map(
        (trainee) =>
          trainee._id
      );

    // --------------------------------------------------------
    // Get all assessments for those trainees
    // --------------------------------------------------------

    const assessments =
      traineeIds.length > 0
        ? await Assessment.find({
            traineeId: {
              $in: traineeIds,
            },
          }).select(
            "traineeId skill score"
          )
        : [];

    // --------------------------------------------------------
    // Lookup maps
    // --------------------------------------------------------

    const programById =
      new Map(
        programs.map(
          (program) => [
            String(program._id),
            program,
          ]
        )
      );

    const batchToProgram =
      new Map(
        batches.map(
          (batch) => [
            String(batch._id),
            String(
              batch.programId
            ),
          ]
        )
      );

    const traineeToProgram =
      new Map();

    trainees.forEach(
      (trainee) => {
        const programForTrainee =
          batchToProgram.get(
            String(
              trainee.batchId
            )
          );

        if (
          programForTrainee
        ) {
          traineeToProgram.set(
            String(
              trainee._id
            ),
            programForTrainee
          );
        }
      }
    );

    // --------------------------------------------------------
    // Aggregate every required skill.
    //
    // Target level is the same 75 used by individual
    // skill-gap analysis.
    // --------------------------------------------------------

    const skillMap =
      new Map();

    programs.forEach(
      (program) => {
        program.targetSkills.forEach(
          (skillName) => {
            const normalized =
              normalizeSkillName(
                skillName
              );

            if (
              !skillMap.has(
                normalized
              )
            ) {
              skillMap.set(
                normalized,
                {
                  skill: skillName,

                  programs:
                    new Set(),

                  assessedTrainees:
                    new Set(),

                  traineesWithGaps:
                    new Set(),

                  scores: [],

                  gaps: [],
                }
              );
            }

            skillMap
              .get(normalized)
              .programs.add(
                String(
                  program._id
                )
              );
          }
        );
      }
    );

    // --------------------------------------------------------
    // Process assessments
    // --------------------------------------------------------

    assessments.forEach(
      (assessment) => {
        const programIdForAssessment =
          traineeToProgram.get(
            String(
              assessment.traineeId
            )
          );

        if (
          !programIdForAssessment
        ) {
          return;
        }

        const program =
          programById.get(
            programIdForAssessment
          );

        if (!program) {
          return;
        }

        const matchingSkill =
          program.targetSkills.find(
            (skillName) =>
              normalizeSkillName(
                skillName
              ) ===
              normalizeSkillName(
                assessment.skill
              )
          );

        if (!matchingSkill) {
          return;
        }

        const normalized =
          normalizeSkillName(
            matchingSkill
          );

        const entry =
          skillMap.get(
            normalized
          );

        if (!entry) {
          return;
        }

        const score =
          Number(
            assessment.score
          );

        if (
          !Number.isFinite(
            score
          )
        ) {
          return;
        }

        const traineeKey =
          String(
            assessment.traineeId
          );

        entry.assessedTrainees.add(
          traineeKey
        );

        entry.scores.push(
          score
        );

        const gap =
          Math.max(
            75 - score,
            0
          );

        if (gap > 0) {
          entry.traineesWithGaps.add(
            traineeKey
          );

          entry.gaps.push(
            gap
          );
        }
      }
    );

    // --------------------------------------------------------
    // Build aggregate skill-gap results
    // --------------------------------------------------------

    const skillGaps =
      Array.from(
        skillMap.values()
      )
        .map(
          (entry) => {
            const assessedCount =
              entry
                .assessedTrainees
                .size;

            const gapCount =
              entry
                .traineesWithGaps
                .size;

            const averageScore =
              entry.scores
                .length > 0
                ? entry.scores.reduce(
                    (
                      sum,
                      score
                    ) =>
                      sum +
                      score,
                    0
                  ) /
                  entry.scores
                    .length
                : null;

            const averageGap =
              entry.gaps
                .length > 0
                ? entry.gaps.reduce(
                    (
                      sum,
                      gap
                    ) =>
                      sum +
                      gap,
                    0
                  ) /
                  entry.gaps
                    .length
                : 0;

            const gapRate =
              assessedCount >
              0
                ? Math.round(
                    (gapCount /
                      assessedCount) *
                      100
                  )
                : 0;

            let priority =
              "LOW";

            let recommendation =
              "Continue monitoring this skill.";

            if (
              assessedCount ===
              0
            ) {
              priority =
                "ASSESSMENT_REQUIRED";

              recommendation =
                "Assess this skill before making a training decision.";
            } else if (
              gapRate >= 75 ||
              averageGap >= 30
            ) {
              priority =
                "HIGH";

              recommendation =
                "Prioritize targeted training and reassessment for this skill.";
            } else if (
              gapRate >= 50 ||
              averageGap >= 15
            ) {
              priority =
                "MEDIUM";

              recommendation =
                "Add focused practice and monitor improvement.";
            }

            const explanation =
              assessedCount ===
              0
                ? "No trainees have an assessment recorded for this required skill."
                : `${gapCount} of ${assessedCount} assessed trainees are below the 75 target level.`;

            return {
              skill:
                entry.skill,

              programsAffected:
                entry
                  .programs
                  .size,

              traineesAssessed:
                assessedCount,

              traineesWithGaps:
                gapCount,

              gapRate,

              averageScore:
                averageScore ===
                null
                  ? null
                  : Number(
                      averageScore.toFixed(
                        2
                      )
                    ),

              averageGap:
                Number(
                  averageGap.toFixed(
                    2
                  )
                ),

              priority,

              explanation,

              recommendation,
            };
          }
        )
        .sort(
          (a, b) => {
            const priorityOrder =
              {
                HIGH: 3,
                MEDIUM: 2,
                LOW: 1,
                ASSESSMENT_REQUIRED: 0,
              };

            if (
              priorityOrder[
                b.priority
              ] !==
              priorityOrder[
                a.priority
              ]
            ) {
              return (
                priorityOrder[
                  b.priority
                ] -
                priorityOrder[
                  a.priority
                ]
              );
            }

            return (
              b.gapRate -
              a.gapRate
            );
          }
        );

    // ========================================================
    // PROVIDER-LEVEL AI INSIGHTS
    // ========================================================

    const providerMap =
      new Map();

    // --------------------------------------------------------
    // Create provider entries
    // --------------------------------------------------------

    programs.forEach(
      (program) => {
        const provider =
          program.providerId;

        if (!provider) {
          return;
        }

        const providerKey =
          String(
            provider._id
          );

        if (
          !providerMap.has(
            providerKey
          )
        ) {
          providerMap.set(
            providerKey,
            {
              providerId:
                provider._id,

              providerName:
                provider.name,

              programs:
                new Set(),

              trainees:
                new Set(),

              assessmentCount:
                0,

              skillsWithGaps:
                0,
            }
          );
        }

        providerMap
          .get(providerKey)
          .programs.add(
            String(
              program._id
            )
          );
      }
    );

    // --------------------------------------------------------
    // Add trainees to provider summaries
    // --------------------------------------------------------

    trainees.forEach(
      (trainee) => {
        const programIdForTrainee =
          traineeToProgram.get(
            String(
              trainee._id
            )
          );

        const program =
          programById.get(
            programIdForTrainee
          );

        if (
          !program ||
          !program.providerId
        ) {
          return;
        }

        const providerKey =
          String(
            program
              .providerId
              ._id
          );

        const providerEntry =
          providerMap.get(
            providerKey
          );

        if (
          providerEntry
        ) {
          providerEntry.trainees.add(
            String(
              trainee._id
            )
          );
        }
      }
    );

    // --------------------------------------------------------
    // Count provider assessments and skill gaps
    // --------------------------------------------------------

    assessments.forEach(
      (assessment) => {
        const programIdForAssessment =
          traineeToProgram.get(
            String(
              assessment.traineeId
            )
          );

        const program =
          programById.get(
            programIdForAssessment
          );

        if (
          !program ||
          !program.providerId
        ) {
          return;
        }

        const providerKey =
          String(
            program
              .providerId
              ._id
          );

        const providerEntry =
          providerMap.get(
            providerKey
          );

        if (
          !providerEntry
        ) {
          return;
        }

        providerEntry.assessmentCount +=
          1;

        const matchingSkill =
          program.targetSkills.find(
            (skillName) =>
              normalizeSkillName(
                skillName
              ) ===
              normalizeSkillName(
                assessment.skill
              )
          );

        if (
          matchingSkill &&
          Number(
            assessment.score
          ) < 75
        ) {
          providerEntry.skillsWithGaps +=
            1;
        }
      }
    );

    // --------------------------------------------------------
    // Build provider insights
    // --------------------------------------------------------

    const providerInsights =
      Array.from(
        providerMap.values()
      )
        .map(
          (provider) => ({
            providerId:
              provider.providerId,

            providerName:
              provider.providerName,

            programs:
              provider
                .programs
                .size,

            trainees:
              provider
                .trainees
                .size,

            assessments:
              provider
                .assessmentCount,

            skillGapAssessments:
              provider
                .skillsWithGaps,

            recommendation:
              provider
                .skillsWithGaps >
              0
                ? "Review recurring skill gaps and strengthen targeted training or practice."
                : "No assessed skill gaps are currently recorded.",
          })
        )
        .sort(
          (a, b) =>
            b.skillGapAssessments -
            a.skillGapAssessments
        );

    // --------------------------------------------------------
    // Recurring skill-gap count
    // --------------------------------------------------------

    const recurringSkillGaps =
      skillGaps.filter(
        (skill) =>
          skill.priority ===
            "HIGH" ||
          skill.priority ===
            "MEDIUM"
      ).length;

    // --------------------------------------------------------
    // Final response
    // --------------------------------------------------------

    res.json({
      scope: {
        programId:
          programId || null,

        providerId:
          providerId || null,
      },

      summary: {
        totalPrograms:
          programs.length,

        totalTrainees:
          trainees.length,

        totalAssessments:
          assessments.length,

        recurringSkillGaps,
      },

      skillGaps,

      providerInsights,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to analyze aggregate skill gaps",

      error:
        error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  analyzeTraineeSkillGap,
  analyzeTraineeRetentionRisk,
  analyzeTraineeEmploymentRisk,
  analyzeAggregateSkillGaps,
};