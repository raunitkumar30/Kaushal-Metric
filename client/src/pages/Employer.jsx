import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import {
  EmployerMetrics,
  CertificateVerificationCard,
  PlacementSnapshotCard,
  EmploymentVerificationWorkflow,
  RecentCertificatesTable,
  RecentEmploymentGrid,
} from "../features/employer";
import "../features/employer/Employer.css";

function Employer() {
  const [certifications, setCertifications] = useState([]);
  const [employments, setEmployments] = useState([]);
  const [verifications, setVerifications] = useState([]);

  const [selectedEmploymentId, setSelectedEmploymentId] = useState("");
  const [verificationNote, setVerificationNote] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationSaving, setVerificationSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          certificationsResponse,
          employmentsResponse,
          verificationsResponse,
        ] = await Promise.all([
          api.get("/certifications"),
          api.get("/employments"),
          api.get("/employer-verifications"),
        ]);

        setCertifications(certificationsResponse.data.certifications || []);
        setEmployments(employmentsResponse.data.employments || []);
        setVerifications(verificationsResponse.data.verifications || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load employer data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (value) => {
    if (!value) return "Not available";

    return new Date(value).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const createVerification = async () => {
    if (!selectedEmploymentId) {
      setError("Select an employment record to verify.");
      return;
    }

    const employment = employments.find(
      (item) => item._id === selectedEmploymentId
    );

    if (!employment) {
      setError("Selected employment record was not found.");
      return;
    }

    try {
      setVerificationSaving(true);
      setError("");
      setVerificationMessage("");

      const response = await api.post("/employer-verifications", {
        traineeId:
          employment.traineeId?._id ||
          employment.traineeId ||
          "",
        employmentId: employment._id,
        employerName: employment.employerName,
        notes: verificationNote,
      });

      setVerifications((current) => [
        response.data.verification,
        ...current,
      ]);
      setSelectedEmploymentId("");
      setVerificationNote("");
      setVerificationMessage("Verification request created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create verification request."
      );
    } finally {
      setVerificationSaving(false);
    }
  };

  const updateVerification = async (verificationId, status) => {
    try {
      setVerificationSaving(true);
      setError("");
      setVerificationMessage("");

      const response = await api.patch(
        `/employer-verifications/${verificationId}`,
        {
          status,
          verifiedBy: "Employer",
          notes: verificationNote,
        }
      );

      setVerifications((current) =>
        current.map((verification) =>
          verification._id === verificationId
            ? response.data.verification
            : verification
        )
      );

      setVerificationNote("");
      setVerificationMessage(
        status === "VERIFIED"
          ? "Employment verification completed."
          : "Employment verification rejected."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update verification."
      );
    } finally {
      setVerificationSaving(false);
    }
  };

  const validCertificates = certifications.filter(
    (certification) => certification.status === "VALID"
  ).length;

  const revokedCertificates = certifications.filter(
    (certification) => certification.status === "REVOKED"
  ).length;

  const verifiedEmployments = employments.filter(
    (employment) => employment.verified
  ).length;

  const employedRecords = employments.filter(
    (employment) => employment.status === "EMPLOYED"
  ).length;

  const seekingRecords = employments.filter(
    (employment) => employment.status === "SEEKING"
  ).length;

  const unemployedRecords = employments.filter(
    (employment) => employment.status === "UNEMPLOYED"
  ).length;

  const unknownRecords = employments.filter(
    (employment) => employment.status === "UNKNOWN"
  ).length;

  const verificationRate =
    certifications.length > 0
      ? Math.round((validCertificates / certifications.length) * 100)
      : 0;

  const recentCertifications = useMemo(
    () => certifications.slice(0, 6),
    [certifications]
  );

  const recentEmployments = useMemo(
    () => employments.slice(0, 6),
    [employments]
  );

  if (loading) {
    return (
      <WorkspaceLayout role="EMPLOYER">
        <div className="employer-loading">
          <div className="employer-spinner" />
          <p>Loading Employer workspace...</p>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout role="EMPLOYER">
      <main className="employer-page">
        {/* HEADER */}
        <header className="employer-header">
          <div>
            <div className="employer-breadcrumb">
              Workspace <span>/</span> Employer
            </div>
            <h1>Employer Dashboard</h1>
            <p>
              Verify training credentials and review employment outcomes.
            </p>
          </div>

          <div className="employer-header-badge">
            <span className="employer-header-icon">✓</span>
            <div>
              <strong>Employer workspace</strong>
              <span>Credential verification</span>
            </div>
          </div>
        </header>

        {/* ERROR ALERT */}
        {error && (
          <div className="employer-alert">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* 4 TOP KPIS */}
        <EmployerMetrics
          totalCertificates={certifications.length}
          validCertificates={validCertificates}
          verificationRate={verificationRate}
          totalEmployments={employments.length}
          employedRecords={employedRecords}
          verifiedEmployments={verifiedEmployments}
        />

        {/* VERIFICATION & OUTCOME SUMMARY */}
        <section className="employer-top-grid">
          <CertificateVerificationCard
            totalCertificates={certifications.length}
            validCertificates={validCertificates}
            revokedCertificates={revokedCertificates}
            verificationRate={verificationRate}
            certifications={certifications}
          />

          <PlacementSnapshotCard
            totalEmployments={employments.length}
            employedRecords={employedRecords}
            seekingRecords={seekingRecords}
            unknownRecords={unknownRecords}
            unemployedRecords={unemployedRecords}
            verifiedEmployments={verifiedEmployments}
          />
        </section>

        {/* EMPLOYMENT VERIFICATION ACTION WORKFLOW */}
        <EmploymentVerificationWorkflow
          employments={employments}
          verifications={verifications}
          selectedEmploymentId={selectedEmploymentId}
          onSelectEmploymentId={setSelectedEmploymentId}
          verificationNote={verificationNote}
          onChangeVerificationNote={setVerificationNote}
          verificationMessage={verificationMessage}
          verificationSaving={verificationSaving}
          onCreateVerification={createVerification}
          onUpdateVerification={updateVerification}
        />

        {/* RECENT CERTIFICATES TABLE */}
        <RecentCertificatesTable
          certifications={recentCertifications}
          totalCertificates={certifications.length}
          formatDate={formatDate}
        />

        {/* RECENT EMPLOYMENT GRID */}
        <RecentEmploymentGrid
          employments={recentEmployments}
          totalEmployments={employments.length}
          formatDate={formatDate}
        />

        {/* FOOTER */}
        <footer className="employer-footer">
          <span>KaushalMetric Tracker</span>
          <span>Trusted skills. Verified credentials. Better hiring.</span>
        </footer>
      </main>
    </WorkspaceLayout>
  );
}

export default Employer;