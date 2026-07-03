import { Link, NavLink, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-brand"
          aria-label="Go to dashboard home"
        >
          Go Business
        </Link>
        <nav aria-label="Primary">
          <ul className="navbar-nav">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="navbar-actions">
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
