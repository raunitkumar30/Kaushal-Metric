const express = require("express");

const {
  createProgram,
  getPrograms,
} = require("../controllers/programController");

const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("GOVERNMENT"),
  createProgram
);

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT", "PROVIDER"),
  getPrograms
);

module.exports = router;
