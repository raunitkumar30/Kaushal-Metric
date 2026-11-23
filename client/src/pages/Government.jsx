import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import "../features/government/Government.css";
import {
  GovernmentHeader,
  GovernmentMetrics,
  OutcomeAnalyticsSection,
  ProviderPerformanceSection,
  CreateProgramCard,
  ProgramOverviewCard,
  ProgramDeliverySnapshots,
  TraineeMonitoringCard,
  AISkillGapAnalysisCard,
  GovernmentAIInsightsSection,
  AggregateSkillInsightsSection,
  ProgramOutcomesCard,
} from "../features/government";

function Government() {
  const [programs, setPrograms] = useState([]);
  const [providers, setProviders] = useState([]);
  const [batches, setBatches] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [employments, setEmployments] = useState([]);
  const [outcomeAnalytics, setOutcomeAnalytics] = useState(null);

  const [programForm, setProgramForm] = useState({
    name: "",
    description: "",
    sector: "",
    targetSkills: "",
    durationWeeks: "",
    providerId: "",
  });
  const [programCreating, setProgramCreating] = useState(false);
  const [programCreateMessage, setProgramCreateMessage] = useState("");
  const [programCreateError, setProgramCreateError] = useState("");

  const [skillGap, setSkillGap] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aggregateSkillInsights, setAggregateSkillInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aggregateAiLoading, setAggregateAiLoading] = useState(false);
  const [outcomeAnalyticsLoading, setOutcomeAnalyticsLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");
  const [aggregateAiError, setAggregateAiError] = useState("");
  const [outcomeAnalyticsError, setOutcomeAnalyticsError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          programsResponse,
          providersResponse,
          batchesResponse,
          traineesResponse,
          certificationsResponse,
          employmentsResponse,
        ] = await Promise.all([
          api.get("/programs"),
          api.get("/providers"),
          api.get("/batches"),
          api.get("/trainees"),
          api.get("/certifications"),
          api.get("/employments"),
        ]);

        setPrograms(programsResponse.data.programs || []);
        setProviders(providersResponse.data.providers || []);
        setBatches(batchesResponse.data.batches || []);
        setTrainees(traineesResponse.data.trainees || []);
        setCertifications(
          certificationsResponse.data.certifications || []
        );
        setEmployments(
          employmentsResponse.data.employments || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load Government data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleProgramFormChange = (event) => {
    const { name, value } = event.target;
    setProgramForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const createGovernmentProgram = async (event) => {
    event.preventDefault();
    setProgramCreateMessage("");
    setProgramCreateError("");

    if (!programForm.name.trim() || !programForm.sector.trim() || !programForm.providerId) {
      setProgramCreateError("Program name, sector and provider are required.");
      return;
    }

    setProgramCreating(true);

    try {
      const targetSkills = programForm.targetSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await api.post("/programs", {
        name: programForm.name.trim(),
        description: programForm.description.trim(),
        sector: programForm.sector.trim(),
        targetSkills,
        durationWeeks: programForm.durationWeeks
          ? Number(programForm.durationWeeks)
          : undefined,
        providerId: programForm.providerId,
      });

      const createdProgram = response.data?.program;

      if (createdProgram) {
        setPrograms((current) => [createdProgram, ...current]);
      } else {
        const programsResponse = await api.get("/programs");
        setPrograms(programsResponse.data.programs || []);
      }

      setProgramForm({
        name: "",
        description: "",
        sector: "",
        targetSkills: "",
        durationWeeks: "",
        providerId: "",
      });
      setProgramCreateMessage("Program created successfully. It is saved as DRAFT and can now be used for batch setup.");
    } catch (err) {
      setProgramCreateError(
        err.response?.data?.message ||
          "Failed to create program."
      );
    } finally {
      setProgramCreating(false);
    }
  };

  const analyzeSkillGap = async (traineeId, shouldScroll = false) => {
    setError("");
    setSkillGap(null);
    setAnalyzing(true);

    try {
      const response = await api.get(
        `/ai/trainees/${traineeId}/skill-gap`
      );

      setSkillGap(response.data);

      if (shouldScroll) {
        requestAnimationFrame(() => {
          document
            .getElementById("ai-skill-gap")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to analyze skill gap."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const loadAIInsights = async (shouldScroll = false) => {
    setAiError("");
    setAiInsights(null);
    setAiLoading(true);

    try {
      const response = await api.get(
        "/government/ai-insights"
      );

      const data = response.data || {};
      const overview = data.overview || {};

      const normalizedTrainees = (data.trainees || []).map(
        (item) => ({
          ...item,
          retentionRisk: item.retentionRisk
            ? {
                ...item.retentionRisk,
                risk:
                  item.retentionRisk.risk ??
                  item.retentionRisk.risk_level,
                score:
                  item.retentionRisk.score ??
                  item.retentionRisk.risk_score,
              }
            : null,
          employmentRisk: item.employmentRisk
            ? {
                ...item.employmentRisk,
                risk:
                  item.employmentRisk.risk ??
                  item.employmentRisk.risk_level,
                score:
                  item.employmentRisk.score ??
                  item.employmentRisk.risk_score,
              }
            : null,
        })
      );

      setAiInsights({
        ...data,
        overview: {
          ...overview,
          programs:
            overview.programs ??
            overview.totalPrograms ??
            0,
          batches:
            overview.batches ??
            overview.totalBatches ??
            0,
          trainees:
            overview.trainees ??
            overview.totalTrainees ??
            0,
          certified:
            overview.certified ??
            overview.certifiedTrainees ??
            0,
          employed:
            overview.employed ??
            overview.employedTrainees ??
            0,
          certificationRate:
            overview.certificationRate ?? 0,
          employmentRate:
            overview.employmentRate ?? 0,
        },
        trainees: normalizedTrainees,
      });

      if (shouldScroll) {
        requestAnimationFrame(() => {
          document
            .getElementById("ai-insights")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        });
      }
    } catch (err) {
      setAiError(
        err.response?.data?.message ||
          "Failed to load Government AI insights."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const loadAggregateSkillInsights = async () => {
    setAggregateAiError("");
    setAggregateAiLoading(true);

    try {
      const response = await api.get(
        "/ai/aggregate/skill-gaps"
      );

      setAggregateSkillInsights(
        response.data || null
      );
    } catch (err) {
      setAggregateAiError(
        err.response?.data?.message ||
          "Failed to load aggregate AI skill-gap insights."
      );
    } finally {
      setAggregateAiLoading(false);
    }
  };

  const loadOutcomeAnalytics = async () => {
    setOutcomeAnalyticsError("");
    setOutcomeAnalyticsLoading(true);

    try {
      const response = await api.get("/government/outcome-analytics");
      setOutcomeAnalytics(response.data || null);
    } catch (err) {
      setOutcomeAnalyticsError(
        err.response?.data?.message ||
          "Failed to load Government outcome analytics."
      );
    } finally {
      setOutcomeAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && programs.length > 0) {
      loadAIInsights(false);
      loadAggregateSkillInsights();
      loadOutcomeAnalytics();
      if (trainees.length > 0 && !skillGap) {
        analyzeSkillGap(trainees[0]._id, false);
      }
    }
  }, [loading, programs.length]);

  const dashboardMetrics = useMemo(() => {
    const certifiedCount = trainees.filter(
      (trainee) => trainee.status === "CERTIFIED"
    ).length;

    const employedCount = trainees.filter((trainee) =>
      employments.some(
        (employment) =>
          String(employment.traineeId) ===
            String(trainee._id) &&
          employment.status === "EMPLOYED"
      )
    ).length;

    const activePrograms = programs.filter(
      (program) => program.status === "ACTIVE"
    ).length;

    const activeBatches = batches.filter(
      (batch) => batch.status === "ACTIVE"
    ).length;

    const averageAttendance =
      trainees.length > 0
        ? trainees.reduce(
            (sum, trainee) =>
              sum +
              Number(
                trainee.attendancePercentage || 0
              ),
            0
          ) / trainees.length
        : 0;

    return {
      certifiedCount,
      employedCount,
      activePrograms,
      activeBatches,
      averageAttendance,
    };
  }, [programs, batches, trainees, employments]);

  const outcomeMetrics = useMemo(() => {
    const outcomeTraineeIds = new Set(
      employments
        .filter((employment) => employment.traineeId)
        .map((employment) =>
          String(
            employment.traineeId?._id ||
              employment.traineeId
          )
        )
    );

    const employed = employments.filter(
      (employment) => employment.status === "EMPLOYED"
    ).length;

    const seeking = employments.filter(
      (employment) => employment.status === "SEEKING"
    ).length;

    const unemployed = employments.filter(
      (employment) => employment.status === "UNEMPLOYED"
    ).length;

    const unknown = employments.filter(
      (employment) => employment.status === "UNKNOWN"
    ).length;

    const outcomeCoverage =
      trainees.length > 0
        ? Math.round(
            (outcomeTraineeIds.size / trainees.length) * 100
          )
        : 0;

    return {
      employed,
      seeking,
      unemployed,
      unknown,
      outcomeCoverage,
      outcomeTrainees: outcomeTraineeIds.size,
    };
  }, [employments, trainees]);

  const getTraineeProgram = (trainee) => {
    const getReferenceId = (value) => {
      if (!value) {
        return null;
      }

      if (typeof value === "object") {
        return value._id ? String(value._id) : null;
      }

      return String(value);
    };

    const traineeBatchId = getReferenceId(trainee.batchId);

    const batch = batches.find(
      (item) =>
        getReferenceId(item._id) === traineeBatchId
    );

    if (!batch) {
      return "Program unavailable";
    }

    const programId = getReferenceId(batch.programId);

    const program = programs.find(
      (item) =>
        getReferenceId(item._id) === programId
    );

    return program?.name || "Program unavailable";
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(
      (item) =>
        String(item._id) ===
        String(providerId)
    );

    return provider?.name || "Provider";
  };

  const [demoLoading, setDemoLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState("");
  const [demoError, setDemoError] = useState("");

  const loadDemoFlow = async () => {
    if (demoLoading) return;

    setDemoLoading(true);
    setDemoMessage("");
    setDemoError("");

    try {
      const response = await api.post("/demo/reset-and-load");
      setDemoMessage(
        response.data?.message ||
          "Demo data loaded successfully. All dashboards are ready."
      );
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      setDemoError(
        err.response?.data?.message ||
          "Failed to load the demo scenario."
      );
    } finally {
      setDemoLoading(false);
    }
  };

  if (loading) {
    return (
      <WorkspaceLayout role="GOVERNMENT">
        <div className="government-loading">
          <div className="loading-spinner" />
          <p>Loading Government workspace...</p>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout role="GOVERNMENT">
      <main className="government-page">
        {/* HEADER */}
        <GovernmentHeader
          demoLoading={demoLoading}
          onLoadDemo={loadDemoFlow}
          demoMessage={demoMessage}
          demoError={demoError}
          aiLoading={aiLoading}
          onLoadAIInsights={loadAIInsights}
          error={error}
        />

        {/* METRICS */}
        <GovernmentMetrics
          programsCount={programs.length}
          activePrograms={dashboardMetrics.activePrograms}
          providersCount={providers.length}
          traineesCount={trainees.length}
          averageAttendance={dashboardMetrics.averageAttendance}
          employedCount={dashboardMetrics.employedCount}
          certifiedCount={dashboardMetrics.certifiedCount}
        />

        {/* TIER 2: DELIVERY OPERATIONS */}
        <ProgramOverviewCard
          programs={programs}
          getProviderName={getProviderName}
        />

        <ProgramDeliverySnapshots
          programs={programs}
          batches={batches}
          providers={providers}
          activeBatchesCount={dashboardMetrics.activeBatches}
        />

        <ProviderPerformanceSection
          outcomeAnalytics={outcomeAnalytics}
        />

        <CreateProgramCard
          providers={providers}
          programForm={programForm}
          onProgramFormChange={handleProgramFormChange}
          onCreateProgram={createGovernmentProgram}
          programCreating={programCreating}
          programCreateMessage={programCreateMessage}
          programCreateError={programCreateError}
        />

        {/* TIER 3: LEARNER MONITORING */}
        <TraineeMonitoringCard
          trainees={trainees}
          getTraineeProgram={getTraineeProgram}
          analyzing={analyzing}
          onAnalyzeSkillGap={analyzeSkillGap}
        />

        <AISkillGapAnalysisCard
          skillGap={skillGap}
          analyzing={analyzing}
        />

        {/* TIER 4: OUTCOMES & PLACEMENT */}
        <ProgramOutcomesCard
          certifications={certifications}
          employments={employments}
          trainees={trainees}
          outcomeMetrics={outcomeMetrics}
          traineesCount={trainees.length}
        />

        <OutcomeAnalyticsSection
          outcomeAnalytics={outcomeAnalytics}
          loading={outcomeAnalyticsLoading}
          error={outcomeAnalyticsError}
          onLoadAnalytics={loadOutcomeAnalytics}
        />

        {/* TIER 5: AI DECISION SUPPORT */}
        <GovernmentAIInsightsSection
          aiInsights={aiInsights}
          loading={aiLoading}
          error={aiError}
          onLoadAIInsights={loadAIInsights}
        />

        <AggregateSkillInsightsSection
          aggregateSkillInsights={aggregateSkillInsights}
          loading={aggregateAiLoading}
          error={aggregateAiError}
          onLoadAggregateInsights={loadAggregateSkillInsights}
        />

        {/* FOOTER */}
        <footer className="government-footer">
          <div>
            <strong>
              KaushalMetric Tracker Government Workspace
            </strong>

            <span>
              Evidence-based training monitoring and AI-assisted
              decision support.
            </span>
          </div>

          <span>
            Data powered by KaushalMetric Tracker services
          </span>
        </footer>
      </main>
    </WorkspaceLayout>
  );
}

export default Government;