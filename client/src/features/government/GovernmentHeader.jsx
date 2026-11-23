export default function GovernmentHeader({
  demoLoading = false,
  onLoadDemo,
  demoMessage = "",
  demoError = "",
  aiLoading = false,
  onLoadAIInsights,
  error = "",
}) {
  return (
    <>
      <header className="page-header">
        <div>
          <div className="breadcrumb">
            Government
            <span>/</span>
            Dashboard
          </div>

          <h1>Government Dashboard</h1>

          <p>
            Monitor training delivery, learner outcomes and AI-driven
            intervention signals.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="demo-header-button"
            onClick={onLoadDemo}
            disabled={demoLoading}
          >
            <span>▶</span>
            {demoLoading ? "Loading Demo..." : "Load Demo Flow"}
          </button>

          <button
            type="button"
            className="ai-header-button"
            onClick={onLoadAIInsights}
            disabled={aiLoading}
          >
            <span className="ai-spark">✦</span>
            {aiLoading ? "Analyzing..." : "Generate AI Insights"}
          </button>
        </div>
      </header>

      {(demoMessage || demoError) && (
        <div
          className={`demo-flow-message ${demoError ? "error" : "success"}`}
        >
          <strong>
            {demoError ? "Demo setup failed" : "Demo flow loaded"}
          </strong>
          <span>{demoError || demoMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <div className="alert-icon">!</div>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}
    </>
  );
}
