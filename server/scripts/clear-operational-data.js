const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User");
const Provider = require("../src/models/Provider");
const Program = require("../src/models/Program");
const Batch = require("../src/models/Batch");
const Trainee = require("../src/models/Trainee");
const Assessment = require("../src/models/Assessment");
const Certification = require("../src/models/Certification");
const Employment = require("../src/models/Employment");
const FollowUp = require("../src/models/FollowUp");
const Intervention = require("../src/models/Intervention");
const EmployerVerification = require("../src/models/EmployerVerification");
const Attendance = require("../src/models/Attendance");
const Enrollment = require("../src/models/Enrollment");
const AuditLog = require("../src/models/AuditLog");

async function clearData() {
  const targetUri = process.env.MONGODB_URI || "mongodb://localhost:27017/skillimpact";
  console.log("Connecting to MongoDB:", targetUri);

  await mongoose.connect(targetUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("Connected to MongoDB successfully!");
  console.log("Starting data wipe while preserving demo accounts for Maharashtra SIH...\n");

  // 1. Delete all operational data
  const delOps = await Promise.all([
    Program.deleteMany({}),
    Batch.deleteMany({}),
    Assessment.deleteMany({}),
    Attendance.deleteMany({}),
    Certification.deleteMany({}),
    Employment.deleteMany({}),
    EmployerVerification.deleteMany({}),
    Enrollment.deleteMany({}),
    FollowUp.deleteMany({}),
    Intervention.deleteMany({}),
    AuditLog.deleteMany({}),

    // Delete any non-demo users
    User.deleteMany({
      email: {
        $nin: [
          "gov@test.com",
          "provider@test.com",
          "rahul@test.com",
          "employer@test.com",
        ],
      },
    }),

    // Delete any providers not linked to provider@test.com
    Provider.deleteMany({ contactEmail: { $ne: "provider@test.com" } }),

    // Delete any trainees not linked to rahul@test.com
    Trainee.deleteMany({ email: { $ne: "rahul@test.com" } }),
  ]);

  console.log("Deleted operational records across all collections.");

  // 2. Hash default passwords
  const governmentPassword = await bcrypt.hash("Test123456", 10);
  const providerPassword = await bcrypt.hash("Provider123456", 10);
  const traineePassword = await bcrypt.hash("Trainee123456", 10);
  const employerPassword = await bcrypt.hash("employer123", 10);

  // 3. Upsert clean Maharashtra Training Provider
  const provider = await Provider.findOneAndUpdate(
    { contactEmail: "provider@test.com" },
    {
      name: "Maharashtra State Skill Development Center (MSSDS Pune)",
      registrationNumber: "MH-MSSDS-2026-001",
      state: "Maharashtra",
      district: "Pune",
      contactEmail: "provider@test.com",
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 4. Upsert clean Maharashtra Trainee Candidate (Rahul Patil)
  const trainee = await Trainee.findOneAndUpdate(
    { email: "rahul@test.com" },
    {
      name: "Rahul Patil",
      email: "rahul@test.com",
      phone: "9876543210",
      state: "Maharashtra",
      district: "Pune",
      batchId: null, // completely unassigned, ready to enroll in newly created batch
      attendancePercentage: 0,
      consent: { analytics: true, aiRecommendations: true },
      status: "ACTIVE",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 5. Upsert 4 Permanent Demo User Accounts
  await Promise.all([
    User.findOneAndUpdate(
      { email: "gov@test.com" },
      {
        name: "Maharashtra Skill Development Authority",
        email: "gov@test.com",
        password: governmentPassword,
        role: "GOVERNMENT",
        providerId: null,
        traineeId: null,
        consent: { analytics: true, aiRecommendations: true },
        isActive: true,
      },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: "provider@test.com" },
      {
        name: "Maharashtra State Skill Center",
        email: "provider@test.com",
        password: providerPassword,
        role: "PROVIDER",
        providerId: provider._id,
        traineeId: null,
        consent: { analytics: true, aiRecommendations: true },
        isActive: true,
      },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: "rahul@test.com" },
      {
        name: "Rahul Patil",
        email: "rahul@test.com",
        password: traineePassword,
        role: "TRAINEE",
        providerId: null,
        traineeId: trainee._id,
        consent: { analytics: true, aiRecommendations: true },
        isActive: true,
      },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: "employer@test.com" },
      {
        name: "Pune Tech Solutions & Enterprises",
        email: "employer@test.com",
        password: employerPassword,
        role: "EMPLOYER",
        providerId: null,
        traineeId: null,
        consent: { analytics: true, aiRecommendations: true },
        isActive: true,
      },
      { upsert: true, new: true }
    ),
  ]);

  // 6. Count documents in all collections
  const counts = {
    users: await User.countDocuments(),
    providers: await Provider.countDocuments(),
    trainees: await Trainee.countDocuments(),
    programs: await Program.countDocuments(),
    batches: await Batch.countDocuments(),
    assessments: await Assessment.countDocuments(),
    attendance: await Attendance.countDocuments(),
    certifications: await Certification.countDocuments(),
    employments: await Employment.countDocuments(),
    employerVerifications: await EmployerVerification.countDocuments(),
    enrollments: await Enrollment.countDocuments(),
    followUps: await FollowUp.countDocuments(),
    interventions: await Intervention.countDocuments(),
    auditLogs: await AuditLog.countDocuments(),
  };

  console.log("\n=======================================================");
  console.log("       CLEAN SLATE RESULT (MAHARASHTRA SIH)           ");
  console.log("=======================================================");
  console.table(counts);

  console.log("\nPreserved Demo Login Credentials:");
  console.log("  1. Government : gov@test.com       / Test123456");
  console.log("  2. Provider   : provider@test.com  / Provider123456");
  console.log("  3. Trainee    : rahul@test.com     / Trainee123456");
  console.log("  4. Employer   : employer@test.com  / employer123");

  console.log("\nActive Maharashtra Anchors:");
  console.log("  • Provider :", provider.name, `(${provider.district}, ${provider.state})`);
  console.log("  • Trainee  :", trainee.name, `(${trainee.district}, ${trainee.state}) - Batch: Unassigned`);
  console.log("=======================================================\n");

  await mongoose.disconnect();
  console.log("Database disconnected. Clean slate ready!");
}

clearData().catch((err) => {
  console.error("Error clearing operational data:", err);
  process.exit(1);
});
