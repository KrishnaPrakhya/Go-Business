import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebouncedValue, useReferralFeed } from '../lib/hooks.js'
import { setCachedRow } from '../lib/api.js'
import { formatDate, formatProfit } from '../lib/format.js'

const PAGE_SIZE = 10

export default function ReferralsTable({ initialReferrals = [] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const debouncedSearch = useDebouncedValue(search, 300)
  const isFiltered = debouncedSearch !== '' || sort !== 'desc'
  const { data, loading, error } = useReferralFeed(
    isFiltered ? debouncedSearch : null,
    isFiltered ? sort : null,
  )

  const referrals = isFiltered ? (data?.referrals ?? []) : initialReferrals
  const tableLoading = isFiltered ? loading : false
  const tableError = isFiltered ? error : null

  const totalPages = Math.max(1, Math.ceil(referrals.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const from = referrals.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, referrals.length)
  const slice = referrals.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearchChange(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleSortChange(e) {
    setSort(e.target.value)
    setPage(1)
  }

  function goToRow(row) {
    setCachedRow(row)
    navigate(`/referral/${row.id}`)
  }

  function goToPage(p) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  function handleRowKey(e, row) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToRow(row)
    }
  }

  return (
    <section className="card referrals-table-section">
      <h2 className="section-title">All referrals</h2>
      <div className="table-controls">
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Name or service…"
            value={search}
            onChange={handleSearchChange}
            aria-label="Search referrals"
          />
        </div>
        <label className="sort-label">
          Sort by date
          <select
            className="sort-select"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </label>
      </div>

      {tableLoading && (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading referrals…</span>
        </div>
      )}

      {!tableLoading && tableError && (
        <div className="error-alert" role="alert">
          <span className="error-alert-icon">⚠</span>
          <span>{tableError}</span>
        </div>
      )}

      {!tableLoading && !tableError && (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {slice.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="table-empty">
                      No matching entries
                    </td>
                  </tr>
                ) : (
                  slice.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => goToRow(row)}
                      onKeyDown={(e) => handleRowKey(e, row)}
                      tabIndex={0}
                      role="row"
                    >
                      <td className="td-name">{row.name}</td>
                      <td className="td-service">{row.serviceName}</td>
                      <td className="td-date">{formatDate(row.date)}</td>
                      <td className="td-profit">{formatProfit(row.profit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {referrals.length > 0 && (
            <div className="pagination">
              <span className="pagination-info">
                {`Showing ${from}\u2013${to} of ${referrals.length} entries`}
              </span>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="page-btn page-prev-next"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                >
                  Previous
                </button>
                {totalPages > 1 &&
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`page-btn${p === safePage ? ' active' : ''}`}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  type="button"
                  className="page-btn page-prev-next"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
