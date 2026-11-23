import { useEffect, useState } from "react";
import api from "../services/api";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import "../features/provider/Provider.css";
import {
  ProviderMetrics,
  BatchTableCard,
  AIAlertsCard,
  CreateBatchFormCard,
  AttendanceOverviewCard,
  RecentActivityCard,
  RecordAttendanceCard,
  RecordAssessmentCard,
  TraineeRosterCard,
  AISkillGapAnalysisCard,
  AIRetentionRiskCard,
  AIEmploymentRiskCard,
  InterventionFormCard,
  InterventionsListCard,
  AssessmentsListCard,
  FollowUpWorkflowCard,
  CertificationsListCard,
  EmploymentOutcomesCard,
} from "../features/provider";

function Provider() {
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [employments, setEmployments] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [skillGap, setSkillGap] = useState(null);
  const [retentionRisk, setRetentionRisk] = useState(null);
  const [employmentRisk, setEmploymentRisk] = useState(null);

  const [selectedAttendanceTrainee, setSelectedAttendanceTrainee] =
    useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] =
    useState("PRESENT");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [savingAttendance, setSavingAttendance] = useState(false);

  const [selectedAssessmentTrainee, setSelectedAssessmentTrainee] =
    useState("");
  const [assessmentSkill, setAssessmentSkill] = useState("");
  const [assessmentScore, setAssessmentScore] = useState("");
  const [assessmentAssessor, setAssessmentAssessor] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [assessmentMessage, setAssessmentMessage] = useState("");
  const [savingAssessment, setSavingAssessment] = useState(false);

  const [selectedInterventionTrainee, setSelectedInterventionTrainee] =
    useState("");
  const [interventionType, setInterventionType] =
    useState("SKILL_TRAINING");
  const [interventionReason, setInterventionReason] =
    useState("");
  const [interventionAction, setInterventionAction] =
    useState("");
  const [interventionAssignedTo, setInterventionAssignedTo] =
    useState("");
  const [interventionMessage, setInterventionMessage] =
    useState("");
  const [savingIntervention, setSavingIntervention] =
    useState(false);

  const [selectedFollowUpTrainee, setSelectedFollowUpTrainee] =
    useState("");
  const [followUpType, setFollowUpType] =
    useState("30_DAY");
  const [followUpScheduledDate, setFollowUpScheduledDate] =
    useState("");
  const [followUpMessage, setFollowUpMessage] =
    useState("");
  const [savingFollowUp, setSavingFollowUp] =
    useState(false);

  const [selectedEmploymentTrainee, setSelectedEmploymentTrainee] =
    useState("");
  const [employmentEmployerName, setEmploymentEmployerName] =
    useState("");
  const [employmentJobTitle, setEmploymentJobTitle] =
    useState("");
  const [employmentStartingSalary, setEmploymentStartingSalary] =
    useState("");
  const [employmentCurrentSalary, setEmploymentCurrentSalary] =
    useState("");
  const [employmentSalaryUpdatedDate, setEmploymentSalaryUpdatedDate] =
    useState("");
  const [employmentDate, setEmploymentDate] =
    useState("");
  const [employmentStatus, setEmploymentStatus] =
    useState("SEEKING");
  const [employmentJobRelevance, setEmploymentJobRelevance] =
    useState("NOT_ASSESSED");
  const [employmentFailureReason, setEmploymentFailureReason] =
    useState("");
  const [employmentEvidenceType, setEmploymentEvidenceType] =
    useState("NOT_PROVIDED");
  const [employmentEvidenceReference, setEmploymentEvidenceReference] =
    useState("");
  const [employmentVerificationConfidence, setEmploymentVerificationConfidence] =
    useState("0");
  const [employmentVerified, setEmploymentVerified] =
    useState(false);
  const [employmentMessage, setEmploymentMessage] =
    useState("");
  const [savingEmployment, setSavingEmployment] =
    useState(false);

  const [batchForm, setBatchForm] = useState({
    name: "",
    programId: "",
    startDate: "",
    endDate: "",
    capacity: "",
  });
  const [batchMessage, setBatchMessage] = useState("");
  const [savingBatch, setSavingBatch] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [analyzingSkillGap, setAnalyzingSkillGap] = useState(false);
  const [analyzingRetention, setAnalyzingRetention] =
    useState(false);
  const [analyzingEmployment, setAnalyzingEmployment] =
    useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          programsResponse,
          batchesResponse,
          traineesResponse,
          assessmentsResponse,
          certificationsResponse,
          employmentsResponse,
          interventionsResponse,
          followUpsResponse,
        ] = await Promise.all([
          api.get("/programs"),
          api.get("/batches"),
          api.get("/trainees"),
          api.get("/assessments"),
          api.get("/certifications"),
          api.get("/employments"),
          api.get("/interventions"),
          api.get("/followups"),
        ]);

        setPrograms(programsResponse.data.programs || []);
        setBatches(batchesResponse.data.batches || []);
        setTrainees(traineesResponse.data.trainees || []);

        setAssessments(
          assessmentsResponse.data.assessments || []
        );

        setCertifications(
          certificationsResponse.data.certifications || []
        );

        setEmployments(
          employmentsResponse.data.employments || []
        );

        setInterventions(
          interventionsResponse.data.interventions || []
        );

        setFollowUps(
          followUpsResponse.data.followUps || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load Provider data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getBatchId = (trainee) => {
    if (!trainee?.batchId) {
      return null;
    }

    if (typeof trainee.batchId === "object") {
      return trainee.batchId._id;
    }

    return trainee.batchId;
  };

  const getProgramForTrainee = (trainee) => {
    const batchId = getBatchId(trainee);

    if (!batchId) {
      return null;
    }

    const batch = batches.find(
      (item) => item._id === batchId
    );

    if (!batch) {
      return null;
    }

    const programId =
      typeof batch.programId === "object"
        ? batch.programId._id
        : batch.programId;

    return programs.find(
      (program) => program._id === programId
    );
  };

  const selectedAssessmentTraineeObject =
    trainees.find(
      (trainee) =>
        trainee._id === selectedAssessmentTrainee
    );

  const selectedAssessmentProgram =
    getProgramForTrainee(
      selectedAssessmentTraineeObject
    );

  const availableAssessmentSkills =
    selectedAssessmentProgram?.targetSkills || [];

  const scrollToInterventionForm = () => {
    setTimeout(() => {
      document
        .getElementById("ai-intervention-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  const analyzeSkillGap = async (traineeId) => {
    setError("");
    setSkillGap(null);
    setAnalyzingSkillGap(true);

    try {
      const response = await api.get(
        `/ai/trainees/${traineeId}/skill-gap`
      );

      setSkillGap(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to analyze skill gap."
      );
    } finally {
      setAnalyzingSkillGap(false);
    }
  };

  const analyzeRetentionRisk = async (traineeId) => {
    setError("");
    setRetentionRisk(null);
    setAnalyzingRetention(true);

    try {
      const response = await api.get(
        `/ai/trainees/${traineeId}/retention-risk`
      );

      setRetentionRisk(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to analyze retention risk."
      );
    } finally {
      setAnalyzingRetention(false);
    }
  };

  const analyzeEmploymentRisk = async (traineeId) => {
    setError("");
    setEmploymentRisk(null);
    setAnalyzingEmployment(true);

    try {
      const response = await api.get(
        `/ai/trainees/${traineeId}/employment-risk`
      );

      setEmploymentRisk(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to analyze employment risk."
      );
    } finally {
      setAnalyzingEmployment(false);
    }
  };

  const useSkillGapAsIntervention = (item) => {
    const traineeId =
      skillGap?.trainee?.id ||
      skillGap?.trainee?._id;

    if (!traineeId) {
      setError(
        "Unable to identify the trainee from the AI analysis."
      );
      return;
    }

    setSelectedInterventionTrainee(traineeId);
    setInterventionType("SKILL_TRAINING");

    setInterventionReason(
      item.explanation ||
      `${item.skill} requires additional improvement.`
    );

    setInterventionAction(
      item.recommendation ||
      `Provide focused training in ${item.skill} and reassess the trainee.`
    );

    setInterventionMessage(
      "AI recommendation loaded into the intervention form. Review and create the intervention."
    );

    scrollToInterventionForm();
  };

  const useRetentionRiskAsIntervention = () => {
    const traineeId =
      retentionRisk?.trainee?.id ||
      retentionRisk?.trainee?._id;

    if (!traineeId) {
      setError(
        "Unable to identify the trainee from the AI analysis."
      );
      return;
    }

    setSelectedInterventionTrainee(traineeId);

    const reasons =
      retentionRisk.analysis?.reasons || [];

    const combinedReason = reasons.length
      ? reasons.join(" ")
      : "AI identified retention or dropout risk for this trainee.";

    const recommendation =
      retentionRisk.analysis?.recommendation ||
      "Provide targeted support and monitor the trainee's progress.";

    const reasonText = combinedReason.toLowerCase();

    if (
      reasonText.includes("attendance") ||
      reasonText.includes("participation")
    ) {
      setInterventionType("ATTENDANCE_SUPPORT");
    } else if (
      reasonText.includes("assessment") ||
      reasonText.includes("skill") ||
      reasonText.includes("training")
    ) {
      setInterventionType("SKILL_TRAINING");
    } else {
      setInterventionType("MENTORING");
    }

    setInterventionReason(combinedReason);

    setInterventionAction(recommendation);

    setInterventionMessage(
      "AI retention recommendation loaded into the intervention form. Review and create the intervention."
    );

    scrollToInterventionForm();
  };

  const useEmploymentRiskAsIntervention = () => {
    const traineeId =
      employmentRisk?.trainee?.id ||
      employmentRisk?.trainee?._id;

    if (!traineeId) {
      setError(
        "Unable to identify the trainee from the AI analysis."
      );
      return;
    }

    setSelectedInterventionTrainee(traineeId);
    setInterventionType("PLACEMENT_SUPPORT");

    const reasons =
      employmentRisk.analysis?.reasons || [];

    setInterventionReason(
      reasons.length
        ? reasons.join(" ")
        : "AI identified employment or placement risk for this trainee."
    );

    setInterventionAction(
      employmentRisk.analysis?.recommendation ||
      "Provide targeted placement support and improve job readiness."
    );

    setInterventionMessage(
      "AI employment recommendation loaded into the intervention form. Review and create the intervention."
    );

    scrollToInterventionForm();
  };

  useEffect(() => {
    if (!loading && trainees.length > 0) {
      const targetTrainee =
        trainees.find((t) => (t.attendancePercentage || 0) < 75) ||
        trainees[0];
      if (targetTrainee && !retentionRisk) {
        analyzeRetentionRisk(targetTrainee._id);
      }
      if (targetTrainee && !skillGap) {
        analyzeSkillGap(targetTrainee._id);
      }
    }
  }, [loading, trainees.length]);

  const recordAttendance = async (event) => {
    event.preventDefault();

    setError("");
    setAttendanceMessage("");

    if (!selectedAttendanceTrainee) {
      setError("Please select a trainee.");
      return;
    }

    if (!attendanceDate) {
      setError("Please select an attendance date.");
      return;
    }

    setSavingAttendance(true);

    try {
      const response = await api.post("/attendance", {
        traineeId: selectedAttendanceTrainee,
        date: attendanceDate,
        status: attendanceStatus,
        markedBy: "Provider",
      });

      setAttendanceMessage(
        `Attendance recorded successfully. Updated attendance: ${response.data.attendancePercentage}%`
      );

      setTrainees((currentTrainees) =>
        currentTrainees.map((trainee) =>
          trainee._id === selectedAttendanceTrainee
            ? {
              ...trainee,
              attendancePercentage:
                response.data.attendancePercentage,
            }
            : trainee
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to record attendance."
      );
    } finally {
      setSavingAttendance(false);
    }
  };

  const recordAssessment = async (event) => {
    event.preventDefault();

    setError("");
    setAssessmentMessage("");

    if (!selectedAssessmentTrainee) {
      setError("Please select a trainee.");
      return;
    }

    if (!assessmentSkill) {
      setError("Please select a skill.");
      return;
    }

    if (
      assessmentScore === "" ||
      Number(assessmentScore) < 0 ||
      Number(assessmentScore) > 100
    ) {
      setError(
        "Assessment score must be between 0 and 100."
      );
      return;
    }

    if (!assessmentDate) {
      setError("Please select an assessment date.");
      return;
    }

    setSavingAssessment(true);

    try {
      const response = await api.post("/assessments", {
        traineeId: selectedAssessmentTrainee,
        skill: assessmentSkill,
        score: Number(assessmentScore),
        maxScore: 100,
        assessmentDate,
        assessor: assessmentAssessor.trim(),
      });

      setAssessments((currentAssessments) => [
        response.data.assessment,
        ...currentAssessments,
      ]);

      setTrainees((currentTrainees) =>
        currentTrainees.map((trainee) => {
          if (
            trainee._id !== selectedAssessmentTrainee
          ) {
            return trainee;
          }

          const existingSkillIndex =
            trainee.skills?.findIndex(
              (item) =>
                item.name.toLowerCase().trim() ===
                assessmentSkill.toLowerCase().trim()
            );

          if (
            existingSkillIndex !== undefined &&
            existingSkillIndex >= 0
          ) {
            const updatedSkills = [
              ...(trainee.skills || []),
            ];

            updatedSkills[existingSkillIndex] = {
              ...updatedSkills[existingSkillIndex],
              level: Number(assessmentScore),
            };

            return {
              ...trainee,
              skills: updatedSkills,
            };
          }

          return {
            ...trainee,
            skills: [
              ...(trainee.skills || []),
              {
                name: assessmentSkill,
                level: Number(assessmentScore),
              },
            ],
          };
        })
      );

      setAssessmentMessage(
        "Assessment recorded successfully."
      );

      setAssessmentSkill("");
      setAssessmentScore("");
      setAssessmentAssessor("");
      setAssessmentDate("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to record assessment."
      );
    } finally {
      setSavingAssessment(false);
    }
  };

  const handleAssessmentTraineeChange = (event) => {
    setSelectedAssessmentTrainee(
      event.target.value
    );

    setAssessmentSkill("");
  };

  const createIntervention = async (event) => {
    event.preventDefault();

    setError("");
    setInterventionMessage("");

    if (!selectedInterventionTrainee) {
      setError("Please select a trainee.");
      return;
    }

    if (!interventionType) {
      setError("Please select an intervention type.");
      return;
    }

    if (!interventionReason.trim()) {
      setError(
        "Please provide the reason for the intervention."
      );
      return;
    }

    if (!interventionAction.trim()) {
      setError(
        "Please provide the intervention action."
      );
      return;
    }

    setSavingIntervention(true);

    try {
      const response = await api.post("/interventions", {
        traineeId: selectedInterventionTrainee,
        type: interventionType,
        reason: interventionReason.trim(),
        action: interventionAction.trim(),
        assignedTo: interventionAssignedTo.trim(),
      });

      setInterventions((currentInterventions) => [
        response.data.intervention,
        ...currentInterventions,
      ]);

      setInterventionMessage(
        "Intervention created successfully."
      );

      setSelectedInterventionTrainee("");
      setInterventionType("SKILL_TRAINING");
      setInterventionReason("");
      setInterventionAction("");
      setInterventionAssignedTo("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create intervention."
      );
    } finally {
      setSavingIntervention(false);
    }
  };

  const updateInterventionStatus = async (
    interventionId,
    status
  ) => {
    setError("");

    try {
      const response = await api.patch(
        `/interventions/${interventionId}`,
        {
          status,
        }
      );

      setInterventions((currentInterventions) =>
        currentInterventions.map((intervention) =>
          intervention._id === interventionId
            ? response.data.intervention
            : intervention
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update intervention."
      );
    }
  };

  const createFollowUp = async (event) => {
    event.preventDefault();

    setError("");
    setFollowUpMessage("");

    if (!selectedFollowUpTrainee) {
      setError("Please select a trainee.");
      return;
    }

    if (!followUpScheduledDate) {
      setError("Please select a scheduled date.");
      return;
    }

    setSavingFollowUp(true);

    try {
      const response = await api.post("/followups", {
        traineeId: selectedFollowUpTrainee,
        type: followUpType,
        scheduledDate: followUpScheduledDate,
      });

      setFollowUps((currentFollowUps) => [
        response.data.followUp,
        ...currentFollowUps,
      ]);

      setFollowUpMessage("Follow-up scheduled successfully.");

      setSelectedFollowUpTrainee("");
      setFollowUpType("30_DAY");
      setFollowUpScheduledDate("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create follow-up."
      );
    } finally {
      setSavingFollowUp(false);
    }
  };

  const completeFollowUp = async (
    followUpId,
    currentlyEmployed,
    sameRole,
    notes
  ) => {
    setError("");
    setFollowUpMessage("");

    try {
      const response = await api.patch(
        `/followups/${followUpId}`,
        {
          status: "COMPLETED",
          completedDate: new Date().toISOString(),
          currentlyEmployed,
          sameRole,
          notes,
        }
      );

      setFollowUps((currentFollowUps) =>
        currentFollowUps.map((followUp) =>
          followUp._id === followUpId
            ? response.data.followUp
            : followUp
        )
      );

      setFollowUpMessage("Follow-up completed and outcome recorded.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to complete follow-up."
      );
    }
  };

  const recordEmployment = async (event) => {
    event.preventDefault();

    setError("");
    setEmploymentMessage("");

    if (!selectedEmploymentTrainee) {
      setError("Please select a trainee.");
      return;
    }

    if (!employmentEmployerName.trim()) {
      setError("Please enter the employer name.");
      return;
    }

    if (!employmentJobTitle.trim()) {
      setError("Please enter the job title.");
      return;
    }

    if (!employmentDate) {
      setError("Please select the employment date.");
      return;
    }

    setSavingEmployment(true);

    try {
      const response = await api.post("/employments", {
        traineeId: selectedEmploymentTrainee,
        employerName: employmentEmployerName.trim(),
        jobTitle: employmentJobTitle.trim(),
        startingSalary:
          employmentStartingSalary === ""
            ? undefined
            : Number(employmentStartingSalary),
        currentSalary:
          employmentCurrentSalary === ""
            ? undefined
            : Number(employmentCurrentSalary),
        salaryUpdatedDate: employmentSalaryUpdatedDate || undefined,
        employmentDate,
        status: employmentStatus,
        jobRelevance: employmentJobRelevance,
        failureReason: employmentFailureReason.trim(),
        evidenceType: employmentEvidenceType,
        evidenceReference: employmentEvidenceReference.trim(),
        verificationConfidence: Number(employmentVerificationConfidence),
        verified: employmentVerified,
      });

      setEmployments((currentEmployments) => [
        response.data.employment,
        ...currentEmployments,
      ]);

      setEmploymentMessage(
        "Employment outcome recorded successfully."
      );

      setSelectedEmploymentTrainee("");
      setEmploymentEmployerName("");
      setEmploymentJobTitle("");
      setEmploymentStartingSalary("");
      setEmploymentCurrentSalary("");
      setEmploymentSalaryUpdatedDate("");
      setEmploymentDate("");
      setEmploymentStatus("SEEKING");
      setEmploymentJobRelevance("NOT_ASSESSED");
      setEmploymentFailureReason("");
      setEmploymentEvidenceType("NOT_PROVIDED");
      setEmploymentEvidenceReference("");
      setEmploymentVerificationConfidence("0");
      setEmploymentVerified(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to record employment outcome."
      );
    } finally {
      setSavingEmployment(false);
    }
  };

  const handleBatchFormChange = (event) => {
    const { name, value } = event.target;

    setBatchForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createBatch = async (event) => {
    event.preventDefault();

    setError("");
    setBatchMessage("");

    if (!batchForm.name.trim()) {
      setError("Please enter a batch name.");
      return;
    }

    if (!batchForm.programId) {
      setError("Please select a training program.");
      return;
    }

    if (!batchForm.startDate || !batchForm.endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(batchForm.endDate) < new Date(batchForm.startDate)) {
      setError("End date cannot be before the start date.");
      return;
    }

    const capacity = Number(batchForm.capacity);

    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError("Capacity must be a positive whole number.");
      return;
    }

    setSavingBatch(true);

    try {
      const response = await api.post("/batches", {
        name: batchForm.name.trim(),
        programId: batchForm.programId,
        startDate: batchForm.startDate,
        endDate: batchForm.endDate,
        capacity,
        status: "UPCOMING",
      });

      const createdBatch = response.data.batch;

      setBatches((currentBatches) => [
        createdBatch,
        ...currentBatches,
      ]);

      setBatchMessage("Batch created successfully.");

      setBatchForm({
        name: "",
        programId: "",
        startDate: "",
        endDate: "",
        capacity: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create batch."
      );
    } finally {
      setSavingBatch(false);
    }
  };

  const activeBatches = batches.filter((batch) => batch.status === "ACTIVE").length;
  const totalCapacity = batches.reduce(
    (sum, batch) => sum + Number(batch.capacity || 0),
    0
  );
  const averageAttendance = trainees.length
    ? Math.round(
      trainees.reduce(
        (sum, trainee) => sum + Number(trainee.attendancePercentage || 0),
        0
      ) / trainees.length
    )
    : 0;
  const certifiedTrainees = trainees.filter(
    (trainee) => trainee.status === "CERTIFIED"
  ).length;
  const employmentRecords = employments.filter(
    (employment) => employment.status === "EMPLOYED"
  ).length;
  const attendanceRing = Math.max(0, Math.min(100, averageAttendance));

  const recentAssessments = assessments.slice(0, 4);
  const recentInterventions = interventions.slice(0, 3);

  const alertItems = trainees
    .map((trainee) => {
      const attendance = Number(trainee.attendancePercentage || 0);
      const traineeAssessments = assessments.filter(
        (assessment) =>
          (typeof assessment.traineeId === "object"
            ? assessment.traineeId?._id
            : assessment.traineeId) === trainee._id
      );
      const assessmentAverage = traineeAssessments.length
        ? Math.round(
          traineeAssessments.reduce(
            (sum, assessment) => sum + Number(assessment.score || 0),
            0
          ) / traineeAssessments.length
        )
        : null;

      if (attendance < 75) {
        return {
          trainee,
          title: "Attendance needs attention",
          detail: `${attendance}% attendance`,
          type: "warning",
          action: () => analyzeRetentionRisk(trainee._id),
          actionLabel: "Analyze",
        };
      }

      if (assessmentAverage !== null && assessmentAverage < 60) {
        return {
          trainee,
          title: "Assessment performance is low",
          detail: `${assessmentAverage}% average score`,
          type: "danger",
          action: () => analyzeEmploymentRisk(trainee._id),
          actionLabel: "Analyze",
        };
      }

      if (trainee.status !== "CERTIFIED") {
        return {
          trainee,
          title: "Certification pending",
          detail: "Trainee is not certified yet",
          type: "info",
          action: () => analyzeSkillGap(trainee._id),
          actionLabel: "Review",
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(0, 4);

  return (
    <WorkspaceLayout role="PROVIDER">
      <main className="provider-page">
        <header className="provider-header">
          <div>
            <p className="provider-eyebrow">Training delivery & learner outcomes</p>
            <h1>Provider Dashboard</h1>
            <p>
              Manage batches, track trainees, record evidence, and act on AI-generated
              skill, retention, and placement signals.
            </p>
          </div>
          <div className="provider-header-badge">
            <span /> Live workspace
          </div>
        </header>

        {error && (
          <div className="provider-message error">
            <strong>Action required:</strong> {error}
          </div>
        )}

        {attendanceMessage && (
          <div className="provider-message success">{attendanceMessage}</div>
        )}
        {assessmentMessage && (
          <div className="provider-message success">{assessmentMessage}</div>
        )}
        {interventionMessage && (
          <div className="provider-message success">{interventionMessage}</div>
        )}

        {batchMessage && (
          <div className="provider-message success">{batchMessage}</div>
        )}

        <div id="overview">
          <ProviderMetrics
            batchesCount={batches.length}
            activeBatches={activeBatches}
            traineesCount={trainees.length}
            totalCapacity={totalCapacity}
            averageAttendance={averageAttendance}
            certifiedTrainees={certifiedTrainees}
            employmentRecords={employmentRecords}
          />
        </div>

        <section className="provider-dashboard-grid" id="batches">
          <BatchTableCard batches={batches} />
          <div className="provider-dashboard-side" id="ai-alerts">
            <AIAlertsCard alerts={alertItems} />
            <AttendanceOverviewCard
              averageAttendance={averageAttendance}
              attendanceRing={attendanceRing}
              certifiedTrainees={certifiedTrainees}
              employmentRecords={employmentRecords}
            />
            <CertificationsListCard certifications={certifications} />
          </div>
        </section>

        <CreateBatchFormCard
          programs={programs}
          batchForm={batchForm}
          onBatchFormChange={handleBatchFormChange}
          onCreateBatch={createBatch}
          savingBatch={savingBatch}
        />

        <RecentActivityCard
          recentAssessments={recentAssessments}
          recentInterventions={recentInterventions}
        />

        <div className="provider-operations-row">
          <RecordAttendanceCard
            trainees={trainees}
            selectedTrainee={selectedAttendanceTrainee}
            onSelectTrainee={setSelectedAttendanceTrainee}
            attendanceDate={attendanceDate}
            onAttendanceDateChange={setAttendanceDate}
            attendanceStatus={attendanceStatus}
            onAttendanceStatusChange={setAttendanceStatus}
            onRecordAttendance={recordAttendance}
            savingAttendance={savingAttendance}
          />

          <RecordAssessmentCard
            trainees={trainees}
            selectedTrainee={selectedAssessmentTrainee}
            onTraineeChange={handleAssessmentTraineeChange}
            assessmentSkill={assessmentSkill}
            onSkillChange={setAssessmentSkill}
            availableAssessmentSkills={availableAssessmentSkills}
            assessmentScore={assessmentScore}
            onScoreChange={setAssessmentScore}
            assessmentAssessor={assessmentAssessor}
            onAssessorChange={setAssessmentAssessor}
            assessmentDate={assessmentDate}
            onDateChange={setAssessmentDate}
            onRecordAssessment={recordAssessment}
            savingAssessment={savingAssessment}
          />
        </div>

        <TraineeRosterCard
          trainees={trainees}
          analyzingSkillGap={analyzingSkillGap}
          analyzingRetention={analyzingRetention}
          analyzingEmployment={analyzingEmployment}
          onAnalyzeSkillGap={analyzeSkillGap}
          onAnalyzeRetentionRisk={analyzeRetentionRisk}
          onAnalyzeEmploymentRisk={analyzeEmploymentRisk}
        />

        <div className="provider-ai-grid" id="ai-analysis">
          <AISkillGapAnalysisCard
            skillGap={skillGap}
            analyzingSkillGap={analyzingSkillGap}
            onUseAsIntervention={useSkillGapAsIntervention}
            trainees={trainees}
            onAnalyzeSkillGap={analyzeSkillGap}
            selectedTrainee={selectedAssessmentTrainee}
            onSelectTrainee={setSelectedAssessmentTrainee}
          />

          <AIRetentionRiskCard
            retentionRisk={retentionRisk}
            analyzingRetention={analyzingRetention}
            onUseAsIntervention={useRetentionRiskAsIntervention}
            trainees={trainees}
            onAnalyzeRetentionRisk={analyzeRetentionRisk}
          />

          <AIEmploymentRiskCard
            employmentRisk={employmentRisk}
            analyzingEmployment={analyzingEmployment}
            onUseAsIntervention={useEmploymentRiskAsIntervention}
            trainees={trainees}
            onAnalyzeEmploymentRisk={analyzeEmploymentRisk}
          />
        </div>

        <InterventionFormCard
          trainees={trainees}
          selectedTrainee={selectedInterventionTrainee}
          onSelectTrainee={setSelectedInterventionTrainee}
          interventionType={interventionType}
          onTypeChange={setInterventionType}
          interventionReason={interventionReason}
          onReasonChange={setInterventionReason}
          interventionAction={interventionAction}
          onActionChange={setInterventionAction}
          interventionAssignedTo={interventionAssignedTo}
          onAssignedToChange={setInterventionAssignedTo}
          onCreateIntervention={createIntervention}
          savingIntervention={savingIntervention}
        />

        <div className="provider-operations-row provider-interventions-row">
          <InterventionsListCard
            interventions={interventions}
            onUpdateStatus={updateInterventionStatus}
          />

          <FollowUpWorkflowCard
            followUps={followUps}
            trainees={trainees}
            selectedTrainee={selectedFollowUpTrainee}
            onSelectTrainee={setSelectedFollowUpTrainee}
            followUpType={followUpType}
            onTypeChange={setFollowUpType}
            scheduledDate={followUpScheduledDate}
            onScheduledDateChange={setFollowUpScheduledDate}
            onCreateFollowUp={createFollowUp}
            savingFollowUp={savingFollowUp}
            followUpMessage={followUpMessage}
            onCompleteFollowUp={completeFollowUp}
          />
        </div>

        <AssessmentsListCard assessments={assessments} />

        <EmploymentOutcomesCard
          employments={employments}
          trainees={trainees}
          selectedTrainee={selectedEmploymentTrainee}
          onSelectTrainee={setSelectedEmploymentTrainee}
          employerName={employmentEmployerName}
          onEmployerNameChange={setEmploymentEmployerName}
          jobTitle={employmentJobTitle}
          onJobTitleChange={setEmploymentJobTitle}
          startingSalary={employmentStartingSalary}
          onStartingSalaryChange={setEmploymentStartingSalary}
          currentSalary={employmentCurrentSalary}
          onCurrentSalaryChange={setEmploymentCurrentSalary}
          salaryUpdatedDate={employmentSalaryUpdatedDate}
          onSalaryUpdatedDateChange={setEmploymentSalaryUpdatedDate}
          employmentDate={employmentDate}
          onEmploymentDateChange={setEmploymentDate}
          employmentStatus={employmentStatus}
          onEmploymentStatusChange={setEmploymentStatus}
          jobRelevance={employmentJobRelevance}
          onJobRelevanceChange={setEmploymentJobRelevance}
          failureReason={employmentFailureReason}
          onFailureReasonChange={setEmploymentFailureReason}
          evidenceType={employmentEvidenceType}
          onEvidenceTypeChange={setEmploymentEvidenceType}
          evidenceReference={employmentEvidenceReference}
          onEvidenceReferenceChange={setEmploymentEvidenceReference}
          verificationConfidence={employmentVerificationConfidence}
          onVerificationConfidenceChange={setEmploymentVerificationConfidence}
          verified={employmentVerified}
          onVerifiedChange={setEmploymentVerified}
          onRecordEmployment={recordEmployment}
          savingEmployment={savingEmployment}
          employmentMessage={employmentMessage}
        />
      </main>
    </WorkspaceLayout>
  );
}

export default Provider;
