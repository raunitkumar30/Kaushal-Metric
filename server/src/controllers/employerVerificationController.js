const EmployerVerification = require("../models/EmployerVerification");

const createVerification = async (req, res) => {
  try {
    const {
      traineeId,
      employmentId,
      employerName,
    } = req.body;

    if (!traineeId || !employmentId || !employerName) {
      return res.status(400).json({
        message: "traineeId, employmentId and employerName are required",
      });
    }

    const verification = await EmployerVerification.create({
      traineeId,
      employmentId,
      employerName,
    });

    res.status(201).json({
      message: "Employer verification created successfully",
      verification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create employer verification",
      error: error.message,
    });
  }
};

const getVerifications = async (req, res) => {
  try {
    const verifications = await EmployerVerification.find()
      .populate("traineeId", "name email")
      .populate(
        "employmentId",
        "employerName jobTitle employmentDate status verified"
      )
      .sort({ createdAt: -1 });

    res.json({
      verifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employer verifications",
      error: error.message,
    });
  }
};

const updateVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const {
      status,
      verifiedBy,
      notes,
    } = req.body;

    const verification = await EmployerVerification.findByIdAndUpdate(
      verificationId,
      {
        status,
        verifiedBy,
        notes,
        verifiedAt:
          status === "VERIFIED"
            ? new Date()
            : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!verification) {
      return res.status(404).json({
        message: "Employer verification not found",
      });
    }

    res.json({
      message: "Employer verification updated successfully",
      verification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employer verification",
      error: error.message,
    });
  }
};

module.exports = {
  createVerification,
  getVerifications,
  updateVerification,
};