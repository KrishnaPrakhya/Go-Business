import { useState, useEffect, useRef } from 'react'
import { fetchReferrals } from './api.js'

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function useReferralFeed(search, sort) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchReferrals({ search, sort })
      .then((data) => {
        if (cancelRef.current) return
        setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (cancelRef.current) return
        setState({ data: null, loading: false, error: err.message ?? 'Failed to load referrals' })
      })
    return () => {
      cancelRef.current = true
    }
  }, [search, sort])

  return state
}
