import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [donations, setDonations] = useState([])
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/donations'),
      api.get('/ngos'),
    ]).then(([dRes, nRes]) => {
      setDonations(dRes.data)
      setNgos(nRes.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusCounts = donations.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1
    return acc
  }, {})

  const pendingNgos = ngos.filter(n => !n.verified).length

  if (loading) {
    return (
      <div className="main-content loading-overlay">
        <div className="spinner" />
        <span>Loading admin data...</span>
      </div>
    )
  }

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>Admin Dashboard ⚙️</h1>
        <p>Platform overview and management controls</p>
      </div>

      {/* Overview Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
          <div className="stat-icon">📦</div>
          <div className="stat-value">{donations.length}</div>
          <div className="stat-label">Total Donations</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--color-primary)' }}>
          <div className="stat-icon">🤝</div>
          <div className="stat-value">{statusCounts['DISTRIBUTED'] || 0}</div>
          <div className="stat-label">Meals Distributed</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{ngos.length}</div>
          <div className="stat-label">Registered NGOs</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{pendingNgos}</div>
          <div className="stat-label">NGOs Pending Verification</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        <Link to="/admin/ngos" id="admin-ngos-link" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏢</div>
          <h3>NGO Management</h3>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>
            {pendingNgos > 0
              ? <span style={{ color: '#f59e0b' }}>⚠️ {pendingNgos} NGO(s) awaiting verification</span>
              : 'All NGOs are verified ✓'}
          </p>
        </Link>
        <Link to="/admin/donations" id="admin-donations-link" className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
          <h3>Donation Audit</h3>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>
            {statusCounts['AVAILABLE'] || 0} available, {statusCounts['MATCHED'] || 0} matched
          </p>
        </Link>
      </div>

      {/* Status breakdown */}
      <div>
        <div className="section-title">Donation Status Breakdown</div>
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / donations.length) * 100)
              const colorMap = {
                CREATED: '#6b7280', AVAILABLE: '#3b82f6', MATCHED: '#8b5cf6',
                ACCEPTED: '#f59e0b', PICKED_UP: '#06b6d4', DISTRIBUTED: '#7ed957',
                REJECTED: '#ef4444', CANCELLED: '#6b7280'
              }
              const color = colorMap[status] || '#6b7280'
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="text-sm fw-600" style={{ color }}>{status.replace('_', ' ')}</span>
                    <span className="text-sm text-muted">{count} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
