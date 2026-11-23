const express = require("express");

const {
  createTrainee,
  getTrainees,
  getMyTraineeProfile,
} = require("../controllers/traineeController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createTrainee
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  getTrainees
);

router.get(
  "/me",
  authenticate,
  authorize("TRAINEE"),
  getMyTraineeProfile
);

module.exports = router;