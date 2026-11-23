const mongoose = require("mongoose");

const interventionSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "SKILL_TRAINING",
        "MENTORING",
        "ATTENDANCE_SUPPORT",
        "PLACEMENT_SUPPORT",
        "OTHER",
      ],
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLANNED",
    },

    assignedTo: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    completionDate: {
      type: Date,
    },

    outcome: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Intervention",
  interventionSchema
);