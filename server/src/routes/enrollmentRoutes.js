const express = require("express");

const {
  createEnrollment,
  getEnrollments,
} = require("../controllers/enrollmentController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("TRAINEE"),
  createEnrollment
);

router.get(
  "/",
  authenticate,
  authorize(
    "GOVERNMENT",
    "PROVIDER",
    "TRAINEE"
  ),
  getEnrollments
);

module.exports = router;