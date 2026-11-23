const express = require("express");

const {
  createBatch,
  getBatches,
} = require("../controllers/batchController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  createBatch
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER", "TRAINEE"),
  getBatches
);

module.exports = router;