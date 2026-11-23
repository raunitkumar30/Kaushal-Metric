const Intervention = require("../models/Intervention");
const Trainee = require("../models/Trainee");

const createIntervention = async (req, res) => {
  try {
    const {
      traineeId,
      type,
      reason,
      action,
      status,
      assignedTo,
      startDate,
      completionDate,
      outcome,
    } = req.body;

    if (!traineeId || !type || !reason || !action) {
      return res.status(400).json({
        message:
          "traineeId, type, reason and action are required",
      });
    }

    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const intervention = await Intervention.create({
      traineeId,
      type,
      reason,
      action,
      status: status || "PLANNED",
      assignedTo: assignedTo || "",
      startDate: startDate || new Date(),
      completionDate,
      outcome: outcome || "",
    });

    res.status(201).json({
      message: "Intervention created successfully",
      intervention,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create intervention",
    });
  }
};

const getInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find()
      .populate("traineeId", "name email status")
      .sort({
        createdAt: -1,
      });

    res.json({
      interventions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch interventions",
    });
  }
};

const updateIntervention = async (req, res) => {
  try {
    const { interventionId } = req.params;

    const intervention =
      await Intervention.findById(
        interventionId
      );

    if (!intervention) {
      return res.status(404).json({
        message: "Intervention not found",
      });
    }

    const allowedFields = [
      "type",
      "reason",
      "action",
      "status",
      "assignedTo",
      "startDate",
      "completionDate",
      "outcome",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        intervention[field] = req.body[field];
      }
    });

    await intervention.save();

    res.json({
      message: "Intervention updated successfully",
      intervention,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update intervention",
    });
  }
};

module.exports = {
  createIntervention,
  getInterventions,
  updateIntervention,
};