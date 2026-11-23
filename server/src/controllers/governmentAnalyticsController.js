const Program = require("../models/Program");
const Batch = require("../models/Batch");
const Trainee = require("../models/Trainee");
const Employment = require("../models/Employment");
const EmployerVerification = require("../models/EmployerVerification");

const getGovernmentOutcomeAnalytics = async (req, res) => {
  try {
    const [
      programs,
      batches,
      trainees,
      employments,
      employerVerifications,
    ] = await Promise.all([
      Program.find()
        .populate("providerId", "name registrationNumber")
        .lean(),

      Batch.find()
        .populate("programId", "name sector")
        .populate("providerId", "name registrationNumber")
        .lean(),

      Trainee.find().lean(),

      Employment.find()
        .sort({ employmentDate: -1, createdAt: -1 })
        .lean(),

      EmployerVerification.find()
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const batchMap = new Map(
      batches.map((batch) => [String(batch._id), batch])
    );

    const programMap = new Map(
      programs.map((program) => [String(program._id), program])
    );

    const latestEmploymentByTrainee = new Map();

    for (const employment of employments) {
      const traineeId = String(
        employment.traineeId?._id || employment.traineeId
      );

      if (!latestEmploymentByTrainee.has(traineeId)) {
        latestEmploymentByTrainee.set(traineeId, employment);
      }
    }

    const latestVerificationByEmployment = new Map();

    for (const verification of employerVerifications) {
      const employmentId = String(
        verification.employmentId?._id ||
          verification.employmentId
      );

      if (!latestVerificationByEmployment.has(employmentId)) {
        latestVerificationByEmployment.set(
          employmentId,
          verification
        );
      }
    }

    const districtMap = new Map();
    const programAnalyticsMap = new Map();
    const providerAnalyticsMap = new Map();

    for (const trainee of trainees) {
      const traineeId = String(trainee._id);

      const batch = trainee.batchId
        ? batchMap.get(
            String(
              trainee.batchId?._id || trainee.batchId
            )
          )
        : null;

      const program = batch?.programId
        ? programMap.get(
            String(
              batch.programId?._id || batch.programId
            )
          )
        : null;

      const provider = program?.providerId || batch?.providerId;

      const district =
        trainee.district?.trim() || "Unknown";

      const employment =
        latestEmploymentByTrainee.get(traineeId);

      const outcomeStatus =
        employment?.status || "UNKNOWN";

      const verification = employment
        ? latestVerificationByEmployment.get(
            String(employment._id)
          )
        : null;

      const verificationStatus =
        verification?.status || "NOT_SUBMITTED";

      const updateGroup = (group) => {
        group.trainees += 1;

        if (employment) {
          group.outcomeRecorded += 1;
        }

        if (outcomeStatus === "EMPLOYED") {
          group.employed += 1;
        } else if (outcomeStatus === "SEEKING") {
          group.seeking += 1;
        } else if (outcomeStatus === "UNEMPLOYED") {
          group.unemployed += 1;
        } else {
          group.unknown += 1;
        }

        if (verificationStatus === "VERIFIED") {
          group.verified += 1;
        } else if (verificationStatus === "PENDING") {
          group.pendingVerification += 1;
        } else if (verificationStatus === "REJECTED") {
          group.rejectedVerification += 1;
        }
      };

      if (!districtMap.has(district)) {
        districtMap.set(district, {
          district,
          trainees: 0,
          outcomeRecorded: 0,
          employed: 0,
          seeking: 0,
          unemployed: 0,
          unknown: 0,
          verified: 0,
          pendingVerification: 0,
          rejectedVerification: 0,
        });
      }

      updateGroup(districtMap.get(district));

      if (program) {
        const programId = String(program._id);

        if (!programAnalyticsMap.has(programId)) {
          programAnalyticsMap.set(programId, {
            programId: program._id,
            programName: program.name,
            sector: program.sector || "",
            providerName:
              program.providerId?.name || "Unknown",
            trainees: 0,
            outcomeRecorded: 0,
            employed: 0,
            seeking: 0,
            unemployed: 0,
            unknown: 0,
            verified: 0,
            pendingVerification: 0,
            rejectedVerification: 0,
          });
        }

        updateGroup(
          programAnalyticsMap.get(programId)
        );
      }

      if (provider?._id) {
        const providerId = String(provider._id);

        if (!providerAnalyticsMap.has(providerId)) {
          providerAnalyticsMap.set(providerId, {
            providerId: provider._id,
            providerName: provider.name || "Unknown",
            registrationNumber:
              provider.registrationNumber || "",
            programs: 0,
            trainees: 0,
            outcomeRecorded: 0,
            employed: 0,
            seeking: 0,
            unemployed: 0,
            unknown: 0,
            verified: 0,
            pendingVerification: 0,
            rejectedVerification: 0,
          });
        }

        updateGroup(
          providerAnalyticsMap.get(providerId)
        );
      }
    }

    // Count programs belonging to each provider.
    for (const program of programs) {
      if (!program.providerId?._id) {
        continue;
      }

      const providerId = String(program.providerId._id);

      if (!providerAnalyticsMap.has(providerId)) {
        providerAnalyticsMap.set(providerId, {
          providerId: program.providerId._id,
          providerName:
            program.providerId.name || "Unknown",
          registrationNumber:
            program.providerId.registrationNumber || "",
          programs: 0,
          trainees: 0,
          outcomeRecorded: 0,
          employed: 0,
          seeking: 0,
          unemployed: 0,
          unknown: 0,
          verified: 0,
          pendingVerification: 0,
          rejectedVerification: 0,
        });
      }

      providerAnalyticsMap.get(providerId).programs += 1;
    }

    const addRates = (items) =>
      items.map((item) => ({
        ...item,

        outcomeCoverage:
          item.trainees > 0
            ? Math.round(
                (item.outcomeRecorded /
                  item.trainees) *
                  100
              )
            : 0,

        employmentRate:
          item.trainees > 0
            ? Math.round(
                (item.employed /
                  item.trainees) *
                  100
              )
            : 0,

        verificationRate:
          item.outcomeRecorded > 0
            ? Math.round(
                (item.verified /
                  item.outcomeRecorded) *
                  100
              )
            : 0,
      }));

    const byDistrict = addRates(
      Array.from(districtMap.values()).sort(
        (a, b) => b.trainees - a.trainees
      )
    );

    const byProgram = addRates(
      Array.from(
        programAnalyticsMap.values()
      ).sort(
        (a, b) => b.trainees - a.trainees
      )
    );

    const byProvider = addRates(
      Array.from(
        providerAnalyticsMap.values()
      ).sort(
        (a, b) => b.trainees - a.trainees
      )
    );

    // Identify providers that may require Government review.
    const providerReview = byProvider.map((provider) => {
      const reasons = [];

      if (
        provider.trainees > 0 &&
        provider.outcomeCoverage < 70
      ) {
        reasons.push("LOW_OUTCOME_COVERAGE");
      }

      if (
        provider.outcomeRecorded > 0 &&
        provider.verificationRate < 70
      ) {
        reasons.push("LOW_VERIFICATION_RATE");
      }

      if (
        provider.trainees > 0 &&
        provider.employmentRate < 30
      ) {
        reasons.push("LOW_EMPLOYMENT_RATE");
      }

      let reviewStatus = "GOOD";

      if (reasons.length >= 2) {
        reviewStatus = "REVIEW_REQUIRED";
      } else if (reasons.length === 1) {
        reviewStatus = "MONITOR";
      }

      return {
        providerId: provider.providerId,
        providerName: provider.providerName,
        registrationNumber:
          provider.registrationNumber,
        reviewStatus,
        reasons,
      };
    });

    const verificationSummary = {
      totalEmploymentOutcomes: employments.length,

      verified: employerVerifications.filter(
        (item) => item.status === "VERIFIED"
      ).length,

      pending: employerVerifications.filter(
        (item) => item.status === "PENDING"
      ).length,

      rejected: employerVerifications.filter(
        (item) => item.status === "REJECTED"
      ).length,

      notSubmitted: trainees.filter((trainee) => {
        const employment =
          latestEmploymentByTrainee.get(
            String(trainee._id)
          );

        if (!employment) {
          return true;
        }

        return !latestVerificationByEmployment.has(
          String(employment._id)
        );
      }).length,
    };

    verificationSummary.verificationCoverage =
      verificationSummary.totalEmploymentOutcomes > 0
        ? Math.round(
            (verificationSummary.verified /
              verificationSummary.totalEmploymentOutcomes) *
              100
          )
        : 0;

    const summary = {
      totalPrograms: programs.length,
      totalBatches: batches.length,
      totalTrainees: trainees.length,

      traineesWithOutcome:
        Array.from(
          latestEmploymentByTrainee.keys()
        ).length,

      employed: trainees.filter((trainee) => {
        const employment =
          latestEmploymentByTrainee.get(
            String(trainee._id)
          );

        return employment?.status === "EMPLOYED";
      }).length,

      seeking: trainees.filter((trainee) => {
        const employment =
          latestEmploymentByTrainee.get(
            String(trainee._id)
          );

        return employment?.status === "SEEKING";
      }).length,

      unemployed: trainees.filter((trainee) => {
        const employment =
          latestEmploymentByTrainee.get(
            String(trainee._id)
          );

        return employment?.status === "UNEMPLOYED";
      }).length,

      unknown: trainees.filter((trainee) => {
        const employment =
          latestEmploymentByTrainee.get(
            String(trainee._id)
          );

        return (
          !employment ||
          employment.status === "UNKNOWN"
        );
      }).length,

      providersAnalyzed: byProvider.length,

      providersRequiringReview:
        providerReview.filter(
          (item) =>
            item.reviewStatus === "REVIEW_REQUIRED"
        ).length,

      providersToMonitor:
        providerReview.filter(
          (item) =>
            item.reviewStatus === "MONITOR"
        ).length,
    };

    summary.outcomeCoverage =
      summary.totalTrainees > 0
        ? Math.round(
            (summary.traineesWithOutcome /
              summary.totalTrainees) *
              100
          )
        : 0;

    summary.employmentRate =
      summary.totalTrainees > 0
        ? Math.round(
            (summary.employed /
              summary.totalTrainees) *
              100
          )
        : 0;

    res.json({
      summary,
      verificationSummary,
      byDistrict,
      byProgram,
      byProvider,
      providerReview,
    });
  } catch (error) {
    console.error(
      "Government outcome analytics error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate Government outcome analytics",
    });
  }
};

module.exports = {
  getGovernmentOutcomeAnalytics,
};