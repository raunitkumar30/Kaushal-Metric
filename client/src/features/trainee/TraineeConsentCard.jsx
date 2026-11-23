import React from "react";

export function TraineeConsentCard({
  consent,
  consentSaving,
  consentMessage,
  onGiveConsent,
  formatDate,
}) {
  return (
    <section className="trainee-card consent-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">DATA CONSENT</span>
          <h2>Your Data Consent</h2>
        </div>
        <span
          className={`consent-status ${consent?.given ? "given" : "pending"}`}
        >
          {consent?.given ? "Consent given" : "Consent required"}
        </span>
      </div>

      <div className="consent-content">
        <div>
          <p>
            KaushalMetric Tracker uses your training, assessment, certification and
            employment outcome data to maintain your Outcome Passport and
            provide program analytics and AI-supported guidance.
          </p>
          <small>
            Consent version {consent?.version || "1.0"}
          </small>
          {consent?.givenAt && (
            <small>
              Given on {formatDate ? formatDate(consent.givenAt) : consent.givenAt}
            </small>
          )}
        </div>

        {!consent?.given && (
          <button
            type="button"
            className="primary-button consent-button"
            onClick={onGiveConsent}
            disabled={consentSaving}
          >
            {consentSaving ? "Saving..." : "Give Consent"}
          </button>
        )}
      </div>

      {consentMessage && (
        <div className="consent-message">
          <span>✓</span>
          <p>{consentMessage}</p>
        </div>
      )}
    </section>
  );
}

export default TraineeConsentCard;
