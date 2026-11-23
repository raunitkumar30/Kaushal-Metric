const express = require("express");

const {
  createCertification,
  getCertifications,
} = require("../controllers/certificationController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createCertification
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "TRAINEE", "EMPLOYER"),
  getCertifications
);

module.exports = router;
