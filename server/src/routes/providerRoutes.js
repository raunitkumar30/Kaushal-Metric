const express = require("express");

const {
  createProvider,
  getProviders,
} = require("../controllers/providerController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT"),
  createProvider
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT"),
  getProviders
);

module.exports = router;
