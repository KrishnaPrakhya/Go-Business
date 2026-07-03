import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { fetchReferralById, getCachedRow } from '../lib/api.js'
import { formatDate, formatProfit } from '../lib/format.js'

export default function ReferralDetailPage() {
  const { id } = useParams()
  const cached = getCachedRow(id)

  const [row, setRow] = useState(cached)
  const [loading, setLoading] = useState(!cached)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setNotFound(false)
    if (!cached) {
      setLoading(true)
      setRow(null)
    }
    fetchReferralById(id)
      .then((data) => {
        if (cancelled) return
        if (data) {
          setRow(data)
        } else {
          if (!cached) setNotFound(true)
        }
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        if (!cached) setNotFound(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="detail-screen">
      <Navbar />
      <main className="detail-body">
        <Link to="/" className="detail-back">
          ← Back to dashboard
        </Link>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading referral…</span>
          </div>
        )}

        {!loading && notFound && (
          <div className="card detail-card">
            <div className="detail-not-found">
              <h2>Referral not found</h2>
              <p>The referral you are looking for does not exist or has been removed.</p>
              <Link to="/" className="back-link">
                ← Back to dashboard
              </Link>
            </div>
          </div>
        )}

        {row && (
          <div className="card detail-card">
            <h1 className="detail-heading">Referral Details</h1>
            <h2 className="detail-partner">{row.name}</h2>
            <dl className="detail-dl">
              <div className="detail-row">
                <dt className="detail-dt">Referral ID</dt>
                <dd className="detail-dd">{row.id}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-dt">Service Name</dt>
                <dd className="detail-dd">{row.serviceName}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-dt">Date</dt>
                <dd className="detail-dd">{formatDate(row.date)}</dd>
              </div>
              <div className="detail-row">
                <dt className="detail-dt">Profit</dt>
                <dd className="detail-dd">{formatProfit(row.profit)}</dd>
              </div>
            </dl>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
