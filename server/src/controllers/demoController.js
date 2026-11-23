const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Provider = require("../models/Provider");
const Program = require("../models/Program");
const Batch = require("../models/Batch");
const Trainee = require("../models/Trainee");
const Assessment = require("../models/Assessment");
const Certification = require("../models/Certification");
const Employment = require("../models/Employment");
const FollowUp = require("../models/FollowUp");
const Intervention = require("../models/Intervention");
const EmployerVerification = require("../models/EmployerVerification");
const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const AuditLog = require("../models/AuditLog");

const clearOperationalData = async (req, res) => {
  try {
    await Promise.all([
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

      // Remove all users except the four permanent demo accounts.
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

      // Keep only provider@test.com's provider entity
      Provider.deleteMany({ contactEmail: { $ne: "provider@test.com" } }),

      // Keep only rahul@test.com's trainee entity
      Trainee.deleteMany({ email: { $ne: "rahul@test.com" } }),
    ]);

    const governmentPassword = await bcrypt.hash("Test123456", 10);
    const providerPassword = await bcrypt.hash("Provider123456", 10);
    const traineePassword = await bcrypt.hash("Trainee123456", 10);
    const employerPassword = await bcrypt.hash("employer123", 10);

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

    const trainee = await Trainee.findOneAndUpdate(
      { email: "rahul@test.com" },
      {
        name: "Rahul Patil",
        email: "rahul@test.com",
        phone: "9876543210",
        state: "Maharashtra",
        district: "Pune",
        batchId: null,
        attendancePercentage: 0,
        consent: { analytics: true, aiRecommendations: true },
        status: "ACTIVE",
        skillOutcomeId: "MH-OUTCOME-2026-001",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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

    const result = {
      message: "All operational data cleared successfully. Demo accounts preserved for Maharashtra SIH flow.",
      state: "Maharashtra",
      programs: 0,
      batches: 0,
      assessments: 0,
      certifications: 0,
      employments: 0,
      attendance: 0,
      users: 4,
      provider: {
        id: provider._id,
        name: provider.name,
        state: provider.state,
        district: provider.district,
      },
      trainee: {
        id: trainee._id,
        name: trainee.name,
        state: trainee.state,
        district: trainee.district,
      },
    };

    if (res) {
      return res.json(result);
    }
    return result;
  } catch (error) {
    console.error("clearOperationalData error:", error);
    if (res) {
      return res.status(500).json({ message: "Failed to clear operational data", error: error.message });
    }
    throw error;
  }
};

const injectSihData = async (req, res) => {
  try {
    const provider =
      (await Provider.findOne({ contactEmail: "provider@test.com" })) ||
      (await Provider.findOne()) ||
      (await Provider.create({
        name: "Maharashtra State Skill Development Center (MSSDS Pune)",
        registrationNumber: "MH-MSSDS-2026-001",
        state: "Maharashtra",
        district: "Pune",
        contactEmail: "provider@test.com",
        isActive: true,
      }));

    // 1. Ensure Programs exist
    const programsData = [
      {
        name: "Pramod Mahajan Kaushal Vikas - Cloud & AI Architecture",
        sector: "Information Technology & Electronics",
        durationWeeks: 12,
        targetSkills: ["Cloud Computing", "Python", "React.js", "Database Management"],
        description:
          "Flagship MSSDS digital skilling initiative delivering certified competencies in modern cloud infrastructure, Python microservices, and web platforms for Maharashtra youth.",
        providerId: provider._id,
        status: "ACTIVE",
      },
      {
        name: "Maharashtra Green Tech - EV & Battery Assembly Technician",
        sector: "Automotive & Clean Energy",
        durationWeeks: 16,
        targetSkills: ["Battery Diagnostics", "EV Powertrain", "Safety Protocols", "PLC Wiring"],
        description:
          "Industry-aligned technical certification developed with Chakan-Pune automotive cluster for electric vehicle powertrain assembly, battery cell testing, and safety compliance.",
        providerId: provider._id,
        status: "ACTIVE",
      },
      {
        name: "MSSDS Healthcare - Emergency Medical Technician (EMT)",
        sector: "Healthcare & Life Sciences",
        durationWeeks: 16,
        targetSkills: ["Trauma Care", "Patient Stabilization", "CPR & AED", "Medical Triage"],
        description:
          "State certified paramedical program preparing ambulance technicians and emergency room responders across Maharashtra district hospitals.",
        providerId: provider._id,
        status: "ACTIVE",
      },
      {
        name: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance",
        sector: "Renewable Energy",
        durationWeeks: 8,
        targetSkills: ["Solar Grid Sync", "Inverter Diagnostics", "Rooftop Mounting", "DC Circuitry"],
        description:
          "Clean power workforce initiative supporting Maharashtra's solar rooftop target with hands-on grid synchronization skills.",
        providerId: provider._id,
        status: "ACTIVE",
      },
      {
        name: "Maharashtra FinTech - Digital Banking & Fraud Operations",
        sector: "Banking & Financial Services",
        durationWeeks: 10,
        targetSkills: ["KYC Compliance", "Payment Gateway Protocols", "Fraud Detection", "Financial Ledger"],
        description:
          "Fast-track BFSI cohort designed with Mumbai financial hubs for digital banking customer onboarding and anti-fraud monitoring.",
        providerId: provider._id,
        status: "ACTIVE",
      },
      {
        name: "Precision CNC Automation & Industrial Robotics",
        sector: "Automotive & Heavy Engineering",
        durationWeeks: 14,
        targetSkills: ["CNC Programming", "G-Code", "Quality Metrology", "Robotic Arm Operation"],
        description:
          "Advanced manufacturing apprenticeship serving Chakan-Talegaon automotive corridor for automated robotic assembly lines.",
        providerId: provider._id,
        status: "ACTIVE",
      },
    ];

    const programMap = {};
    for (const p of programsData) {
      let doc = await Program.findOne({ name: p.name });
      if (!doc) {
        doc = await Program.create(p);
      } else {
        doc.status = "ACTIVE";
        doc.targetSkills = p.targetSkills;
        await doc.save();
      }
      programMap[p.name] = doc;
    }

    // 2. Ensure Batches exist
    const batchesData = [
      {
        name: "Pune Cloud Pioneers Cohort 2026-A",
        progName: "Pramod Mahajan Kaushal Vikas - Cloud & AI Architecture",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-08-31"),
        capacity: 30,
        status: "ACTIVE",
      },
      {
        name: "Chakan EV Manufacturing Batch 2026-B",
        progName: "Maharashtra Green Tech - EV & Battery Assembly Technician",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-10-31"),
        capacity: 25,
        status: "ACTIVE",
      },
      {
        name: "Nagpur Healthcare EMT Batch 1",
        progName: "MSSDS Healthcare - Emergency Medical Technician (EMT)",
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-10-15"),
        capacity: 25,
        status: "ACTIVE",
      },
      {
        name: "Nashik Solar Rooftop Specialists",
        progName: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-08-31"),
        capacity: 30,
        status: "ACTIVE",
      },
      {
        name: "Mumbai FinTech Associates 2026",
        progName: "Maharashtra FinTech - Digital Banking & Fraud Operations",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-10-15"),
        capacity: 35,
        status: "ACTIVE",
      },
      {
        name: "Aurangabad CNC Machining Cohort",
        progName: "Precision CNC Automation & Industrial Robotics",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-09-15"),
        capacity: 20,
        status: "ACTIVE",
      },
    ];

    const batchMap = {};
    for (const b of batchesData) {
      const progDoc = programMap[b.progName];
      let doc = await Batch.findOne({ name: b.name });
      if (!doc) {
        doc = await Batch.create({
          name: b.name,
          programId: progDoc._id,
          providerId: provider._id,
          startDate: b.startDate,
          endDate: b.endDate,
          capacity: b.capacity,
          status: b.status,
        });
      } else {
        doc.programId = progDoc._id;
        doc.status = "ACTIVE";
        await doc.save();
      }
      batchMap[b.name] = doc;
    }

    // 3. Ensure Candidates exist and are mapped to batches
    const traineesData = [
      {
        name: "Rahul Patil",
        email: "rahul@test.com",
        phone: "9876543210",
        state: "Maharashtra",
        district: "Pune",
        skillOutcomeId: "MH-OUTCOME-2026-001",
        batchName: "Pune Cloud Pioneers Cohort 2026-A",
        attendance: 88,
        skills: [
          { name: "Cloud Computing", level: 88 },
          { name: "Python", level: 84 },
          { name: "React.js", level: 82 },
          { name: "Database Management", level: 50 },
        ],
      },
      {
        name: "Sneha Kulkarni",
        email: "sneha.k@test.com",
        phone: "9822014589",
        state: "Maharashtra",
        district: "Pune",
        batchName: "Chakan EV Manufacturing Batch 2026-B",
        attendance: 92,
        skills: [
          { name: "Battery Diagnostics", level: 86 },
          { name: "EV Powertrain", level: 88 },
          { name: "Safety Protocols", level: 90 },
        ],
      },
      {
        name: "Amit Shinde",
        email: "amit.shinde@test.com",
        phone: "9823145670",
        state: "Maharashtra",
        district: "Nashik",
        batchName: "Nashik Solar Rooftop Specialists",
        attendance: 86,
        skills: [
          { name: "Solar Grid Sync", level: 82 },
          { name: "Inverter Diagnostics", level: 78 },
        ],
      },
      {
        name: "Pooja Deshmukh",
        email: "pooja.deshmukh@test.com",
        phone: "9765432109",
        state: "Maharashtra",
        district: "Nagpur",
        batchName: "Nagpur Healthcare EMT Batch 1",
        attendance: 95,
        skills: [
          { name: "Trauma Care", level: 92 },
          { name: "CPR & AED", level: 96 },
        ],
      },
      {
        name: "Swapnil Jadhav",
        email: "swapnil.jadhav@test.com",
        phone: "9890123456",
        state: "Maharashtra",
        district: "Chhatrapati Sambhajinagar",
        batchName: "Aurangabad CNC Machining Cohort",
        attendance: 88,
        skills: [
          { name: "CNC Programming", level: 85 },
          { name: "G-Code", level: 82 },
        ],
      },
      {
        name: "Tanvi More",
        email: "tanvi.more@test.com",
        phone: "9822876543",
        state: "Maharashtra",
        district: "Kolhapur",
        batchName: "Pune Cloud Pioneers Cohort 2026-A",
        attendance: 91,
        skills: [
          { name: "Cloud Computing", level: 80 },
          { name: "Python", level: 85 },
        ],
      },
      {
        name: "Rohan Gaikwad",
        email: "rohan.gaikwad@test.com",
        phone: "9960112233",
        state: "Maharashtra",
        district: "Thane",
        batchName: "Mumbai FinTech Associates 2026",
        attendance: 93,
        skills: [
          { name: "KYC Compliance", level: 88 },
          { name: "Payment Gateway Protocols", level: 82 },
        ],
      },
      {
        name: "Kavita Pawar",
        email: "kavita.pawar@test.com",
        phone: "9422009876",
        state: "Maharashtra",
        district: "Solapur",
        batchName: "Pune Cloud Pioneers Cohort 2026-A",
        attendance: 58,
        skills: [
          { name: "Database Management", level: 44 },
          { name: "Cloud Computing", level: 56 },
        ],
      },
      {
        name: "Nikhil Sawant",
        email: "nikhil.sawant@test.com",
        phone: "9850445566",
        state: "Maharashtra",
        district: "Amravati",
        batchName: "Nagpur Healthcare EMT Batch 1",
        attendance: 84,
        skills: [
          { name: "Patient Stabilization", level: 80 },
          { name: "Medical Triage", level: 76 },
        ],
      },
      {
        name: "Priyanka Joshi",
        email: "priyanka.joshi@test.com",
        phone: "9766332211",
        state: "Maharashtra",
        district: "Satara",
        batchName: "Chakan EV Manufacturing Batch 2026-B",
        attendance: 90,
        skills: [
          { name: "Battery Diagnostics", level: 86 },
          { name: "EV Powertrain", level: 84 },
        ],
      },
    ];

    const traineeMap = {};
    for (const t of traineesData) {
      const bDoc = batchMap[t.batchName];
      let tDoc = await Trainee.findOne({ email: t.email });
      if (!tDoc) {
        tDoc = await Trainee.create({
          name: t.name,
          email: t.email,
          phone: t.phone,
          state: t.state,
          district: t.district,
          batchId: bDoc ? bDoc._id : null,
          attendancePercentage: t.attendance,
          skills: t.skills,
          status: "TRAINING",
          skillOutcomeId: t.skillOutcomeId || (t.email === "rahul@test.com" ? "MH-OUTCOME-2026-001" : `SO-${Date.now().toString().slice(-6)}`),
        });
      } else {
        tDoc.name = t.name;
        tDoc.phone = t.phone;
        tDoc.state = t.state;
        tDoc.district = t.district;
        tDoc.batchId = bDoc ? bDoc._id : tDoc.batchId;
        tDoc.attendancePercentage = t.attendance;
        tDoc.skills = t.skills;
        tDoc.status = "TRAINING";
        if (t.skillOutcomeId) tDoc.skillOutcomeId = t.skillOutcomeId;
        else if (t.email === "rahul@test.com") tDoc.skillOutcomeId = "MH-OUTCOME-2026-001";
        await tDoc.save();
      }
      traineeMap[t.email] = tDoc;
    }

    // 4. Biometric Attendance
    await Attendance.deleteMany({});
    const sampleDates = [
      "2026-09-12",
      "2026-09-13",
      "2026-09-14",
      "2026-09-15",
      "2026-09-16",
      "2026-09-17",
      "2026-09-18",
    ];
    for (const t of Object.values(traineeMap)) {
      const isLow = t.email === "kavita.pawar@test.com";
      for (const d of sampleDates) {
        const isAbsent = isLow && (d.endsWith("14") || d.endsWith("16") || d.endsWith("18"));
        await Attendance.create({
          traineeId: t._id,
          date: new Date(d),
          status: isAbsent ? "ABSENT" : "PRESENT",
          markedBy: "MSSDS Biometric Ledger",
        });
      }
    }

    // 5. Skill Assessments
    await Assessment.deleteMany({});
    for (const t of Object.values(traineeMap)) {
      for (const s of t.skills) {
        await Assessment.create({
          traineeId: t._id,
          skill: s.name,
          score: s.level,
          maxScore: 100,
          assessor: "Dr. Ramesh Joshi (MSSDS Certified Assessor)",
          assessmentDate: new Date("2026-09-18"),
        });
      }
    }

    // 6. AI Intervention for At-Risk Candidate (Kavita Pawar)
    await Intervention.deleteMany({});
    const kavita = traineeMap["kavita.pawar@test.com"];
    if (kavita) {
      await Intervention.create({
        traineeId: kavita._id,
        type: "SKILL_TRAINING",
        reason:
          "Attendance dropped to 58% and Database competency score is below threshold (44%).",
        action:
          "Scheduled 1-on-1 practical query lab and assigned dedicated peer mentor in Pune center.",
        assignedTo: "Prof. Sachin Kadam (Lead Instructor)",
        status: "IN_PROGRESS",
      });
    }

    // 7. Certifications
    await Certification.deleteMany({});
    const certList = [
      {
        email: "rahul@test.com",
        certNum: "MH-OUTCOME-2026-001",
        prog: "Pramod Mahajan Kaushal Vikas - Cloud & AI Architecture",
      },
      {
        email: "sneha.k@test.com",
        certNum: "MH-MSSDS-2026-CRT-0102",
        prog: "Maharashtra Green Tech - EV & Battery Assembly Technician",
      },
      {
        email: "pooja.deshmukh@test.com",
        certNum: "MH-MSSDS-2026-CRT-0103",
        prog: "MSSDS Healthcare - Emergency Medical Technician (EMT)",
      },
      {
        email: "swapnil.jadhav@test.com",
        certNum: "MH-MSSDS-2026-CRT-0104",
        prog: "Precision CNC Automation & Industrial Robotics",
      },
      {
        email: "rohan.gaikwad@test.com",
        certNum: "MH-MSSDS-2026-CRT-0105",
        prog: "Maharashtra FinTech - Digital Banking & Fraud Operations",
      },
      {
        email: "amit.shinde@test.com",
        certNum: "MH-MSSDS-2026-CRT-0106",
        prog: "MAHA-DBT Solar Energy - Rooftop PV Operations & Maintenance",
      },
    ];

    for (const c of certList) {
      const t = traineeMap[c.email];
      const p = programMap[c.prog];
      if (t && p) {
        await Certification.create({
          traineeId: t._id,
          programId: p._id,
          certificateNumber: c.certNum,
          issueDate: new Date("2026-09-18"),
          status: "VALID",
        });
        t.status = "CERTIFIED";
        await t.save();
      }
    }

    // 8. Employments & Verifications & Follow-Ups
    await Employment.deleteMany({});
    await EmployerVerification.deleteMany({});
    await FollowUp.deleteMany({});

    const jobs = [
      {
        email: "rahul@test.com",
        employer: "Tata Motors Ltd (Pune EV Plant)",
        role: "Junior Cloud & Telematics Engineer",
        salary: 34500,
        date: "2026-09-22",
      },
      {
        email: "sneha.k@test.com",
        employer: "Bajaj Auto Ltd (Chakan, Pune)",
        role: "EV Battery Assembly Specialist",
        salary: 31000,
        date: "2026-09-20",
      },
      {
        email: "pooja.deshmukh@test.com",
        employer: "Sahyadri Super Speciality Hospitals (Pune)",
        role: "Emergency Medical Responder (EMT)",
        salary: 28500,
        date: "2026-09-25",
      },
      {
        email: "rohan.gaikwad@test.com",
        employer: "Tech Mahindra (Hinjawadi, Pune)",
        role: "Digital Banking Operations Associate",
        salary: 36000,
        date: "2026-09-24",
      },
      {
        email: "swapnil.jadhav@test.com",
        employer: "Larsen & Toubro Ltd (Talegaon, Pune)",
        role: "CNC Production Technician",
        salary: 29500,
        date: "2026-09-21",
      },
    ];

    for (const j of jobs) {
      const t = traineeMap[j.email];
      if (t) {
        const emp = await Employment.create({
          traineeId: t._id,
          employerName: j.employer,
          jobTitle: j.role,
          startingSalary: j.salary,
          currentSalary: j.salary,
          employmentDate: new Date(j.date),
          status: "EMPLOYED",
          jobRelevance: "RELEVANT",
          verified: true,
          verificationConfidence: 95,
          evidenceType: "OFFER_LETTER",
          evidenceReference: `MH-OFFER-${Date.now().toString().slice(-6)}`,
        });

        await EmployerVerification.create({
          traineeId: t._id,
          employmentId: emp._id,
          employerName: j.employer,
          status: "VERIFIED",
          verifiedBy: "employer@test.com",
          verifiedAt: new Date(),
          notes: `Verified via Outcome Passport ledger: Active payroll confirmed with ${j.employer}.`,
        });

        await FollowUp.create({
          traineeId: t._id,
          type: "30_DAY",
          status: "COMPLETED",
          scheduledDate: new Date("2026-10-22"),
          completedDate: new Date("2026-10-22"),
          currentlyEmployed: true,
          sameRole: true,
          notes: "30-Day retention confirmed: high performance & satisfaction.",
        });

        await FollowUp.create({
          traineeId: t._id,
          type: "90_DAY",
          status: "PENDING",
          scheduledDate: new Date("2026-12-22"),
          notes: "Automated tracer alert queued for 90-day retention confirmation.",
        });
      }
    }

    const summary = {
      message: "Complete Maharashtra SIH dataset injected successfully!",
      programs: await Program.countDocuments(),
      batches: await Batch.countDocuments(),
      trainees: await Trainee.countDocuments(),
      attendanceRecords: await Attendance.countDocuments(),
      assessments: await Assessment.countDocuments(),
      certifications: await Certification.countDocuments(),
      employments: await Employment.countDocuments(),
      employerVerifications: await EmployerVerification.countDocuments(),
      interventions: await Intervention.countDocuments(),
      followUps: await FollowUp.countDocuments(),
    };

    if (res) return res.json(summary);
    return summary;
  } catch (err) {
    console.error("injectSihData error:", err);
    if (res) return res.status(500).json({ message: "Failed to inject SIH data", error: err.message });
    throw err;
  }
};

const resetAndLoadDemo = async (req, res) => {
  try {
    /*
     * ---------------------------------------------------------
     * 1. REMOVE EXISTING OPERATIONAL DATA
     * ---------------------------------------------------------
     */

    await Promise.all([
      Provider.deleteMany({}),
      Program.deleteMany({}),
      Batch.deleteMany({}),
      Trainee.deleteMany({}),
      Assessment.deleteMany({}),
      Certification.deleteMany({}),
      Employment.deleteMany({}),
      FollowUp.deleteMany({}),
      Intervention.deleteMany({}),
      EmployerVerification.deleteMany({}),

      // Remove all users except the four permanent demo accounts.
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
    ]);

    /*
     * ---------------------------------------------------------
     * 2. CREATE / RESET DEMO LOGIN ACCOUNTS
     * ---------------------------------------------------------
     */

    const governmentPassword = await bcrypt.hash("Test123456", 10);
    const providerPassword = await bcrypt.hash("Provider123456", 10);
    const traineePassword = await bcrypt.hash("Trainee123456", 10);
    const employerPassword = await bcrypt.hash("employer123", 10);

    const governmentUser = await User.findOneAndUpdate(
      { email: "gov@test.com" },
      {
        name: "Government Demo",
        email: "gov@test.com",
        password: governmentPassword,
        role: "GOVERNMENT",
        providerId: null,
        traineeId: null,
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const providerUser = await User.findOneAndUpdate(
      { email: "provider@test.com" },
      {
        name: "Provider Demo",
        email: "provider@test.com",
        password: providerPassword,
        role: "PROVIDER",
        providerId: null,
        traineeId: null,
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const traineeUser = await User.findOneAndUpdate(
      { email: "rahul@test.com" },
      {
        name: "Rahul Sharma",
        email: "rahul@test.com",
        password: traineePassword,
        role: "TRAINEE",
        providerId: null,
        traineeId: null,
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const employerUser = await User.findOneAndUpdate(
      { email: "employer@test.com" },
      {
        name: "Employer Demo",
        email: "employer@test.com",
        password: employerPassword,
        role: "EMPLOYER",
        providerId: null,
        traineeId: null,
        isActive: true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    /*
     * ---------------------------------------------------------
     * 3. CREATE PROVIDER
     * ---------------------------------------------------------
     */

    const provider = await Provider.create({
      name: "Skill Development Training Center",
      registrationNumber: "SDTC-DEMO-001",
      state: "Uttar Pradesh",
      district: "Gautam Buddha Nagar",
      contactEmail: "provider@test.com",
      isActive: true,
    });

    providerUser.providerId = provider._id;
    await providerUser.save();

    /*
     * ---------------------------------------------------------
     * 4. CREATE PROGRAM
     * ---------------------------------------------------------
     */

    const program = await Program.create({
      name: "Digital Skills & Web Development",
      description:
        "Industry-oriented digital skills program covering web development, JavaScript and database fundamentals.",
      sector: "IT & Digital",
      targetSkills: [
        "Web Development",
        "JavaScript",
        "Database Management",
      ],
      durationWeeks: 12,
      providerId: provider._id,
      status: "ACTIVE",
    });

    /*
     * ---------------------------------------------------------
     * 5. CREATE BATCH
     * ---------------------------------------------------------
     */

    const batch = await Batch.create({
      name: "Digital Skills Batch 2026-A",
      programId: program._id,
      providerId: provider._id,
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-10-24"),
      capacity: 30,
      status: "ACTIVE",
    });

    /*
     * ---------------------------------------------------------
     * 6. CREATE TRAINEES
     * ---------------------------------------------------------
     */

    const [rahul, priya] = await Trainee.create([
      {
        name: "Rahul Sharma",
        email: "rahul@test.com",
        phone: "9876543210",
        state: "Uttar Pradesh",
        district: "Gautam Buddha Nagar",

        batchId: batch._id,

        skills: [
          {
            name: "Web Development",
            level: 70,
          },
          {
            name: "JavaScript",
            level: 72,
          },
          {
            name: "Database Management",
            level: 45,
          },
        ],

        attendancePercentage: 82,
        status: "CERTIFIED",
      },

      {
        name: "Priya Verma",
        email: "priya.demo@kaushalmetric.test",
        phone: "9876501234",
        state: "Uttar Pradesh",
        district: "Gautam Buddha Nagar",

        batchId: batch._id,

        skills: [
          {
            name: "Web Development",
            level: 55,
          },
          {
            name: "JavaScript",
            level: 48,
          },
          {
            name: "Database Management",
            level: 40,
          },
        ],

        attendancePercentage: 68,
        status: "TRAINING",
      },
    ]);

    /*
     * Link Rahul's trainee profile to his login account.
     */

    traineeUser.traineeId = rahul._id;

    /*
     * Give Rahul consent so the demo can immediately show
     * the consent/personal data flow.
     */

    traineeUser.consent = {
      given: true,
      givenAt: new Date(),
      version: "1.0",
      purpose:
        "Consent for storing and using training, assessment, certification and employment outcome data for KaushalMetric Tracker services and analytics.",
    };

    await traineeUser.save();

    /*
     * ---------------------------------------------------------
     * 7. CREATE ASSESSMENTS
     * ---------------------------------------------------------
     */

    await Assessment.insertMany([
      {
        traineeId: rahul._id,
        skill: "Web Development",
        score: 70,
        maxScore: 100,
        assessmentDate: new Date("2026-09-04"),
        assessor: "Skill Development Training Center",
      },

      {
        traineeId: rahul._id,
        skill: "JavaScript",
        score: 72,
        maxScore: 100,
        assessmentDate: new Date("2026-09-04"),
        assessor: "Skill Development Training Center",
      },

      {
        traineeId: rahul._id,
        skill: "Database Management",
        score: 45,
        maxScore: 100,
        assessmentDate: new Date("2026-09-04"),
        assessor: "Skill Development Training Center",
      },

      {
        traineeId: priya._id,
        skill: "Web Development",
        score: 55,
        maxScore: 100,
        assessmentDate: new Date("2026-09-03"),
        assessor: "Skill Development Training Center",
      },

      {
        traineeId: priya._id,
        skill: "JavaScript",
        score: 48,
        maxScore: 100,
        assessmentDate: new Date("2026-09-03"),
        assessor: "Skill Development Training Center",
      },
    ]);

    /*
     * ---------------------------------------------------------
     * 8. CREATE CERTIFICATION
     * ---------------------------------------------------------
     */

    const certification = await Certification.create({
      traineeId: rahul._id,
      programId: program._id,
      certificateNumber: "SI-DEMO-2026-0001",
      issueDate: new Date("2026-09-04"),
      status: "VALID",
    });

    /*
     * ---------------------------------------------------------
     * 9. CREATE EMPLOYMENT OUTCOME
     * ---------------------------------------------------------
     */

    const employment = await Employment.create({
      traineeId: rahul._id,

      employerName: "Infosys",

      jobTitle: "Junior Web Developer",

      startingSalary: 35000,

      currentSalary: 42000,

      // Keep legacy salary populated as well.
      salary: 42000,

      salaryUpdatedDate: new Date("2026-09-04"),

      employmentDate: new Date("2026-09-05"),

      status: "EMPLOYED",

      jobRelevance: "RELEVANT",

      evidenceType: "EMPLOYER_VERIFICATION",

      evidenceReference: "INFOSYS-DEMO-001",

      verificationConfidence: 96,

      verified: true,
    });

    /*
     * ---------------------------------------------------------
     * 10. CREATE 30 / 90 DAY FOLLOW-UPS
     * ---------------------------------------------------------
     */

    await FollowUp.insertMany([
      {
        traineeId: rahul._id,
        type: "30_DAY",
        scheduledDate: new Date("2026-10-05"),
        status: "PENDING",
      },

      {
        traineeId: rahul._id,
        type: "90_DAY",
        scheduledDate: new Date("2026-12-04"),
        status: "PENDING",
      },
    ]);

    /*
     * ---------------------------------------------------------
     * 11. CREATE PROVIDER INTERVENTIONS
     * ---------------------------------------------------------
     */

    await Intervention.insertMany([
      {
        traineeId: rahul._id,
        type: "SKILL_TRAINING",
        reason:
          "Database Management assessment is below the target skill level.",
        action:
          "Provide focused database practice and reassess the trainee.",
        assignedTo: "Skill Development Training Center",
        status: "COMPLETED",
      },

      {
        traineeId: priya._id,
        type: "ATTENDANCE_SUPPORT",
        reason:
          "Attendance is below the monitoring threshold.",
        action:
          "Contact trainee and provide attendance support.",
        assignedTo: "Skill Development Training Center",
        status: "PLANNED",
      },
    ]);

    /*
     * ---------------------------------------------------------
     * 12. CREATE EMPLOYER VERIFICATION
     * ---------------------------------------------------------
     */

    await EmployerVerification.create({
      traineeId: rahul._id,
      employmentId: employment._id,
      employerName: "Infosys",
      status: "VERIFIED",
      verifiedBy: "Employer Demo",
      verifiedAt: new Date("2026-09-05"),
      notes: "Demo employer verification completed.",
    });

    /*
     * ---------------------------------------------------------
     * 13. SEND SUCCESS RESPONSE
     * ---------------------------------------------------------
     */

    return res.json({
      message:
        "Demo flow loaded successfully. Government, Provider, Trainee and Employer dashboards are ready.",

      accounts: [
        {
          role: "GOVERNMENT",
          email: "gov@test.com",
          password: "Test123456",
        },

        {
          role: "PROVIDER",
          email: "provider@test.com",
          password: "Provider123456",
        },

        {
          role: "TRAINEE",
          email: "rahul@test.com",
          password: "Trainee123456",
        },

        {
          role: "EMPLOYER",
          email: "employer@test.com",
          password: "employer123",
        },
      ],

      flow: {
        provider: provider._id,
        program: program._id,
        batch: batch._id,
        trainee: rahul._id,
        certification: certification._id,
        employment: employment._id,
      },
    });
  } catch (error) {
    console.error("Demo reset/load error:", error);

    return res.status(500).json({
      message: "Failed to reset and load demo data.",
      error: error.message,
    });
  }
};

module.exports = {
  resetAndLoadDemo,
  clearOperationalData,
  injectSihData,
};