export default function OverviewMetrics({ metrics }) {
  return (
    <section
      className="card overview-metrics"
      role="region"
      aria-label="Overview metrics"
    >
      <h2 className="section-title">Overview</h2>
      <div className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.id ?? m.label} className="metric-tile">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
