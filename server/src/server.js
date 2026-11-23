const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const programRoutes = require("./routes/programRoutes");
const providerRoutes = require("./routes/providerRoutes");
const batchRoutes = require("./routes/batchRoutes");
const traineeRoutes = require("./routes/traineeRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const employmentRoutes = require("./routes/employmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const aiRoutes = require("./routes/aiRoutes");
const governmentRoutes = require("./routes/governmentRoutes");
const interventionRoutes = require("./routes/interventionRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const employerVerificationRoutes = require("./routes/employerVerificationRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const demoRoutes = require("./routes/demoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/*
 * ---------------------------------------------------------
 * AUTH
 * ---------------------------------------------------------
 */

app.use("/api/auth", authRoutes);

/*
 * ---------------------------------------------------------
 * CORE KAUSHALMETRIC TRACKER MODULES
 * ---------------------------------------------------------
 */

app.use("/api/programs", programRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/trainees", traineeRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/employments", employmentRoutes);
app.use("/api/attendance", attendanceRoutes);

/*
 * ---------------------------------------------------------
 * AI
 * ---------------------------------------------------------
 */

app.use("/api/ai", aiRoutes);

/*
 * ---------------------------------------------------------
 * GOVERNMENT
 * ---------------------------------------------------------
 */

app.use("/api/government", governmentRoutes);

/*
 * ---------------------------------------------------------
 * PROVIDER INTERVENTIONS / FOLLOW UPS
 * ---------------------------------------------------------
 */

app.use("/api/interventions", interventionRoutes);
app.use("/api/followups", followUpRoutes);

/*
 * ---------------------------------------------------------
 * EMPLOYER VERIFICATION
 * ---------------------------------------------------------
 */

app.use(
  "/api/employer-verifications",
  employerVerificationRoutes
);

/*
 * ---------------------------------------------------------
 * ENROLLMENTS
 * ---------------------------------------------------------
 */

app.use("/api/enrollments", enrollmentRoutes);

/*
 * ---------------------------------------------------------
 * AUDIT LOGS
 * ---------------------------------------------------------
 */

app.use("/api/audit-logs", auditLogRoutes);

/*
 * ---------------------------------------------------------
 * DEMO FLOW
 *
 * Government can use:
 *
 * POST /api/demo/reset-and-load
 *
 * This clears operational data and loads the complete
 * interconnected demonstration scenario.
 * ---------------------------------------------------------
 */

app.use("/api/demo", demoRoutes);

/*
 * ---------------------------------------------------------
 * ROOT
 * ---------------------------------------------------------
 */

app.get("/", (req, res) => {
  res.json({
    service: "KaushalMetric Tracker API",
    status: "running",
    version: "1.0.0",
  });
});

/*
 * ---------------------------------------------------------
 * HEALTH CHECK
 * ---------------------------------------------------------
 */

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

/*
 * ---------------------------------------------------------
 * SERVER
 * ---------------------------------------------------------
 */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`KaushalMetric Tracker API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start KaushalMetric Tracker API:", error);
    process.exit(1);
  }
};

startServer();