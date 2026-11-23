import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import {
  TraineeConsentCard,
  OutcomePassportCard,
  BatchEnrollmentCard,
  TraineeMetrics,
  ProgramJourneyCard,
  LatestAssessmentCard,
  MySkillsCard,
  PlacementStatusCard,
  FollowUpTimelineCard,
  AIGuidanceCard,
  CertificationCard,
  ProfileDetailsCard,
  AssessmentHistoryTable,
} from "../features/trainee";
import "../features/trainee/Trainee.css";

function Trainee() {
  const { user } = useAuth();

  const [trainee, setTrainee] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [employments, setEmployments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [skillGap, setSkillGap] = useState(null);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollingBatchId, setEnrollingBatchId] = useState("");
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  const [consent, setConsent] = useState(user?.consent || null);
  const [consentSaving, setConsentSaving] = useState(false);
  const [consentMessage, setConsentMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user?.traineeId) {
          setError("No trainee profile is linked to this account.");
          setLoading(false);
          return;
        }

        const traineeId = user.traineeId;

        const [
          traineeResponse,
          assessmentsResponse,
          certificationsResponse,
          employmentsResponse,
          followUpsResponse,
        ] = await Promise.all([
          api.get("/trainees/me"),
          api.get("/assessments"),
          api.get("/certifications"),
          api.get("/employments"),
          api.get("/followups"),
        ]);

        setTrainee(traineeResponse.data.trainee || null);

        try {
          const meResponse = await api.get("/auth/me");
          setConsent(meResponse.data.user?.consent || null);
        } catch (consentError) {
          console.warn("Failed to load consent status:", consentError);
          setConsent(user?.consent || null);
        }

        setAssessments(
          (assessmentsResponse.data.assessments || []).filter(
            (assessment) =>
              assessment.traineeId === traineeId ||
              assessment.traineeId?._id === traineeId
          )
        );

        setCertifications(
          (certificationsResponse.data.certifications || []).filter(
            (certification) =>
              certification.traineeId === traineeId ||
              certification.traineeId?._id === traineeId
          )
        );

        setEmployments(
          (employmentsResponse.data.employments || []).filter(
            (employment) =>
              employment.traineeId === traineeId ||
              employment.traineeId?._id === traineeId
          )
        );

        setFollowUps(
          (followUpsResponse.data.followUps || []).filter(
            (followUp) =>
              followUp.traineeId === traineeId ||
              followUp.traineeId?._id === traineeId
          )
        );

        const enrollmentResponse = await api.get("/enrollments");

        setEnrollments(
          (enrollmentResponse.data.enrollments || []).filter(
            (enrollment) =>
              enrollment.traineeId === traineeId ||
              enrollment.traineeId?._id === traineeId
          )
        );

        // Only fetch open batches when the trainee is not already assigned
        // to a training batch. This keeps the existing journey unchanged
        // while giving new trainees a real enrollment path.
        if (!traineeResponse.data.trainee?.batchId) {
          const batchesResponse = await api.get("/batches");

          const openBatches = (batchesResponse.data.batches || []).filter(
            (batchItem) =>
              batchItem.status === "UPCOMING" ||
              batchItem.status === "ACTIVE"
          );

          setAvailableBatches(openBatches);
        } else {
          setAvailableBatches([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load trainee data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const enrollInBatch = async (batchId) => {
    if (!batchId) return;

    setEnrollmentMessage("");
    setError("");
    setEnrollingBatchId(batchId);

    try {
      const response = await api.post("/enrollments", { batchId });

      setEnrollmentMessage(
        response.data?.message || "Enrollment completed successfully."
      );

      // Refresh the trainee profile so the training journey reflects
      // the newly selected batch after the backend updates the profile.
      const traineeResponse = await api.get("/trainees/me");
      setTrainee(traineeResponse.data.trainee || null);

      const enrollmentResponse = await api.get("/enrollments");
      const traineeId = user?.traineeId;

      setEnrollments(
        (enrollmentResponse.data.enrollments || []).filter(
          (enrollment) =>
            enrollment.traineeId === traineeId ||
            enrollment.traineeId?._id === traineeId
        )
      );

      setAvailableBatches([]);
    } catch (err) {
      setEnrollmentMessage(
        err.response?.data?.message || "Failed to enroll in this batch."
      );
    } finally {
      setEnrollingBatchId("");
    }
  };

  const giveConsent = async () => {
    if (consent?.given) return;

    setConsentSaving(true);
    setConsentMessage("");
    setError("");

    try {
      const response = await api.post("/auth/consent");
      setConsent(response.data.consent || null);
      setConsentMessage(
        response.data?.message || "Consent recorded successfully."
      );
    } catch (err) {
      setConsentMessage(
        err.response?.data?.message || "Failed to record consent."
      );
    } finally {
      setConsentSaving(false);
    }
  };

  const analyzeSkillGap = async () => {
    if (!trainee?._id) return;

    setError("");
    setSkillGap(null);
    setAnalyzing(true);

    try {
      const response = await api.get(
        `/ai/trainees/${trainee._id}/skill-gap`
      );
      setSkillGap(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to analyze skill gap."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!loading && trainee?._id && !skillGap) {
      analyzeSkillGap();
    }
  }, [loading, trainee?._id]);

  const formatDate = (value) => {
    if (!value) return "Not available";
    return new Date(value).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const batch = useMemo(() => {
    if (!trainee?.batchId) return null;
    return typeof trainee.batchId === "object" ? trainee.batchId : null;
  }, [trainee]);

  const program = useMemo(() => {
    if (!batch?.programId) return null;
    return typeof batch.programId === "object" ? batch.programId : null;
  }, [batch]);

  const currentEnrollment = useMemo(() => {
    if (!enrollments.length) return null;

    return (
      enrollments.find(
        (enrollment) =>
          enrollment.status === "ACTIVE" ||
          enrollment.status === "ENROLLED"
      ) || enrollments[0]
    );
  }, [enrollments]);

  const averageAssessment = useMemo(() => {
    if (!assessments.length) return 0;
    return Math.round(
      assessments.reduce((sum, item) => sum + Number(item.score || 0), 0) /
        assessments.length
    );
  }, [assessments]);

  const latestAssessment = assessments[0] || null;

  const latestEmployment = employments[0] || null;

  const placementStatus = latestEmployment
    ? latestEmployment.status === "EMPLOYED"
      ? "Employed"
      : latestEmployment.status === "SEEKING"
        ? "Seeking"
        : "Unemployed"
    : "Not recorded";

  const completedSkills =
    trainee?.skills?.filter((skill) => Number(skill.level || 0) >= 75).length ||
    0;

  const totalSkills = trainee?.skills?.length || 0;

  const skillProgress =
    totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  const upcomingAssessment = latestAssessment
    ? {
        skill: latestAssessment.skill,
        date: formatDate(latestAssessment.assessmentDate),
        score: latestAssessment.score,
      }
    : null;

  if (loading) {
    return (
      <WorkspaceLayout role="TRAINEE">
        <div className="trainee-loading">
          <div className="trainee-spinner" />
          <p>Loading your training workspace...</p>
        </div>
      </WorkspaceLayout>
    );
  }

  if (error && !trainee) {
    return (
      <WorkspaceLayout role="TRAINEE">
        <div className="trainee-state-card error-state">
          <div className="state-icon">!</div>
          <h2>Unable to load your profile</h2>
          <p>{error}</p>
        </div>
      </WorkspaceLayout>
    );
  }

  if (!trainee) {
    return (
      <WorkspaceLayout role="TRAINEE">
        <div className="trainee-state-card">
          <div className="state-icon">?</div>
          <h2>Trainee profile not found</h2>
          <p>No trainee profile is currently linked to this account.</p>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout role="TRAINEE">
      <main className="trainee-page">
        {/* HEADER */}
        <header className="trainee-header">
          <div>
            <div className="trainee-breadcrumb">
              Workspace <span>/</span> Trainee
            </div>
            <h1>My Training Journey</h1>
            <p>
              Track your progress, assessments, certification and employment
              journey.
            </p>
          </div>

          <div className="trainee-header-profile">
            <div className="trainee-avatar">
              {trainee.name?.charAt(0)?.toUpperCase() || "T"}
            </div>
            <div>
              <strong>{trainee.name}</strong>
              <span>{trainee.status || "Trainee"}</span>
            </div>
          </div>
        </header>

        {/* ERROR ALERT */}
        {error && (
          <div className="trainee-alert error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* 1. DATA CONSENT */}
        <TraineeConsentCard
          consent={consent}
          consentSaving={consentSaving}
          consentMessage={consentMessage}
          onGiveConsent={giveConsent}
          formatDate={formatDate}
        />

        {/* 2. OUTCOME PASSPORT */}
        <OutcomePassportCard skillOutcomeId={trainee.skillOutcomeId} />

        {/* 3. BATCH ENROLLMENT (WHEN NOT ASSIGNED TO A BATCH) */}
        {!trainee.batchId && (
          <BatchEnrollmentCard
            availableBatches={availableBatches}
            enrollments={enrollments}
            currentEnrollment={currentEnrollment}
            enrollmentLoading={enrollmentLoading}
            enrollingBatchId={enrollingBatchId}
            enrollmentMessage={enrollmentMessage}
            onEnroll={enrollInBatch}
            formatDate={formatDate}
          />
        )}

        {/* 4. METRIC CARDS */}
        <TraineeMetrics
          programName={program?.name}
          programSector={program?.sector}
          attendancePercentage={trainee.attendancePercentage ?? 0}
          assessmentsCount={assessments.length}
          averageAssessment={averageAssessment}
          certificationsCount={certifications.length}
        />

        {/* 5. PROGRAM JOURNEY & LATEST ASSESSMENT */}
        <section className="trainee-top-grid">
          <ProgramJourneyCard
            program={program}
            batch={batch}
            traineeStatus={trainee.status}
            skillProgress={skillProgress}
            completedSkills={completedSkills}
            totalSkills={totalSkills}
            formatDate={formatDate}
          />

          <LatestAssessmentCard
            latestAssessment={latestAssessment}
            upcomingAssessment={upcomingAssessment}
            formatDate={formatDate}
          />
        </section>

        {/* 6. SKILLS & PLACEMENT STATUS */}
        <section className="trainee-middle-grid">
          <MySkillsCard
            skills={trainee.skills}
            totalSkills={totalSkills}
          />

          <PlacementStatusCard
            placementStatus={placementStatus}
            latestEmployment={latestEmployment}
            formatDate={formatDate}
          />
        </section>

        {/* 7. POST-TRAINING FOLLOW-UP */}
        <FollowUpTimelineCard
          followUps={followUps}
          formatDate={formatDate}
        />

        {/* 8. AI GUIDANCE & SKILL GAP ANALYSIS */}
        <AIGuidanceCard
          skillGap={skillGap}
          analyzing={analyzing}
          onAnalyze={analyzeSkillGap}
        />

        {/* 9. CERTIFICATION & PROFILE DETAILS */}
        <section className="trainee-bottom-grid">
          <CertificationCard
            certifications={certifications}
            formatDate={formatDate}
          />

          <ProfileDetailsCard trainee={trainee} />
        </section>

        {/* 10. ASSESSMENT HISTORY */}
        <AssessmentHistoryTable
          assessments={assessments}
          formatDate={formatDate}
        />

        {/* FOOTER */}
        <footer className="trainee-footer">
          <span>KaushalMetric Tracker</span>
          <span>Your skills. Your progress. Your future.</span>
        </footer>
      </main>
    </WorkspaceLayout>
  );
}

export default Trainee;
