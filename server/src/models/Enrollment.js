const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    traineeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainee",
      required: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    enrolledDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "ENROLLED",
        "ACTIVE",
        "COMPLETED",
        "DROPPED",
        "CANCELLED",
      ],
      default: "ENROLLED",
    },

    completionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index(
  { traineeId: 1, batchId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);