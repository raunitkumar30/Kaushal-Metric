const BASE = "http://localhost:5000/api";

async function main() {
  console.log("=== INJECTING COMPLETE MAHARASHTRA SIH DATASET ===");

  // 1. Authenticate as Government
  const govLogin = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "gov@test.com", password: "Test123456" }),
  });
  const { token: govToken } = await govLogin.json();
  const govHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${govToken}` };

  // 2. Authenticate as Provider
  const provLogin = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "provider@test.com", password: "Provider123456" }),
  });
  const { token: provToken } = await provLogin.json();
  const provHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${provToken}` };

  // 3. Authenticate as Employer
  const empLogin = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "employer@test.com", password: "employer123" }),
  });
  const { token: empToken } = await empLogin.json();
  const empHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${empToken}` };

  // Fetch current provider
  const provRes = await fetch(`${BASE}/providers`, { headers: govHeaders });
  const { providers } = await provRes.json();
  const defaultProvider = providers[0];
  console.log(`Anchor Provider: ${defaultProvider.name} (${defaultProvider._id})`);

  // 4. Fetch existing programs
  const progsRes = await fetch(`${BASE}/programs`, { headers: govHeaders });
  const { programs: existingProgs } = await progsRes.json();
  const programMap = {};
  existingProgs.forEach((p) => {
    programMap[p.name] = p;
  });

  // Programs to add
  const additionalPrograms = [
    {
      name: "MSSDS Healthcare - Emergency Medical Technician (EMT)",
      sector: "Healthcare & Life Sciences",
      durationWeeks: 16,
      targetSkills: ["Trauma Care", "Patient Stabilization", "CPR & AED", "Medical Triage"],
      description: "State certified paramedical program preparing ambulance technicians and emergency room responders across Maharashtra district hospitals.",
      providerId: defaultProvider._id,
    },
    {
      name: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance",
      sector: "Renewable Energy",
      durationWeeks: 8,
      targetSkills: ["Solar Grid Sync", "Inverter Diagnostics", "Rooftop Mounting", "DC Circuitry"],
      description: "Clean power workforce initiative supporting Maharashtra's solar rooftop target with hands-on grid synchronization skills.",
      providerId: defaultProvider._id,
    },
    {
      name: "Maharashtra FinTech - Digital Banking & Fraud Operations",
      sector: "Banking & Financial Services",
      durationWeeks: 10,
      targetSkills: ["KYC Compliance", "Payment Gateway Protocols", "Fraud Detection", "Financial Ledger"],
      description: "Fast-track BFSI cohort designed with Mumbai financial hubs for digital banking customer onboarding and anti-fraud monitoring.",
      providerId: defaultProvider._id,
    },
    {
      name: "Precision CNC Automation & Industrial Robotics",
      sector: "Automotive & Heavy Engineering",
      durationWeeks: 14,
      targetSkills: ["CNC Programming", "G-Code", "Quality Metrology", "Robotic Arm Operation"],
      description: "Advanced manufacturing apprenticeship serving Chakan-Talegaon automotive corridor for automated robotic assembly lines.",
      providerId: defaultProvider._id,
    },
  ];

  for (const progData of additionalPrograms) {
    if (!programMap[progData.name]) {
      const res = await fetch(`${BASE}/programs`, {
        method: "POST",
        headers: govHeaders,
        body: JSON.stringify(progData),
      });
      const data = await res.json();
      if (data.program) {
        programMap[progData.name] = data.program;
        console.log(`+ Created Program: ${progData.name}`);
      }
    }
  }

  // Reload programs
  const updatedProgsRes = await fetch(`${BASE}/programs`, { headers: govHeaders });
  const { programs: allPrograms } = await updatedProgsRes.json();
  const progByName = {};
  allPrograms.forEach((p) => {
    progByName[p.name] = p;
  });

  // 5. Fetch existing batches
  const batchesRes = await fetch(`${BASE}/batches`, { headers: provHeaders });
  const { batches: existingBatches } = await batchesRes.json();
  const batchMap = {};
  existingBatches.forEach((b) => {
    batchMap[b.name] = b;
  });

  const additionalBatches = [
    {
      name: "Nagpur Healthcare EMT Batch 1",
      programId: progByName["MSSDS Healthcare - Emergency Medical Technician (EMT)"]?._id,
      startDate: "2026-06-15",
      endDate: "2026-10-15",
      capacity: 25,
    },
    {
      name: "Nashik Solar Rooftop Specialists",
      programId: progByName["MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance"]?._id,
      startDate: "2026-07-01",
      endDate: "2026-08-31",
      capacity: 30,
    },
    {
      name: "Mumbai FinTech Associates 2026",
      programId: progByName["Maharashtra FinTech - Digital Banking & Fraud Operations"]?._id,
      startDate: "2026-08-01",
      endDate: "2026-10-15",
      capacity: 35,
    },
    {
      name: "Aurangabad CNC Machining Cohort",
      programId: progByName["Precision CNC Automation & Industrial Robotics"]?._id,
      startDate: "2026-06-01",
      endDate: "2026-09-15",
      capacity: 20,
    },
  ];

  for (const bData of additionalBatches) {
    if (bData.programId && !batchMap[bData.name]) {
      const res = await fetch(`${BASE}/batches`, {
        method: "POST",
        headers: provHeaders,
        body: JSON.stringify(bData),
      });
      const data = await res.json();
      if (data.batch) {
        batchMap[bData.name] = data.batch;
        console.log(`+ Created Batch: ${bData.name}`);
      }
    }
  }

  // Reload batches
  const updatedBatchesRes = await fetch(`${BASE}/batches`, { headers: provHeaders });
  const { batches: allBatches } = await updatedBatchesRes.json();
  const batchByName = {};
  allBatches.forEach((b) => {
    batchByName[b.name] = b;
  });

  // 6. Fetch existing trainees & register additional candidates
  const traineesRes = await fetch(`${BASE}/trainees`, { headers: govHeaders });
  const { trainees: existingTrainees } = await traineesRes.json();
  const traineeMap = {};
  existingTrainees.forEach((t) => {
    traineeMap[t.email] = t;
  });

  // Update Rahul and Sneha's batch assignments
  const cloudBatch = batchByName["Pune Cloud Pioneers Cohort 2026-A"];
  const evBatch = batchByName["Chakan EV Manufacturing Batch 2026-B"];

  // Trainee enrollments list
  const additionalTrainees = [
    {
      name: "Amit Shinde",
      email: "amit.shinde@test.com",
      phone: "9823145670",
      state: "Maharashtra",
      district: "Nashik",
      batchName: "Nashik Solar Rooftop Specialists",
      skills: [{ name: "Solar Grid Sync", level: 82 }, { name: "Inverter Diagnostics", level: 78 }],
      attendance: 88,
    },
    {
      name: "Pooja Deshmukh",
      email: "pooja.deshmukh@test.com",
      phone: "9765432109",
      state: "Maharashtra",
      district: "Nagpur",
      batchName: "Nagpur Healthcare EMT Batch 1",
      skills: [{ name: "Trauma Care", level: 90 }, { name: "CPR & AED", level: 94 }],
      attendance: 94,
    },
    {
      name: "Swapnil Jadhav",
      email: "swapnil.jadhav@test.com",
      phone: "9890123456",
      state: "Maharashtra",
      district: "Chhatrapati Sambhajinagar",
      batchName: "Aurangabad CNC Machining Cohort",
      skills: [{ name: "CNC Programming", level: 85 }, { name: "G-Code", level: 80 }],
      attendance: 86,
    },
    {
      name: "Tanvi More",
      email: "tanvi.more@test.com",
      phone: "9822876543",
      state: "Maharashtra",
      district: "Kolhapur",
      batchName: "Pune Cloud Pioneers Cohort 2026-A",
      skills: [{ name: "Cloud Computing", level: 78 }, { name: "Python", level: 84 }],
      attendance: 90,
    },
    {
      name: "Rohan Gaikwad",
      email: "rohan.gaikwad@test.com",
      phone: "9960112233",
      state: "Maharashtra",
      district: "Thane",
      batchName: "Mumbai FinTech Associates 2026",
      skills: [{ name: "KYC Compliance", level: 88 }, { name: "Payment Gateway Protocols", level: 75 }],
      attendance: 92,
    },
    {
      name: "Kavita Pawar",
      email: "kavita.pawar@test.com",
      phone: "9422009876",
      state: "Maharashtra",
      district: "Solapur",
      batchName: "Pune Cloud Pioneers Cohort 2026-A",
      skills: [{ name: "Database Management", level: 44 }, { name: "Cloud Computing", level: 56 }],
      attendance: 58, // Intentionally lower for realistic AI Early Warning Alert!
    },
    {
      name: "Nikhil Sawant",
      email: "nikhil.sawant@test.com",
      phone: "9850445566",
      state: "Maharashtra",
      district: "Amravati",
      batchName: "Nagpur Healthcare EMT Batch 1",
      skills: [{ name: "Patient Stabilization", level: 80 }, { name: "Medical Triage", level: 74 }],
      attendance: 82,
    },
    {
      name: "Priyanka Joshi",
      email: "priyanka.joshi@test.com",
      phone: "9766332211",
      state: "Maharashtra",
      district: "Satara",
      batchName: "Chakan EV Manufacturing Batch 2026-B",
      skills: [{ name: "Battery Diagnostics", level: 86 }, { name: "EV Powertrain", level: 82 }],
      attendance: 91,
    },
  ];

  // Register new trainees via auth/register
  for (const t of additionalTrainees) {
    if (!traineeMap[t.email]) {
      try {
        const regRes = await fetch(`${BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: t.name,
            email: t.email,
            password: "Password123!",
            role: "TRAINEE",
          }),
        });
        const regData = await regRes.json();
        console.log(`+ Registered Trainee User: ${t.name} (${t.email})`);
      } catch (err) {
        console.warn(`Notice registering ${t.name}:`, err.message);
      }
    }
  }

  // Reload trainees from DB
  const reTraineesRes = await fetch(`${BASE}/trainees`, { headers: govHeaders });
  const { trainees: allTrainees } = await reTraineesRes.json();
  const allTraineesByEmail = {};
  allTrainees.forEach((t) => {
    allTraineesByEmail[t.email] = t;
  });

  // Assign batches to all trainees and update profile location
  const TraineeModel = require("../src/models/Trainee");
  const mongoose = require("mongoose");

  // Connect direct to mongoose for clean document field updates
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:58379/");
  }

  // 1. Update Rahul Patil
  if (allTraineesByEmail["rahul@test.com"] && cloudBatch) {
    await TraineeModel.findByIdAndUpdate(allTraineesByEmail["rahul@test.com"]._id, {
      batchId: cloudBatch._id,
      state: "Maharashtra",
      district: "Pune",
      phone: "9876543210",
      status: "TRAINING",
      attendancePercentage: 88,
      skills: [
        { name: "Cloud Computing", level: 88 },
        { name: "Python", level: 84 },
        { name: "React.js", level: 80 },
        { name: "Database Management", level: 48 },
      ],
    });
    console.log("✓ Enrolled Rahul Patil -> Pune Cloud Pioneers Cohort 2026-A");
  }

  // 2. Update Sneha Kulkarni
  if (allTraineesByEmail["sneha.k@test.com"] && evBatch) {
    await TraineeModel.findByIdAndUpdate(allTraineesByEmail["sneha.k@test.com"]._id, {
      batchId: evBatch._id,
      state: "Maharashtra",
      district: "Pune",
      phone: "9822014589",
      status: "TRAINING",
      attendancePercentage: 92,
      skills: [
        { name: "Battery Diagnostics", level: 85 },
        { name: "EV Powertrain", level: 88 },
        { name: "Safety Protocols", level: 90 },
      ],
    });
    console.log("✓ Enrolled Sneha Kulkarni -> Chakan EV Manufacturing Batch 2026-B");
  }

  // 3. Update additional trainees with batches, districts, and skill scores
  for (const t of additionalTrainees) {
    const doc = allTraineesByEmail[t.email];
    const targetBatch = batchByName[t.batchName];
    if (doc && targetBatch) {
      await TraineeModel.findByIdAndUpdate(doc._id, {
        batchId: targetBatch._id,
        state: t.state,
        district: t.district,
        phone: t.phone,
        status: "TRAINING",
        attendancePercentage: t.attendance,
        skills: t.skills,
      });
      console.log(`✓ Enrolled ${t.name} -> ${t.batchName} (${t.district}, MH)`);
    }
  }

  // 7. Inject Attendance records
  const AttendanceModel = require("../src/models/Attendance");
  await AttendanceModel.deleteMany({});
  const attendanceDates = ["2026-09-12", "2026-09-13", "2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17", "2026-09-18"];

  const reloadedTrainees = await TraineeModel.find();
  for (const trainee of reloadedTrainees) {
    const isAtRisk = trainee.email === "kavita.pawar@test.com";
    for (const d of attendanceDates) {
      const isAbsent = isAtRisk && (d.endsWith("14") || d.endsWith("16") || d.endsWith("18"));
      await AttendanceModel.create({
        traineeId: trainee._id,
        date: new Date(d),
        status: isAbsent ? "ABSENT" : "PRESENT",
        markedBy: "MSSDS Verified Biometric Portal",
      });
    }
  }
  console.log("✓ Recorded realistic biometric attendance across all batches");

  // 8. Inject Skill Assessments
  const AssessmentModel = require("../src/models/Assessment");
  await AssessmentModel.deleteMany({});

  for (const trainee of reloadedTrainees) {
    for (const s of trainee.skills) {
      await AssessmentModel.create({
        traineeId: trainee._id,
        skill: s.name,
        score: s.level,
        maxScore: 100,
        assessor: "Dr. Ramesh Joshi (MSSDS Lead Assessor)",
        assessmentDate: new Date("2026-09-18"),
      });
    }
  }
  console.log("✓ Recorded official Skill Assessments matching target competencies");

  // 9. Inject AI Interventions for at-risk cases
  const InterventionModel = require("../src/models/Intervention");
  await InterventionModel.deleteMany({});

  const kavitaDoc = reloadedTrainees.find((t) => t.email === "kavita.pawar@test.com");
  if (kavitaDoc) {
    await InterventionModel.create({
      traineeId: kavitaDoc._id,
      type: "SKILL_TRAINING",
      reason: "Attendance dropped to 58% and Database competency score is below threshold (44%).",
      action: "Scheduled 1-on-1 practical query lab and assigned dedicated peer mentor in Pune center.",
      assignedTo: "Prof. Sachin Kadam (Lead Instructor)",
      status: "IN_PROGRESS",
    });
    console.log("✓ Logged active AI Intervention for at-risk trainee (Kavita Pawar)");
  }

  // 10. Inject Certifications & Outcome Passports
  const CertificationModel = require("../src/models/Certification");
  await CertificationModel.deleteMany({});

  // High performers get issued certificates
  const certifiedTrainees = [
    { email: "rahul@test.com", certNum: "MH-MSSDS-2026-CRT-0101", progName: "Pramod Mahajan Kaushal Vikas - Cloud & AI Architecture" },
    { email: "sneha.k@test.com", certNum: "MH-MSSDS-2026-CRT-0102", progName: "Maharashtra Green Tech - EV & Battery Assembly Technician" },
    { email: "pooja.deshmukh@test.com", certNum: "MH-MSSDS-2026-CRT-0103", progName: "MSSDS Healthcare - Emergency Medical Technician (EMT)" },
    { email: "swapnil.jadhav@test.com", certNum: "MH-MSSDS-2026-CRT-0104", progName: "Precision CNC Automation & Industrial Robotics" },
    { email: "rohan.gaikwad@test.com", certNum: "MH-MSSDS-2026-CRT-0105", progName: "Maharashtra FinTech - Digital Banking & Fraud Operations" },
    { email: "amit.shinde@test.com", certNum: "MH-MSSDS-2026-CRT-0106", progName: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance" },
  ];

  for (const c of certifiedTrainees) {
    const tDoc = reloadedTrainees.find((t) => t.email === c.email);
    const pDoc = progByName[c.progName];
    if (tDoc && pDoc) {
      await CertificationModel.create({
        traineeId: tDoc._id,
        programId: pDoc._id,
        certificateNumber: c.certNum,
        issueDate: new Date("2026-09-18"),
        status: "VALID",
      });
      await TraineeModel.findByIdAndUpdate(tDoc._id, { status: "CERTIFIED" });
      console.log(`✓ Issued Certificate ${c.certNum} -> ${tDoc.name}`);
    }
  }

  // 11. Inject Employment Outcomes & Employer Verifications
  const EmploymentModel = require("../src/models/Employment");
  const EmployerVerificationModel = require("../src/models/EmployerVerification");
  const FollowUpModel = require("../src/models/FollowUp");

  await EmploymentModel.deleteMany({});
  await EmployerVerificationModel.deleteMany({});
  await FollowUpModel.deleteMany({});

  const placementRecords = [
    {
      email: "rahul@test.com",
      employer: "Tata Motors Ltd (Pune EV Plant)",
      role: "Junior Cloud & Telematics Engineer",
      salary: 34500,
      startDate: "2026-09-22",
      verified: true,
      jobRelevance: "RELEVANT",
    },
    {
      email: "sneha.k@test.com",
      employer: "Bajaj Auto Ltd (Chakan, Pune)",
      role: "EV Battery Assembly Specialist",
      salary: 31000,
      startDate: "2026-09-20",
      verified: true,
      jobRelevance: "RELEVANT",
    },
    {
      email: "pooja.deshmukh@test.com",
      employer: "Sahyadri Super Speciality Hospitals (Pune)",
      role: "Emergency Medical Responder (EMT)",
      salary: 28500,
      startDate: "2026-09-25",
      verified: true,
      jobRelevance: "RELEVANT",
    },
    {
      email: "rohan.gaikwad@test.com",
      employer: "Tech Mahindra (Hinjawadi, Pune)",
      role: "Digital Banking Operations Associate",
      salary: 36000,
      startDate: "2026-09-24",
      verified: true,
      jobRelevance: "RELEVANT",
    },
    {
      email: "swapnil.jadhav@test.com",
      employer: "Larsen & Toubro Ltd (Talegaon, Pune)",
      role: "CNC Production Technician",
      salary: 29500,
      startDate: "2026-09-21",
      verified: true,
      jobRelevance: "RELEVANT",
    },
  ];

  for (const p of placementRecords) {
    const tDoc = reloadedTrainees.find((t) => t.email === p.email);
    if (tDoc) {
      const emp = await EmploymentModel.create({
        traineeId: tDoc._id,
        employerName: p.employer,
        jobTitle: p.role,
        startingSalary: p.salary,
        currentSalary: p.salary,
        employmentDate: new Date(p.startDate),
        status: "EMPLOYED",
        jobRelevance: p.jobRelevance,
        verified: p.verified,
        verificationConfidence: 95,
        evidenceType: "HRMS_OFFER_LETTER",
        evidenceReference: `MH-EMP-REF-${Date.now().toString().slice(-6)}`,
      });

      // Verification log
      await EmployerVerificationModel.create({
        employmentId: emp._id,
        verifiedBy: "employer@test.com",
        verificationStatus: "VERIFIED",
        notes: `Outcome verified via Maharashtra KaushalMetric Tracker ledger. Active payroll confirmed with ${p.employer}.`,
      });

      // 30-Day and 90-Day Longitudinal Retention follow-up
      await FollowUpModel.create({
        traineeId: tDoc._id,
        followUpType: "30_DAY",
        status: "COMPLETED",
        scheduledDate: new Date("2026-10-22"),
        conductedDate: new Date("2026-10-22"),
        notes: "30-Day retention confirmed: Trainee reports high job satisfaction and skill applicability.",
      });

      await FollowUpModel.create({
        traineeId: tDoc._id,
        followUpType: "90_DAY",
        status: "SCHEDULED",
        scheduledDate: new Date("2026-12-22"),
        notes: "Automated tracer alert queued for 90-day retention confirmation.",
      });

      console.log(`✓ Placed & Verified: ${tDoc.name} @ ${p.employer} (₹${p.salary.toLocaleString('en-IN')}/mo)`);
    }
  }

  console.log("\n==========================================================");
  console.log("       DATA INJECTION COMPLETE (MAHARASHTRA SIH)         ");
  console.log("==========================================================");
  console.log("  • Programs         : 6 active Maharashtra initiatives");
  console.log("  • Batches          : 6 cohorts across Pune, Chakan, Nagpur, Nashik, Mumbai, Aurangabad");
  console.log("  • Trainees         : 10 candidates enrolled with live district mapping");
  console.log("  • Attendance       : 70+ biometric check-ins");
  console.log("  • Assessments      : 24 competency evaluations");
  console.log("  • Certifications   : 6 issued Outcome Passports");
  console.log("  • Placements       : 5 verified employment outcomes (Tata Motors, Infosys, etc.)");
  console.log("  • Interventions    : 1 active AI remedial counseling record");
  console.log("  • Retention Tracer : 30-Day & 90-Day longitudinal follow-ups active");
  console.log("==========================================================\n");
}

main().catch(console.error);
