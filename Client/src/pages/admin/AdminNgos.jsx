import { useEffect, useState } from 'react'
import api from '../../api/axios'
import NgoCard from '../../components/NgoCard'

export default function AdminNgos() {
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState({})
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/ngos')
      .then(res => setNgos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleVerify = async (ngoId) => {
    setVerifying(v => ({ ...v, [ngoId]: true }))
    try {
      const res = await api.put(`/ngos/${ngoId}/verify`)
      setNgos(ns => ns.map(n => n.id === ngoId ? res.data : n))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify NGO')
    } finally {
      setVerifying(v => ({ ...v, [ngoId]: false }))
    }
  }

  const filtered = ngos
    .filter(n => {
      if (filter === 'VERIFIED') return n.verified
      if (filter === 'UNVERIFIED') return !n.verified
      return true
    })
    .filter(n => !search || n.organizationName?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>NGO Management 🏢</h1>
        <p>Verify and manage partner organizations</p>
      </div>

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <input
          id="ngo-search-input"
          type="text"
          className="form-input"
          placeholder="🔍 Search by organization name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'VERIFIED', 'UNVERIFIED'].map(f => (
            <button
              key={f}
              id={`ngo-filter-${f.toLowerCase()}-btn`}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' && `All (${ngos.length})`}
              {f === 'VERIFIED' && `✓ Verified (${ngos.filter(n => n.verified).length})`}
              {f === 'UNVERIFIED' && `⏳ Pending (${ngos.filter(n => !n.verified).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Loading NGOs...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3>No NGOs found</h3>
          <p>No organizations match your current filters.</p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(ngo => (
            <NgoCard
              key={ngo.id}
              ngo={ngo}
              actions={!ngo.verified && (
                <button
                  id={`verify-ngo-${ngo.id.slice(-6)}-btn`}
                  className="btn btn-primary btn-sm"
                  disabled={verifying[ngo.id]}
                  onClick={() => handleVerify(ngo.id)}
                >
                  {verifying[ngo.id]
                    ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                    : '✓ Verify NGO'}
                </button>
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
