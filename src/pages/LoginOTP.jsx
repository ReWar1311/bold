import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp } from '../api'

export default function LoginOTP() {
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(digitsOnly)
    if (status.type !== 'idle') setStatus({ type: 'idle', text: '' })
  }

  const canSubmit = phone.length === 10 && agreed && !loading

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setStatus({ type: 'idle', text: '' })
    const res = await sendOtp({ phone_number: phone })
    if (res.status === 'success') {
      setStatus({ type: 'success', text: res.message || 'OTP sent successfully' })
      setTimeout(() => {
        navigate('/login/verify', { state: { phone } })
      }, 300)
    } else {
      setStatus({ type: 'error', text: res.message || 'Something went wrong' })
    }
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src="/blue_logo.png" alt="Bold logo" className="brand-mark" />
        <h1 className="login-heading">Welcome to Bold!</h1>
        <p className="login-subtitle">Please enter your 10 digit phone number, we will send an OTP to verify</p>

        <form onSubmit={handleSubmit}>
          <div className="field-label">Phone number</div>
          <div className={`phone-field ${status.type === 'error' ? 'has-error' : ''}`}>
            <div className="dial-prefix">
              <img src="/flag-india.png" alt="India flag" />
              <span>+91</span>
            </div>
            <input
              type="tel"
              placeholder="9847365763"
              value={phone}
              onChange={handlePhoneChange}
              aria-label="Enter 10 digit phone number"
              inputMode="numeric"
            />
          </div>

          <label className="checkbox-control">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(prev => !prev)}
            />
            <span className="checkbox-box" aria-hidden="true"></span>
            <span>
              By continuing, you agree to our <a href="https://www.bluestone.com/terms" target="_blank" rel="noreferrer">Terms and Conditions.</a>
            </span>
          </label>

          <button className={`cta-btn ${loading ? 'loading' : ''}`} type="submit" disabled={!canSubmit}>
            {loading ? 'Sending OTP' : 'Verify phone number'}
          </button>
        </form>

        {status.text && (
          <div className={`auth-alert ${status.type}`}>
            {status.text}
          </div>
        )}

        <div className="login-footnote" aria-hidden="true"></div>
      </div>
    </div>
  )
}
