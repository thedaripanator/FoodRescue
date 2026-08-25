export default function NgoCard({ ngo, actions }) {
  return (
    <div className="ngo-card animate-fade-in">
      <div className="ngo-card-header">
        <div className="ngo-avatar">🏢</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 0 }} className="truncate">
              {ngo.organizationName}
            </h3>
            <span className={`badge ${ngo.verified ? 'badge-verified' : 'badge-unverified'}`}>
              {ngo.verified ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">{ngo.address}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
        <div>
          <div className="text-xs text-muted">Phone</div>
          <div className="text-sm fw-600">{ngo.phone}</div>
        </div>
        <div>
          <div className="text-xs text-muted">Capacity</div>
          <div className="text-sm fw-600">{ngo.capacity} servings</div>
        </div>
        <div>
          <div className="text-xs text-muted">Status</div>
          <div className="text-sm fw-600" style={{ color: ngo.available ? 'var(--color-primary)' : '#ef4444' }}>
            {ngo.available ? '🟢 Available' : '🔴 Unavailable'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted">Food Types</div>
          <div className="text-sm" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(ngo.acceptedFoodTypes || []).slice(0, 3).map((ft) => (
              <span key={ft} className="food-item-chip">{ft}</span>
            ))}
            {(ngo.acceptedFoodTypes || []).length > 3 && (
              <span className="food-item-chip">+{ngo.acceptedFoodTypes.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {actions && (
        <div className="donation-card-actions">
          {actions}
        </div>
      )}
    </div>
  )
}
