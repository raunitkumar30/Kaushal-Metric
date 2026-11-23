const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const traineeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
      type: String,
      default: "",
      trim: true,
    },

    skillOutcomeId: {
      type: String,
      unique: true,
      index: true,
      default: () => `SO-${randomUUID()}`,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        level: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
      },
    ],

    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "ENROLLED",
        "TRAINING",
        "CERTIFIED",
        "DROPPED",
        "COMPLETED",
        "ACTIVE",
      ],
      default: "ENROLLED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trainee", traineeSchema);