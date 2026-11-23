const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

    contactEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Provider", providerSchema);
