const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["VALID", "REVOKED"],
      default: "VALID",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certification", certificationSchema);
