const mongoose = require("mongoose");

const employerVerificationSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    employmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employment",
      required: true,
    },

    employerName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    verifiedBy: {
      type: String,
      default: "",
      trim: true,
    },

    verifiedAt: {
      type: Date,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EmployerVerification",
  employerVerificationSchema
);