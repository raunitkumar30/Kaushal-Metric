const express = require("express");

const {
  resetAndLoadDemo,
  clearOperationalData,
  injectSihData,
} = require("../controllers/demoController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

/*
 * Inject complete Maharashtra SIH dataset.
 *
 * POST /api/demo/inject-sih-data
 */
router.post(
  "/inject-sih-data",
  authenticate,
  authorize("GOVERNMENT"),
  injectSihData
);

/*
 * Clear all operational data while preserving demo accounts for Maharashtra SIH.
 *
 * POST /api/demo/clear-operational-data
 */
router.post(
  "/clear-operational-data",
  authenticate,
  authorize("GOVERNMENT"),
  clearOperationalData
);

/*
 * Government-only demo reset and data loader.
 *
 * POST /api/demo/reset-and-load
 */
router.post(
  "/reset-and-load",
  authenticate,
  authorize("GOVERNMENT"),
  resetAndLoadDemo
);

module.exports = router;