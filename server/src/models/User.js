const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["GOVERNMENT", "PROVIDER", "TRAINEE", "EMPLOYER"],
      required: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      default: null,
    },

    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    consent: {
      given: {
        type: Boolean,
        default: false,
      },

      givenAt: {
        type: Date,
        default: null,
      },

      version: {
        type: String,
        default: "1.0",
        trim: true,
      },

      purpose: {
        type: String,
        default:
          "Consent for storing and using training, assessment, certification and employment outcome data for KaushalMetric Tracker services and analytics.",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);