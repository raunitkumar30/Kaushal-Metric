const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ logs });
  } catch (error) {
    console.error("Get audit logs error:", error);

    res.status(500).json({
      message: "Failed to load audit logs",
    });
  }
};

const createAuditLog = async ({
  userId = null,
  action,
  entityType,
  entityId = null,
  details = {},
  ipAddress = "",
}) => {
  try {
    return await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error("Create audit log error:", error);
    return null;
  }
};

module.exports = {
  getAuditLogs,
  createAuditLog,
};