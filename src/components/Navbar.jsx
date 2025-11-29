import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">BlueStone</Link>
        <div className="nav-links">
          <Link to="/buy">Buy</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  )
}
