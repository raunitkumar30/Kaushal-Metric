const express = require("express");

const {
  analyzeTraineeSkillGap,
  analyzeTraineeRetentionRisk,
  analyzeTraineeEmploymentRisk,
  analyzeAggregateSkillGaps,
} = require("../controllers/aiController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

// ============================================================
// INDIVIDUAL TRAINEE SKILL GAP
// ============================================================

router.get(
  "/trainees/:traineeId/skill-gap",
  authenticate,
  authorize(
    "GOVERNMENT",
    "PROVIDER",
    "TRAINEE"
  ),
  analyzeTraineeSkillGap
);

// ============================================================
// INDIVIDUAL TRAINEE RETENTION / DROPOUT RISK
// ============================================================

router.get(
  "/trainees/:traineeId/retention-risk",
  authenticate,
  authorize(
    "GOVERNMENT",
    "PROVIDER"
  ),
  analyzeTraineeRetentionRisk
);

// ============================================================
// INDIVIDUAL TRAINEE EMPLOYMENT / PLACEMENT RISK
// ============================================================

router.get(
  "/trainees/:traineeId/employment-risk",
  authenticate,
  authorize(
    "GOVERNMENT",
    "PROVIDER"
  ),
  analyzeTraineeEmploymentRisk
);

// ============================================================
// AGGREGATE AI SKILL GAP INSIGHTS
//
// Optional query parameters:
// ?programId=<programId>
// ?providerId=<providerId>
//
// Without filters:
// Government receives aggregate insights across all programs.
//
// With programId:
// Government receives insights for one program.
//
// With providerId:
// Government receives insights for that provider.
// ============================================================

router.get(
  "/aggregate/skill-gaps",
  authenticate,
  authorize(
    "GOVERNMENT",
    "PROVIDER"
  ),
  analyzeAggregateSkillGaps
);

module.exports = router;