const express = require("express");

const {
  getGovernmentAIInsights,
} = require("../controllers/governmentController");

const {
  getGovernmentOutcomeAnalytics,
} = require("../controllers/governmentAnalyticsController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.get(
  "/ai-insights",
  authenticate,
  authorize("GOVERNMENT"),
  getGovernmentAIInsights
);

router.get(
  "/outcome-analytics",
  authenticate,
  authorize("GOVERNMENT"),
  getGovernmentOutcomeAnalytics
);

module.exports = router;