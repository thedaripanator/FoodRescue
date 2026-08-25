import { useEffect, useState } from 'react'
import api from '../../api/axios'
import DonationCard from '../../components/DonationCard'

export default function AdminDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/admin/donations')
      .then(res => setDonations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STATUSES = ['ALL', 'CREATED', 'AVAILABLE', 'MATCHED', 'ACCEPTED', 'PICKED_UP', 'DISTRIBUTED', 'REJECTED']

  const filtered = donations
    .filter(d => filter === 'ALL' || d.status === filter)
    .filter(d => !search || d.foodType?.toLowerCase().includes(search.toLowerCase()) || d.id?.includes(search))

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>All Donations 📋</h1>
        <p>Complete audit trail of all food donations on the platform</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input
          id="admin-search-input"
          type="text"
          className="form-input"
          placeholder="🔍 Search by food type or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            id={`admin-filter-${s.toLowerCase()}-btn`}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL'
              ? `All (${donations.length})`
              : `${s.replace('_', ' ')} (${donations.filter(d => d.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Loading donations...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No donations found</h3>
          <p>Try a different filter or search term.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map(d => <DonationCard key={d.id} donation={d} />)}
        </div>
      )}
    </div>
  )
}
