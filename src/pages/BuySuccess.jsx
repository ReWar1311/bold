import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const gramsFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 3,
})

export default function BuySuccess() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const amount = state?.amount ?? 0
  const grams = state?.grams ?? 0

  useEffect(() => {
    if (!state) navigate('/buy', { replace: true })
  }, [state, navigate])

  return (
    <div className="success-screen">
      <div className="success-card">
        <h1>Congratulations! You now own {gramsFormatter.format(grams)}g 24K gold</h1>
        <p>
          Your purchase of {currencyFormatter.format(amount)} ({gramsFormatter.format(grams)}g) has been added to your
          BOLD portfolio. 100% pure, insured, and securely stored.
        </p>
      </div>
      <button className="cta-btn" onClick={() => navigate('/')}>See portfolio</button>
    </div>
  )
}
