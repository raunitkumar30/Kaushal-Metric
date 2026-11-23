const Employment = require("../models/Employment");
const Trainee = require("../models/Trainee");

const createEmployment = async (req, res) => {
  try {
    const {
      traineeId,
      employerName,
      jobTitle,
      salary,
      startingSalary,
      currentSalary,
      salaryUpdatedDate,
      employmentDate,
      status,
      jobRelevance,
      failureReason,
      evidenceType,
      evidenceReference,
      verificationConfidence,
      verified,
    } = req.body;

    if (!traineeId || !employerName || !jobTitle || !employmentDate) {
      return res.status(400).json({
        message:
          "traineeId, employerName, jobTitle and employmentDate are required",
      });
    }

    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const allowedStatuses = [
      "EMPLOYED",
      "SELF_EMPLOYED",
      "APPRENTICESHIP",
      "UNEMPLOYED",
      "SEEKING",
      "UNKNOWN",
    ];

    const employmentStatus = status || "UNKNOWN";

    if (!allowedStatuses.includes(employmentStatus)) {
      return res.status(400).json({
        message: `Invalid employment status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const allowedJobRelevance = [
      "RELEVANT",
      "PARTIALLY_RELEVANT",
      "NOT_RELEVANT",
      "NOT_ASSESSED",
    ];

    const employmentJobRelevance =
      jobRelevance || "NOT_ASSESSED";

    if (!allowedJobRelevance.includes(employmentJobRelevance)) {
      return res.status(400).json({
        message: `Invalid job relevance. Allowed values: ${allowedJobRelevance.join(
          ", "
        )}`,
      });
    }

    const allowedEvidenceTypes = [
      "EMPLOYER_VERIFICATION",
      "OFFER_LETTER",
      "APPOINTMENT_LETTER",
      "PAYSLIP",
      "SELF_DECLARATION",
      "OTHER",
      "NOT_PROVIDED",
    ];

    const employmentEvidenceType =
      evidenceType || "NOT_PROVIDED";

    if (!allowedEvidenceTypes.includes(employmentEvidenceType)) {
      return res.status(400).json({
        message: `Invalid evidence type. Allowed values: ${allowedEvidenceTypes.join(
          ", "
        )}`,
      });
    }

    const confidence =
      verificationConfidence === undefined ||
      verificationConfidence === ""
        ? 0
        : Number(verificationConfidence);

    if (
      !Number.isFinite(confidence) ||
      confidence < 0 ||
      confidence > 100
    ) {
      return res.status(400).json({
        message:
          "verificationConfidence must be a number between 0 and 100",
      });
    }

    const starting =
      startingSalary === undefined || startingSalary === ""
        ? salary
        : Number(startingSalary);

    const current =
      currentSalary === undefined || currentSalary === ""
        ? starting
        : Number(currentSalary);

    if (
      starting !== undefined &&
      starting !== null &&
      (!Number.isFinite(Number(starting)) || Number(starting) < 0)
    ) {
      return res.status(400).json({
        message: "startingSalary must be a valid non-negative number",
      });
    }

    if (
      current !== undefined &&
      current !== null &&
      (!Number.isFinite(Number(current)) || Number(current) < 0)
    ) {
      return res.status(400).json({
        message: "currentSalary must be a valid non-negative number",
      });
    }

    const employment = await Employment.create({
      traineeId,
      employerName: employerName.trim(),
      jobTitle: jobTitle.trim(),
      salary,
      startingSalary:
        starting !== undefined && starting !== null
          ? Number(starting)
          : undefined,
      currentSalary:
        current !== undefined && current !== null
          ? Number(current)
          : undefined,
      salaryUpdatedDate:
        salaryUpdatedDate || undefined,
      employmentDate,
      status: employmentStatus,
      jobRelevance: employmentJobRelevance,
      failureReason: failureReason
        ? failureReason.trim()
        : "",
      evidenceType: employmentEvidenceType,
      evidenceReference: evidenceReference
        ? evidenceReference.trim()
        : "",
      verificationConfidence: confidence,
      verified: verified === true,
    });

    res.status(201).json({
      message: "Employment outcome created successfully",
      employment,
    });
  } catch (error) {
    console.error("Create employment error:", error);

    res.status(500).json({
      message: "Failed to create employment outcome",
      error: error.message,
    });
  }
};

const getEmployments = async (req, res) => {
  try {
    const filter =
      req.user.role === "TRAINEE"
        ? { traineeId: req.user.traineeId }
        : {};

    const employments = await Employment.find(filter)
      .populate("traineeId", "name email")
      .sort({ employmentDate: -1 });

    res.json({
      employments,
    });
  } catch (error) {
    console.error("Get employment outcomes error:", error);

    res.status(500).json({
      message: "Failed to fetch employment outcomes",
      error: error.message,
    });
  }
};

module.exports = {
  createEmployment,
  getEmployments,
};