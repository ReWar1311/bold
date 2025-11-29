import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyOtp, sendOtp } from '../api'

const DIGIT_COUNT = 6

export default function VerifyOTP() {
  const location = useLocation()
  const navigate = useNavigate()
  const phone = location.state?.phone || ''
  const [digits, setDigits] = useState(Array(DIGIT_COUNT).fill(''))
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputsRef = useRef([])

  useEffect(() => {
    if (!phone) navigate('/login', { replace: true })
  }, [phone, navigate])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  function handleChange(index, value) {
    if (!/^[0-9]?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < DIGIT_COUNT - 1) inputsRef.current[index + 1]?.focus()
    if (status.type !== 'idle') setStatus({ type: 'idle', text: '' })
  }

  function handleKeyDown(index, evt) {
    if (evt.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const otp = digits.join('')
  const canVerify = otp.length === DIGIT_COUNT && !loading

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canVerify) return
    setLoading(true)
    const res = await verifyOtp({ phone_number: phone, otp })
    if (res.status === 'success') {
      setStatus({ type: 'success', text: res.message || 'OTP verified successfully' })
      setTimeout(() => navigate('/buy', { replace: true }), 400)
    } else {
      setStatus({ type: 'error', text: res.message || 'Invalid OTP' })
    }
    setLoading(false)
  }

  async function handleResend() {
    if (resending) return
    setResending(true)
    const res = await sendOtp({ phone_number: phone })
    setStatus({
      type: res.status === 'success' ? 'success' : 'error',
      text: res.message || (res.status === 'success' ? 'OTP resent' : 'Unable to resend OTP'),
    })
    setResending(false)
  }

  function editPhone() {
    navigate('/login', { replace: false, state: { phone } })
  }

  return (
    <div className="verify-screen">
      <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="login-card">
        <img src="/blue_logo.png" alt="Bold logo" className="brand-mark" />
        <h1 className="login-heading">Verify your number</h1>
        <p className="login-subtitle">
          We have sent a 6-digit OTP to your number +91 {phone.slice(0, 2)}XXXX{phone.slice(-4)}
        </p>

        <button className="edit-phone" type="button" onClick={editPhone}>Edit Phone number</button>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputsRef.current[idx] = el)}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                inputMode="numeric"
                maxLength={1}
                className={`otp-box ${status.type === 'error' ? 'has-error' : ''}`}
              />
            ))}
          </div>

          <div className="resend-row">
            <span>Didn't receive code?</span>
            <button type="button" className="resend-link" onClick={handleResend} disabled={resending}>
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          </div>

          <button className={`cta-btn ${loading ? 'loading' : ''}`} type="submit" disabled={!canVerify}>
            {loading ? 'Verifying…' : 'Verify phone number'}
          </button>
        </form>

        {status.text && (
          <div className={`auth-alert ${status.type}`}>
            {status.text}
          </div>
        )}
      </div>
    </div>
  )
}
