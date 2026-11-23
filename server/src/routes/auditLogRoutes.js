const express = require("express");
const {
  getAuditLogs,
} = require("../controllers/auditLogController");
const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("GOVERNMENT"),
  getAuditLogs
);

module.exports = router;