import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import DonationCard from '../../components/DonationCard'

export default function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/donations')
      .then((res) => setDonations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === 'AVAILABLE').length,
    matched: donations.filter(d => ['MATCHED','ACCEPTED'].includes(d.status)).length,
    distributed: donations.filter(d => d.status === 'DISTRIBUTED').length,
  }

  return (
    <div className="main-content animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Track your donations and make a difference — one meal at a time.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Donations</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
          <div className="stat-icon">📢</div>
          <div className="stat-value">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#8b5cf6' }}>
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.matched}</div>
          <div className="stat-label">Matched / Accepted</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--color-primary)' }}>
          <div className="stat-icon">🤝</div>
          <div className="stat-value">{stats.distributed}</div>
          <div className="stat-label">Distributed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 'var(--space-8)', background: 'linear-gradient(135deg, rgba(126,217,87,0.08), rgba(74,222,128,0.04))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ marginBottom: 4 }}>Ready to donate?</h3>
            <p className="text-sm text-muted">Upload a food photo and let AI do the heavy lifting</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/donor/donate" id="donate-ai-btn" className="btn btn-primary">
              🤖 AI-Assisted Donation
            </Link>
            <Link to="/donor/donate?tab=manual" id="donate-manual-btn" className="btn btn-secondary">
              ✏️ Manual Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <div className="section-title">
          Recent Donations
          <Link to="/donor/donations" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Loading donations...</span>
          </div>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍱</div>
            <h3>No donations yet</h3>
            <p>Your first donation could feed someone today.</p>
            <Link to="/donor/donate" className="btn btn-primary mt-4">Make Your First Donation</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {donations.slice(0, 5).map((d) => (
              <DonationCard key={d.id} donation={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
