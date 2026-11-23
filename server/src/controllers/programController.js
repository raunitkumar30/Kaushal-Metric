const Program = require("../models/Program");
const { createAuditLog } = require("./auditLogController");

const createProgram = async (req, res) => {
  try {
    const {
      name,
      description,
      sector,
      targetSkills,
      durationWeeks,
      providerId,
    } = req.body;

    if (!name || !sector || !providerId) {
      return res.status(400).json({
        message: "Name, sector and providerId are required",
      });
    }

    const program = await Program.create({
      name,
      description,
      sector,
      targetSkills: targetSkills || [],
      durationWeeks,
      providerId,
      status: "DRAFT",
    });

    await createAuditLog({
      userId: req.user?.id || null,
      action: "PROGRAM_CREATED",
      entityType: "Program",
      entityId: program._id,
      details: {
        name: program.name,
        sector: program.sector,
        providerId: program.providerId,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "Program created successfully",
      program,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create program",
    });
  }
};

const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate("providerId", "name registrationNumber")
      .sort({ createdAt: -1 });

    res.json({
      programs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch programs",
    });
  }
};

module.exports = {
  createProgram,
  getPrograms,
};