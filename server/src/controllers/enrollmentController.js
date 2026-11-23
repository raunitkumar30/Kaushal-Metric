const Enrollment = require("../models/Enrollment");
const Trainee = require("../models/Trainee");
const Batch = require("../models/Batch");

const createEnrollment = async (req, res) => {
  try {
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({
        message: "batchId is required",
      });
    }

    if (!req.user.traineeId) {
      return res.status(400).json({
        message: "No trainee profile is linked to this account",
      });
    }

    const trainee = await Trainee.findById(req.user.traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const batch = await Batch.findById(batchId)
      .populate("programId", "name sector")
      .populate("providerId", "name");

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    if (!["UPCOMING", "ACTIVE"].includes(batch.status)) {
      return res.status(400).json({
        message: "This batch is not open for enrollment",
      });
    }

    if (batch.capacity) {
      const currentEnrollmentCount = await Enrollment.countDocuments({
        batchId: batch._id,
        status: { $in: ["ENROLLED", "ACTIVE"] },
      });

      if (currentEnrollmentCount >= batch.capacity) {
        return res.status(400).json({
          message: "This batch is already full",
        });
      }
    }

    const existingEnrollment = await Enrollment.findOne({
      traineeId: trainee._id,
      batchId: batch._id,
      status: { $in: ["ENROLLED", "ACTIVE"] },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this batch",
        enrollment: existingEnrollment,
      });
    }

    const enrollment = await Enrollment.create({
      traineeId: trainee._id,
      batchId: batch._id,
      status: "ENROLLED",
    });

    trainee.batchId = batch._id;
    trainee.status = "ENROLLED";
    await trainee.save();

    const populatedEnrollment = await Enrollment.findById(
      enrollment._id
    )
      .populate("batchId")
      .populate("traineeId", "name email");

    res.status(201).json({
      message: "Enrollment successful",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to enroll in batch",
      error: error.message,
    });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const filter =
      req.user.role === "TRAINEE"
        ? { traineeId: req.user.traineeId }
        : {};

    const enrollments = await Enrollment.find(filter)
      .populate("traineeId", "name email")
      .populate(
        "batchId",
        "name programId providerId startDate endDate capacity status"
      )
      .sort({ createdAt: -1 });

    res.json({
      enrollments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch enrollments",
      error: error.message,
    });
  }
};

module.exports = {
  createEnrollment,
  getEnrollments,
};