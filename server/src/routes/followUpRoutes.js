const express = require("express");
const router = express.Router();

const {
  createFollowUp,
  getFollowUps,
  updateFollowUp,
} = require("../controllers/followUpController");

const { authenticate, authorize } = require("../middleware/auth");

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createFollowUp
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "TRAINEE", "EMPLOYER"),
  getFollowUps
);

router.patch(
  "/:followUpId",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  updateFollowUp
);

module.exports = router;   