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

async function injectBulkData() {
  console.log("Preparing bulk Maharashtra SIH data injection...");
  // We can also trigger this via HTTP to the running server so it affects the active in-memory instance directly!
  const BASE = "http://localhost:5000/api";

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "gov@test.com", password: "Test123456" }),
  });
  const { token } = await loginRes.json();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Get current provider
  const provRes = await fetch(`${BASE}/providers`, { headers });
  const { providers } = await provRes.json();
  const providerId = providers[0]?._id;

  if (!providerId) {
    console.error("No provider found!");
    process.exit(1);
  }

  console.log("Using Provider:", providers[0].name, providerId);

  // Programs to ensure exist
  const bulkPrograms = [
    {
      name: "MSSDS Healthcare - Emergency Medical Technician (EMT)",
      sector: "Healthcare & Life Sciences",
      durationWeeks: 16,
      targetSkills: ["Trauma Care", "Patient Stabilization", "CPR Certification", "Medical Transport"],
      description: "State certification preparing frontline paramedics and ambulance emergency teams across Maharashtra district hospitals.",
      providerId,
    },
    {
      name: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance",
      sector: "Renewable Energy",
      durationWeeks: 8,
      targetSkills: ["Solar Grid Sync", "Inverter Diagnostics", "Rooftop Mounting", "DC Circuitry"],
      description: "Clean power workforce initiative supporting Maharashtra's solar rooftop target with hands-on grid synchronization skills.",
      providerId,
    },
    {
      name: "Maharashtra FinTech - Digital Banking & Fraud Operations",
      sector: "Banking & Financial Services",
      durationWeeks: 10,
      targetSkills: ["KYC Compliance", "Payment Gateway Protocols", "Fraud Detection", "Financial Ledger"],
      description: "Fast-track BFSI cohort designed with Mumbai financial hubs for digital banking customer onboarding and anti-fraud monitoring.",
      providerId,
    },
    {
      name: "Precision CNC Automation & Industrial Robotics",
      sector: "Automotive & Heavy Engineering",
      durationWeeks: 14,
      targetSkills: ["CNC Programming", "G-Code", "Quality Metrology", "Robotic Arm Operation"],
      description: "Advanced manufacturing apprenticeship serving Chakan-Talegaon automotive corridor for automated robotic assembly lines.",
      providerId,
    },
  ];

  for (const prog of bulkPrograms) {
    try {
      const res = await fetch(`${BASE}/programs`, {
        method: "POST",
        headers,
        body: JSON.stringify(prog),
      });
      const data = await res.json();
      console.log("Created program:", prog.name, res.status);
    } catch (e) {
      console.warn("Notice creating program:", e.message);
    }
  }

  console.log("Bulk programs injected successfully!");
}

module.exports = { injectBulkData };

if (require.main === module) {
  injectBulkData().catch(console.error);
}
