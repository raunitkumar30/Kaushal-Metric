const Batch = require("../models/Batch");
const Program = require("../models/Program");

const createBatch = async (req, res) => {
  try {
    const {
      name,
      programId,
      startDate,
      endDate,
      capacity,
    } = req.body;

    // Provider ID comes from the authenticated user
    const providerId =
      req.user.role === "PROVIDER"
        ? req.user.providerId
        : req.body.providerId;

    if (!name || !programId || !providerId || !startDate) {
      return res.status(400).json({
        message:
          "Name, programId, providerId and startDate are required",
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    // Make sure the selected program belongs to this provider
    if (program.providerId.toString() !== providerId.toString()) {
      return res.status(400).json({
        message: "Provider does not belong to this program",
      });
    }

    // Validate dates
    if (endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    // Validate capacity
    if (capacity !== undefined && Number(capacity) <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0",
      });
    }

    const batch = await Batch.create({
      name: name.trim(),
      programId,
      providerId,
      startDate,
      endDate,
      capacity: capacity ? Number(capacity) : undefined,
      status: "UPCOMING",
    });

    res.status(201).json({
      message: "Batch created successfully",
      batch,
    });
  } catch (error) {
    console.error("Create batch error:", error);

    res.status(500).json({
      message: "Failed to create batch",
    });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("programId", "name sector targetSkills")
      .populate("providerId", "name registrationNumber")
      .sort({ createdAt: -1 });

    res.json({
      batches,
    });
  } catch (error) {
    console.error("Get batches error:", error);

    res.status(500).json({
      message: "Failed to fetch batches",
    });
  }
};

module.exports = {
  createBatch,
  getBatches,
};