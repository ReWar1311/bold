import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import LoginOTP from './pages/LoginOTP.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import BuySell from './pages/BuySell.jsx'
import BuySuccess from './pages/BuySuccess.jsx'

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/login') || location.pathname.startsWith('/buy')

  return (
    <div className={`app-root ${hideNav ? 'auth-screen' : ''}`}>
      {!hideNav && <Navbar />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginOTP />} />
          <Route path="/login/verify" element={<VerifyOTP />} />
          <Route path="/buy" element={<BuySell />} />
          <Route path="/buy/success" element={<BuySuccess />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
