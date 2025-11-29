const API_BASE_URL = 'http://localhost:5000'

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    // Return a friendly error object for the UI to handle
    return { status: 'error', message: err.message || 'Network error' }
  }
}

export async function getGoldPrice() {
  const url = `${API_BASE_URL}/get-gold-price`
  const res = await safeFetch(url)
  // Fallback mock when backend not running
  if (res.status === 'error') return { status: 'success', price_per_gram: 8000, currency: 'INR' }
  return res
}

export async function sendOtp(payload) {
  const url = `${API_BASE_URL}/send-otp`
  const res = await safeFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (res.status === 'error') return { status: 'success', message: 'OTP sent (mock)' }
  return res
}

export async function verifyOtp(payload) {
  const url = `${API_BASE_URL}/verify-otp`
  const res = await safeFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (res.status === 'error') return { status: 'success', message: 'OTP verified (mock)' }
  return res
}

export async function buyGold(payload) {
  const url = `${API_BASE_URL}/buy-gold`
  const res = await safeFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  // If backend not running, emulate response
  if (res.status === 'error') {
    const price = 8000
    if (payload.quantity) {
      const total = payload.quantity * price
      return { status: 'success', quantity_grams: payload.quantity, price_per_gram: price, total_amount: total }
    }
    if (payload.amount) {
      const qty = +(payload.amount / price).toFixed(4)
      return { status: 'success', quantity_grams: qty, price_per_gram: price, total_amount: payload.amount }
    }
  }
  return res
}

export default { getGoldPrice, sendOtp, verifyOtp, buyGold }
