const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    type: {
      type: String,
      enum: ["30_DAY", "90_DAY"],
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    completedDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "SKIPPED"],
      default: "PENDING",
    },

    currentlyEmployed: {
      type: Boolean,
    },

    sameRole: {
      type: Boolean,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", followUpSchema);