const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    maxScore: {
      type: Number,
      default: 100,
      min: 1,
    },

    assessmentDate: {
      type: Date,
      default: Date.now,
    },

    assessor: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
