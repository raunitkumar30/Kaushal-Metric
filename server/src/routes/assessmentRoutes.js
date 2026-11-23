const express = require("express");

const {
  createAssessment,
  getAssessments,
} = require("../controllers/assessmentController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createAssessment
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "TRAINEE"),
  getAssessments
);

module.exports = router;
