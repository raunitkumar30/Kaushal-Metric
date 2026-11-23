const express = require("express");

const {
  createEmployment,
  getEmployments,
} = require("../controllers/employmentController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "EMPLOYER"),
  createEmployment
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "EMPLOYER", "TRAINEE"),
  getEmployments
);

module.exports = router;
