import Cookies from 'js-cookie'

const BASE = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com'
const REFERRALS_URL = `${BASE}/api/referrals`
const SIGNIN_URL = `${BASE}/api/auth/signin`

const inflight = new Map()

let rowCache = null

export function setCachedRow(row) {
  rowCache = row
}

export function getCachedRow(id) {
  return rowCache && String(rowCache.id) === String(id) ? rowCache : null
}

async function getJson(url, token) {
  if (inflight.has(url)) {
    return inflight.get(url)
  }
  const promise = fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      inflight.delete(url)
      if (!res.ok) {
        let msg = `Request failed`
        try {
          const body = await res.json()
          if (body && body.message) msg = body.message
        } catch (_) {}
        const err = new Error(`${msg} (status ${res.status})`)
        err.status = res.status
        throw err
      }
      return res.json()
    })
    .catch((err) => {
      inflight.delete(url)
      throw err
    })
  inflight.set(url, promise)
  return promise
}

function readReferralsPayload(json) {
  const data = json.data
  if (data && Array.isArray(data.referrals)) {
    return {
      metrics: data.metrics ?? [],
      serviceSummary: data.serviceSummary ?? null,
      referral: data.referral ?? null,
      referrals: data.referrals,
      singleRow: null,
    }
  }
  return {
    metrics: [],
    serviceSummary: null,
    referral: null,
    referrals: [],
    singleRow: data ?? null,
  }
}

export async function signIn(email, password) {
  const res = await fetch(SIGNIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message ?? 'Invalid email or password')
  }
  const token = json.data?.token
  if (!token) throw new Error('No token in response')
  return token
}

export async function fetchReferrals({ search = '', sort = 'desc' } = {}) {
  const token = Cookies.get('jwt_token')
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (sort) params.set('sort', sort)
  const qs = params.toString()
  const url = qs ? `${REFERRALS_URL}?${qs}` : REFERRALS_URL
  const json = await getJson(url, token)
  const { metrics, serviceSummary, referral, referrals } = readReferralsPayload(json)
  return { metrics, serviceSummary, referral, referrals }
}

export async function fetchReferralById(id) {
  const token = Cookies.get('jwt_token')
  const url = `${REFERRALS_URL}?id=${id}`
  const json = await getJson(url, token)
  const { referrals, singleRow } = readReferralsPayload(json)
  const fromList = referrals.find((r) => String(r.id) === String(id))
  if (fromList) return fromList
  if (singleRow && String(singleRow.id) === String(id)) return singleRow
  return null
}
