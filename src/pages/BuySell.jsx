import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buyGold, getGoldPrice } from '../api'

const tabs = [
  { id: 'amount', label: 'Amount (₹)' },
  { id: 'weight', label: 'Weight (grams)' },
]

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const gramsFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 4,
})

export default function BuySell() {
  const [mode, setMode] = useState('amount')
  const [inputValue, setInputValue] = useState('')
  const [price, setPrice] = useState({ price_per_gram: 8000, currency: 'INR' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getGoldPrice().then(res => {
      if (res.status === 'success') setPrice(res)
    })
  }, [])

  const numericInput = parseFloat(inputValue) || 0
  const { amount, grams } = useMemo(() => {
    if (mode === 'amount') {
      return {
        amount: numericInput,
        grams: numericInput > 0 ? numericInput / price.price_per_gram : 0,
      }
    }
    return {
      amount: numericInput > 0 ? numericInput * price.price_per_gram : 0,
      grams: numericInput,
    }
  }, [mode, numericInput, price.price_per_gram])

  const canSubmit = numericInput > 0 && !loading

  function handleTabChange(id) {
    setMode(id)
    setInputValue('')
    setError('')
  }

  function handleInputChange(e) {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    const sanitized = value.split('.').slice(0, 2).join('.')
    setInputValue(sanitized)
    if (error) setError('')
  }

  async function handleBuy(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    const payload = mode === 'amount' ? { amount: numericInput } : { quantity: numericInput }
    const res = await buyGold(payload)
    setLoading(false)
    if (res.status === 'success') {
      navigate('/buy/success', { state: { amount: res.total_amount, grams: res.quantity_grams } })
    } else {
      setError(res.message || 'Unable to complete purchase')
    }
  }

  return (
    <div className="buy-screen">
      <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>
      <div className="buy-header-icon">
        <img src="/buy_gold_icon.png" alt="Buy gold" />
      </div>
      <h1 className="buy-title">Buy gold</h1>
      <p className="buy-subtitle">Select amount or value to proceed</p>

      <div className="flow-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${mode === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleBuy}>
        <label className="field-label" htmlFor="buy-input">
          {mode === 'amount' ? 'Amount' : 'Gold value'}
        </label>
        <div className={`flow-input ${error ? 'has-error' : ''}`}>
          {mode === 'amount' ? <span className="input-prefix">₹</span> : null}
          <input
            id="buy-input"
            inputMode="decimal"
            placeholder={mode === 'amount' ? '2,000' : '0.125'}
            value={inputValue}
            onChange={handleInputChange}
          />
          {mode === 'weight' ? <span className="input-suffix">grams</span> : null}
        </div>

        <div className="summary-card">
          <div>
            <span>Amount</span>
            <strong>{currencyFormatter.format(amount || 0)}</strong>
          </div>
          <div>
            <span>Gold value</span>
            <strong>{gramsFormatter.format(grams || 0)} grams</strong>
          </div>
          <div>
            <span>Current gold rate</span>
            <strong>{currencyFormatter.format(price.price_per_gram)}/gram</strong>
          </div>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        <button className={`cta-btn full-width ${loading ? 'loading' : ''}`} type="submit" disabled={!canSubmit}>
          {loading ? 'Processing…' : 'Buy gold'}
        </button>
      </form>
    </div>
  )
}
