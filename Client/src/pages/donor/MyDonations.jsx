import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import DonationCard from '../../components/DonationCard'

export default function MyDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/donations')
      .then(res => setDonations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STATUSES = ['ALL', 'AVAILABLE', 'MATCHED', 'ACCEPTED', 'PICKED_UP', 'DISTRIBUTED', 'REJECTED']

  const filtered = filter === 'ALL'
    ? donations
    : donations.filter(d => d.status === filter)

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>My Donations 📋</h1>
          <p>All your food donation history</p>
        </div>
        <Link to="/donor/donate" id="new-donation-btn" className="btn btn-primary">
          + New Donation
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            id={`filter-${s.toLowerCase()}-btn`}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? `All (${donations.length})` : `${s.replace('_', ' ')} (${donations.filter(d => d.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No donations {filter !== 'ALL' ? `with status "${filter}"` : 'yet'}</h3>
          <p>Try a different filter or make a new donation.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map(d => <DonationCard key={d.id} donation={d} />)}
        </div>
      )}
    </div>
  )
}
