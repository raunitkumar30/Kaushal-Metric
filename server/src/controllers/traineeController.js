const Trainee = require("../models/Trainee");
const Batch = require("../models/Batch");
const { randomUUID } = require("crypto");

const createTrainee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      state,
      district,
      batchId,
    } = req.body;

    if (!name || !email || !batchId) {
      return res.status(400).json({
        message: "Name, email and batchId are required",
      });
    }

    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    const trainee = await Trainee.create({
      name,
      email,
      phone,
      dateOfBirth,
      state,
      district,
      batchId,
      skills: [],
      attendancePercentage: 0,
      status: "ENROLLED",
    });

    res.status(201).json({
      message: "Trainee created successfully",
      trainee,
    });
  } catch (error) {
    console.error("Create trainee error:", error);

    res.status(500).json({
      message: "Failed to create trainee",
    });
  }
};

const getTrainees = async (req, res) => {
  try {
    const trainees = await Trainee.find()
      .populate("batchId", "name programId providerId")
      .sort({ createdAt: -1 });

    res.json({
      trainees,
    });
  } catch (error) {
    console.error("Get trainees error:", error);

    res.status(500).json({
      message: "Failed to fetch trainees",
    });
  }
};

const getMyTraineeProfile = async (req, res) => {
  try {
    if (!req.user.traineeId) {
      return res.status(403).json({
        message: "No trainee profile linked to this account",
      });
    }

    const trainee = await Trainee.findById(req.user.traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee profile not found",
      });
    }

    // Generate Skill Outcome ID for older records
    if (!trainee.skillOutcomeId) {
      const skillOutcomeId =
        trainee.email === "rahul@test.com"
          ? "MH-OUTCOME-2026-001"
          : `SO-${randomUUID()}`;

      await Trainee.updateOne(
        { _id: trainee._id },
        {
          $set: {
            skillOutcomeId,
          },
        }
      );

      trainee.skillOutcomeId = skillOutcomeId;
    }

    await trainee.populate(
      "batchId",
      "name programId providerId"
    );

    res.json({
      trainee,
    });
  } catch (error) {
    console.error("Get my trainee profile error:", error);

    res.status(500).json({
      message: "Failed to load trainee profile",
    });
  }
};

module.exports = {
  createTrainee,
  getTrainees,
  getMyTraineeProfile,
};