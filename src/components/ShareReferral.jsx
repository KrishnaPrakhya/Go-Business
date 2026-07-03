import { useState } from 'react'
import { copyToClipboard } from '../lib/clipboard.js'

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  async function handleCopy() {
    try {
      await copyToClipboard(value ?? '')
      setCopied(true)
      setFeedbackMsg('Copied!')
      setTimeout(() => {
        setCopied(false)
        setFeedbackMsg('')
      }, 2000)
    } catch (_) {
      setFeedbackMsg('Failed to copy')
      setTimeout(() => setFeedbackMsg(''), 2000)
    }
  }

  return (
    <div className="share-field">
      <span className="share-field-label">{label}</span>
      <div className="share-field-row">
        <input
          type="text"
          readOnly
          value={value ?? ''}
          className="share-input"
          aria-label={label}
        />
        <button
          type="button"
          className={`btn-copy${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          Copy
        </button>
      </div>
      <div
        className="copy-feedback"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedbackMsg}
      </div>
    </div>
  )
}

export default function ShareReferral({ data }) {
  if (!data) return null

  return (
    <section
      className="card share-referral"
      aria-label="Share referral"
    >
      <h2 className="share-referral-title">Refer friends and earn more</h2>
      <div className="share-field-group">
        <CopyField label="Your Referral Link" value={data.link} />
        <CopyField label="Your Referral Code" value={data.code} />
      </div>
    </section>
  )
}
