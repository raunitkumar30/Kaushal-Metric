const express = require("express");

const {
  createIntervention,
  getInterventions,
  updateIntervention,
} = require("../controllers/interventionController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createIntervention
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  getInterventions
);

router.patch(
  "/:interventionId",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  updateIntervention
);

module.exports = router;