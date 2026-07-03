export default function ServiceSummary({ data }) {
  if (!data) return null

  const fields = [
    { label: 'Service', value: data.service },
    { label: 'Your Referrals', value: data.yourReferrals },
    { label: 'Active Referrals', value: data.activeReferrals },
    { label: 'Total Ref. Earnings', value: data.totalRefEarnings },
  ]

  return (
    <section
      className="card service-summary"
      aria-label="Service summary"
    >
      <h2 className="section-title">Service summary</h2>
      <div className="service-summary-grid">
        {fields.map((f) => (
          <div key={f.label} className="service-tile">
            <div className="service-tile-label">{f.label}</div>
            <div className="service-tile-value">{f.value ?? '—'}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
