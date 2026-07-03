import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import OverviewMetrics from '../components/OverviewMetrics.jsx'
import ServiceSummary from '../components/ServiceSummary.jsx'
import ShareReferral from '../components/ShareReferral.jsx'
import ReferralsTable from '../components/ReferralsTable.jsx'
import { fetchReferrals } from '../lib/api.js'

export default function DashboardPage() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchReferrals({ sort: 'desc' })
      .then((data) => {
        if (cancelled) return
        setOverview(data)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message ?? 'Failed to load dashboard data')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <Navbar />
      <main className="page-body">
        <header className="page-heading">
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading dashboard…</span>
          </div>
        )}

        {!loading && error && (
          <div className="error-alert" role="alert">
            <span className="error-alert-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && overview && (
          <div className="dashboard-grid">
            <OverviewMetrics metrics={overview.metrics} />
            <ServiceSummary data={overview.serviceSummary} />
            <ShareReferral data={overview.referral} />
            <ReferralsTable />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
