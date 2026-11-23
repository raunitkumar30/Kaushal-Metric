const FollowUp = require("../models/FollowUp");

const createFollowUp = async (req, res) => {
  try {
    const { traineeId, type, scheduledDate } = req.body;

    if (!traineeId || !type || !scheduledDate) {
      return res.status(400).json({
        message: "traineeId, type and scheduledDate are required",
      });
    }

    const followUp = await FollowUp.create({
      traineeId,
      type,
      scheduledDate,
    });

    res.status(201).json({
      message: "Follow-up created successfully",
      followUp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create follow-up",
      error: error.message,
    });
  }
};

const getFollowUps = async (req, res) => {
  try {
    const filter =
      req.user.role === "TRAINEE"
        ? { traineeId: req.user.traineeId }
        : {};

    const followUps = await FollowUp.find(filter)
      .populate("traineeId", "name email")
      .sort({ scheduledDate: 1 });

    res.json({
      followUps,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch follow-ups",
      error: error.message,
    });
  }
};

const updateFollowUp = async (req, res) => {
  try {
    const { followUpId } = req.params;

    const followUp = await FollowUp.findByIdAndUpdate(
      followUpId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!followUp) {
      return res.status(404).json({
        message: "Follow-up not found",
      });
    }

    res.json({
      message: "Follow-up updated successfully",
      followUp,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update follow-up",
      error: error.message,
    });
  }
};

module.exports = {
  createFollowUp,
  getFollowUps,
  updateFollowUp,
};