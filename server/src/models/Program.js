const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    sector: {
      type: String,
      required: true,
      trim: true,
    },

    targetSkills: {
      type: [String],
      default: [],
    },

    durationWeeks: {
      type: Number,
      min: 1,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "COMPLETED", "CLOSED"],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Program", programSchema);
