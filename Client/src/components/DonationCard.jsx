import StatusBadge from './StatusBadge'

const TIMELINE_STEPS = ['CREATED', 'AVAILABLE', 'MATCHED', 'ACCEPTED', 'PICKED_UP', 'DISTRIBUTED']
const STEP_ICONS = { CREATED:'📝', AVAILABLE:'📢', MATCHED:'🎯', ACCEPTED:'✅', PICKED_UP:'🚗', DISTRIBUTED:'🤝' }

function getStepIndex(status) {
  const idx = TIMELINE_STEPS.indexOf(status)
  return idx === -1 ? 0 : idx
}

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function UrgencyBadge({ urgency }) {
  const cls = urgency
    ? `urgency-${urgency.toLowerCase()}`
    : 'text-muted'
  return (
    <span className={cls} style={{ fontWeight: 700, fontSize: '0.85rem' }}>
      {urgency || '—'}
    </span>
  )
}

export default function DonationCard({ donation, actions }) {
  const currentIdx = getStepIndex(donation.status)

  return (
    <div className="donation-card animate-fade-in">
      <div className="donation-card-header">
        <div>
          <div className="donation-card-title">
            {donation.foodType || 'Food Donation'}
          </div>
          <div className="text-xs text-muted mt-1">ID: {donation.id?.slice(-8)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <StatusBadge status={donation.status} />
          <UrgencyBadge urgency={donation.urgency} />
        </div>
      </div>

      {/* Mini Timeline */}
      <div className="timeline" style={{ margin: '12px 0' }}>
        {TIMELINE_STEPS.map((step, i) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="timeline-step">
              <div className={`timeline-dot ${i < currentIdx ? 'done' : i === currentIdx ? 'current' : ''}`}>
                {i < currentIdx ? '✓' : STEP_ICONS[step]}
              </div>
              <span className="timeline-label">{step.replace('_', ' ')}</span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`timeline-line ${i < currentIdx ? 'done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="donation-card-meta">
        <div className="donation-meta-item">
          <span className="icon">🍽️</span>
          <span>{donation.estimatedServings} servings</span>
        </div>
        <div className="donation-meta-item">
          <span className="icon">⚖️</span>
          <span>{donation.quantity} kg</span>
        </div>
        <div className="donation-meta-item">
          <span className="icon">⏰</span>
          <span>Pickup by: {formatDate(donation.pickupDeadline)}</span>
        </div>
        {donation.matchedNgoId && (
          <div className="donation-meta-item">
            <span className="icon">🏢</span>
            <span>NGO: {donation.matchedNgoId.slice(-8)}</span>
          </div>
        )}
      </div>

      {actions && (
        <div className="donation-card-actions">
          {actions}
        </div>
      )}
    </div>
  )
}
