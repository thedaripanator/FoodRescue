import { useEffect, useState } from 'react'
import api from '../../api/axios'
import DonationCard from '../../components/DonationCard'

const ACTION_BUTTONS = {
  MATCHED:   [{ id: 'accept', label: '✅ Accept', cls: 'btn-primary', action: 'accept' }, { id: 'reject', label: '❌ Reject', cls: 'btn-danger', action: 'reject' }],
  ACCEPTED:  [{ id: 'pickup', label: '🚗 Mark Picked Up', cls: 'btn-primary', action: 'pickup' }],
  PICKED_UP: [{ id: 'dist', label: '🤝 Mark Distributed', cls: 'btn-primary', action: 'distributed' }],
}

export default function NgoIncoming() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState({})
  const [filter, setFilter] = useState('ALL')

  const fetchDonations = () => {
    setLoading(true)
    api.get('/ngos/me/donations')
      .then(res => setDonations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDonations() }, [])

  const handleAction = async (donationId, action) => {
    setActing(a => ({ ...a, [`${donationId}-${action}`]: true }))
    try {
      const res = await api.post(`/donations/${donationId}/${action}`)
      setDonations(ds => ds.map(d => d.id === donationId ? res.data : d))
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} donation`)
    } finally {
      setActing(a => ({ ...a, [`${donationId}-${action}`]: false }))
    }
  }

  const FILTERS = ['ALL', 'MATCHED', 'ACCEPTED', 'PICKED_UP', 'DISTRIBUTED', 'REJECTED']
  const filtered = filter === 'ALL' ? donations : donations.filter(d => d.status === filter)

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>Incoming Donations 📦</h1>
        <p>Accept, manage, and track donations assigned to your NGO</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {FILTERS.map(s => (
          <button
            key={s}
            id={`ngo-filter-${s.toLowerCase()}-btn`}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? `All (${donations.length})` : `${s.replace('_', ' ')} (${donations.filter(d => d.status === s).length})`}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={fetchDonations} style={{ marginLeft: 'auto' }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Loading donations...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No donations {filter !== 'ALL' ? `with status "${filter.replace('_',' ')}"` : 'assigned yet'}</h3>
          <p>Make sure your NGO is verified and available to receive donations.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map(d => {
            const btns = ACTION_BUTTONS[d.status] || []
            return (
              <DonationCard
                key={d.id}
                donation={d}
                actions={btns.length > 0 && btns.map(btn => (
                  <button
                    key={btn.action}
                    id={`${btn.id}-${d.id.slice(-6)}-btn`}
                    className={`btn ${btn.cls}`}
                    disabled={!!acting[`${d.id}-${btn.action}`]}
                    onClick={() => handleAction(d.id, btn.action)}
                  >
                    {acting[`${d.id}-${btn.action}`]
                      ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                      : btn.label}
                  </button>
                ))}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
