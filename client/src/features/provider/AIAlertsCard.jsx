export default function AIAlertsCard({ alerts = [] }) {
  return (
    <article className="provider-card">
      <div className="provider-card-header">
        <div>
          <h2>AI Alerts</h2>
          <p>Signals generated from your real trainee records.</p>
        </div>
        <span className="provider-count">{alerts.length}</span>
      </div>
      <div className="provider-alert-list">
        {alerts.length ? (
          alerts.map((alert) => (
            <div
              className="provider-alert"
              key={`${alert.trainee?._id || alert.trainee?.id || Math.random()}-${alert.title}`}
            >
              <span className={`provider-alert-dot ${alert.type}`} />
              <div className="provider-alert-main">
                <strong>{alert.title}</strong>
                <span>
                  {alert.trainee?.name} · {alert.detail}
                </span>
              </div>
              <button type="button" onClick={alert.action}>
                {alert.actionLabel}
              </button>
            </div>
          ))
        ) : (
          <div className="empty-provider">
            No immediate alerts from the available records.
          </div>
        )}
      </div>
    </article>
  );
}
