export function formatDate(iso) {
  if (!iso) return ''
  return iso.replace(/-/g, '/')
}

export function formatProfit(value) {
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n)
}
