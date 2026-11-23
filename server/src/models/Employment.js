const mongoose = require("mongoose");

const employmentSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    employerName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      min: 0,
    },

    // Starting salary at the time of employment.
    startingSalary: {
      type: Number,
      min: 0,
    },

    // Current/latest salary for this employment outcome.
    currentSalary: {
      type: Number,
      min: 0,
    },

    // Date when the current salary was recorded.
    salaryUpdatedDate: {
      type: Date,
    },

    employmentDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "EMPLOYED",
        "SELF_EMPLOYED",
        "APPRENTICESHIP",
        "UNEMPLOYED",
        "SEEKING",
        "UNKNOWN",
      ],
      default: "UNKNOWN",
    },

    jobRelevance: {
      type: String,
      enum: [
        "RELEVANT",
        "PARTIALLY_RELEVANT",
        "NOT_RELEVANT",
        "NOT_ASSESSED",
      ],
      default: "NOT_ASSESSED",
    },

    failureReason: {
      type: String,
      default: "",
      trim: true,
    },

    evidenceType: {
      type: String,
      enum: [
        "EMPLOYER_VERIFICATION",
        "OFFER_LETTER",
        "APPOINTMENT_LETTER",
        "PAYSLIP",
        "SELF_DECLARATION",
        "OTHER",
        "NOT_PROVIDED",
      ],
      default: "NOT_PROVIDED",
    },

    evidenceReference: {
      type: String,
      default: "",
      trim: true,
    },

    verificationConfidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employment", employmentSchema);