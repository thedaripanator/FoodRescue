import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import DonationCard from '../../components/DonationCard'

export default function NgoDashboard() {
  const { user } = useAuth()
  const [ngo, setNgo] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingAvail, setTogglingAvail] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/ngos/me').catch(() => null),
      api.get('/ngos/me/donations').catch(() => []),
    ]).then(([ngoRes, donRes]) => {
      setNgo(ngoRes?.data)
      setDonations(donRes?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const toggleAvailability = async () => {
    if (!ngo) return
    setTogglingAvail(true)
    try {
      const res = await api.put(`/ngos/me/availability?available=${!ngo.available}`)
      setNgo(res.data)
    } catch (err) {
      alert('Failed to update availability')
    } finally {
      setTogglingAvail(false)
    }
  }

  const pendingActions = donations.filter(d => ['MATCHED', 'ACCEPTED'].includes(d.status)).length
  const stats = {
    pending: pendingActions,
    accepted: donations.filter(d => d.status === 'ACCEPTED').length,
    pickedUp: donations.filter(d => d.status === 'PICKED_UP').length,
    distributed: donations.filter(d => d.status === 'DISTRIBUTED').length,
  }

  if (loading) {
    return (
      <div className="main-content loading-overlay">
        <div className="spinner" />
        <span>Loading your dashboard...</span>
      </div>
    )
  }

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>NGO Dashboard 🏢</h1>
        <p>Manage incoming food donations and help feed your community.</p>
      </div>

      {/* NGO Status Card */}
      {ngo ? (
        <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, rgba(126,217,87,0.06), rgba(74,222,128,0.03))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="ngo-avatar" style={{ width: 56, height: 56, fontSize: '1.75rem' }}>🏢</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3>{ngo.organizationName}</h3>
                <span className={`badge ${ngo.verified ? 'badge-verified' : 'badge-unverified'}`}>
                  {ngo.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-sm text-muted">{ngo.address}</p>
            </div>
            <button
              id="toggle-availability-btn"
              className={`btn ${ngo.available ? 'btn-danger' : 'btn-primary'}`}
              onClick={toggleAvailability}
              disabled={togglingAvail}
            >
              {togglingAvail
                ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                : ngo.available ? '🔴 Go Offline' : '🟢 Go Available'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 'var(--space-6)', textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--color-primary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏗️</div>
          <h3 style={{ marginBottom: 8 }}>You haven't registered your NGO yet</h3>
          <p className="text-muted" style={{ marginBottom: 16 }}>Complete your profile to start receiving food donations.</p>
          <Link to="/ngo/register" id="register-ngo-btn" className="btn btn-primary">Register NGO</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ '--stat-color': '#8b5cf6' }}>
          <div className="stat-icon">📥</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Needs Action</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#06b6d4' }}>
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{stats.pickedUp}</div>
          <div className="stat-label">Picked Up</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': 'var(--color-primary)' }}>
          <div className="stat-icon">🤝</div>
          <div className="stat-value">{stats.distributed}</div>
          <div className="stat-label">Distributed</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="section-title">
          Recent Donations
          <Link to="/ngo/incoming" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
            View all →
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No donations assigned yet</h3>
            <p>Once you're verified and available, donations will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {donations.slice(0, 3).map(d => <DonationCard key={d.id} donation={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}
