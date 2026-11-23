const Certification = require("../models/Certification");
const Trainee = require("../models/Trainee");
const Program = require("../models/Program");

const createCertification = async (req, res) => {
  try {
    const {
      traineeId,
      programId,
      certificateNumber,
      issueDate,
    } = req.body;

    if (!traineeId || !programId || !certificateNumber) {
      return res.status(400).json({
        message:
          "traineeId, programId and certificateNumber are required",
      });
    }

    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    const existingCertificate = await Certification.findOne({
      certificateNumber,
    });

    if (existingCertificate) {
      return res.status(409).json({
        message: "Certificate number already exists",
      });
    }

    const certification = await Certification.create({
      traineeId,
      programId,
      certificateNumber,
      issueDate,
      status: "VALID",
    });

    trainee.status = "CERTIFIED";
    await trainee.save();

    res.status(201).json({
      message: "Certification created successfully",
      certification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create certification",
    });
  }
};

const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find()
      .populate("traineeId", "name email")
      .populate("programId", "name sector")
      .sort({ issueDate: -1 });

    res.json({
      certifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch certifications",
    });
  }
};

module.exports = {
  createCertification,
  getCertifications,
};
