const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    capacity: {
      type: Number,
      min: 1,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "UPCOMING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Batch", batchSchema);
