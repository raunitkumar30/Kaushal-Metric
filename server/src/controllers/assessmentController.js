const Assessment = require("../models/Assessment");
const Trainee = require("../models/Trainee");

const createAssessment = async (req, res) => {
  try {
    const {
      traineeId,
      skill,
      score,
      maxScore,
      assessmentDate,
      assessor,
    } = req.body;

    if (!traineeId || !skill || score === undefined) {
      return res.status(400).json({
        message:
          "traineeId, skill and score are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        message: "Score must be between 0 and 100",
      });
    }

    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const assessment = await Assessment.create({
      traineeId,
      skill: skill.trim(),
      score,
      maxScore: maxScore || 100,
      assessmentDate:
        assessmentDate || new Date(),
      assessor: assessor || "",
    });

    // --------------------------------------------------------
    // Keep the trainee's skill profile synchronized
    // with the latest assessment.
    // --------------------------------------------------------

    const existingSkillIndex =
      trainee.skills.findIndex(
        (item) =>
          item.name.toLowerCase().trim() ===
          skill.toLowerCase().trim()
      );

    if (existingSkillIndex >= 0) {
      trainee.skills[existingSkillIndex].level =
        Number(score);
    } else {
      trainee.skills.push({
        name: skill.trim(),
        level: Number(score),
      });
    }

    await trainee.save();

    res.status(201).json({
      message: "Assessment recorded successfully",
      assessment,
      traineeSkill: {
        name: skill.trim(),
        level: Number(score),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create assessment",
    });
  }
};

const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("traineeId", "name email")
      .sort({
        assessmentDate: -1,
        createdAt: -1,
      });

    res.json({
      assessments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch assessments",
    });
  }
};

module.exports = {
  createAssessment,
  getAssessments,
};