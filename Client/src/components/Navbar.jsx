import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleLinks = {
  DONOR: [
    { to: '/donor', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/donor/donate', label: 'Donate Food', icon: '🍱' },
    { to: '/donor/donations', label: 'My Donations', icon: '📋' },
    { to: '/ngo/register', label: 'Register as NGO', icon: '🏢' },
  ],
  NGO: [
    { to: '/ngo', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/ngo/register', label: 'NGO Profile', icon: '🏢' },
    { to: '/ngo/incoming', label: 'Incoming Donations', icon: '📦' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/admin/donations', label: 'All Donations', icon: '📋' },
    { to: '/admin/ngos', label: 'NGO Management', icon: '🏢' },
  ],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = user ? (roleLinks[user.role] || []) : []

  const roleBadgeClass = {
    DONOR: 'badge-role-donor',
    NGO: 'badge-role-ngo',
    ADMIN: 'badge-role-admin',
  }[user?.role] || ''

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">🌿</span>
        Food<span>Rescue</span>
      </div>

      {user && (
        <div className="navbar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <div className="navbar-user">
        {user && (
          <>
            <span className={`badge ${roleBadgeClass}`}>{user.role}</span>
            <span className="text-sm text-muted truncate" style={{ maxWidth: '140px' }}>
              {user.name}
            </span>
            <button
              id="logout-btn"
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
