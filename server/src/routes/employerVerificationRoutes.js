const express = require("express");
const router = express.Router();

const {
  createVerification,
  getVerifications,
  updateVerification,
} = require("../controllers/employerVerificationController");

const { authenticate, authorize } = require("../middleware/auth");

router.post(
  "/",
  authenticate,
  authorize("EMPLOYER"),
  createVerification
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "EMPLOYER", "TRAINEE"),
  getVerifications
);

router.patch(
  "/:verificationId",
  authenticate,
  authorize("EMPLOYER"),
  updateVerification
);

module.exports = router;