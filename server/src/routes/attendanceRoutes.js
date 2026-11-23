const express = require("express");

const {
  createAttendance,
  getAttendance,
} = require("../controllers/attendanceController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createAttendance
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  getAttendance
);

module.exports = router;