export default function FoodAnalysisResult({ result, onConfirm, onReset }) {
  if (!result) return null

  const confidence = Math.round((result.confidence || 0) * 100)

  const urgencyColor = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#7ed957',
  }[result.urgency?.toLowerCase()] || 'var(--color-text)'

  return (
    <div className="analysis-result animate-slide-up">
      <div className="analysis-header">
        <span style={{ fontSize: '2rem' }}>🤖</span>
        <div>
          <h3 style={{ marginBottom: 2 }}>AI Food Analysis</h3>
          <p className="text-xs text-muted">Powered by Gemini Vision</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span
            className="badge"
            style={{ background: 'rgba(126,217,87,0.15)', color: 'var(--color-primary)' }}
          >
            {confidence}% confidence
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="text-xs text-muted" style={{ marginBottom: 4 }}>Confidence Level</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${confidence}%` }} />
        </div>
      </div>

      {/* Food type & items */}
      <div style={{ marginTop: '16px' }}>
        <div className="text-xs text-muted" style={{ marginBottom: 6 }}>Detected Food Type</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          {result.foodType || '—'}
        </div>
        <div className="analysis-food-items">
          {(result.foodItems || []).map((item, i) => (
            <span key={i} className="food-item-chip">{item}</span>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="analysis-grid">
        <div className="analysis-metric">
          <div className="analysis-metric-label">Estimated Servings</div>
          <div className="analysis-metric-value">🍽️ {result.estimatedServings || '—'}</div>
        </div>
        <div className="analysis-metric">
          <div className="analysis-metric-label">Suitability</div>
          <div className="analysis-metric-value" style={{ fontSize: '1rem' }}>
            {result.suitability || '—'}
          </div>
        </div>
        <div className="analysis-metric">
          <div className="analysis-metric-label">Urgency</div>
          <div className="analysis-metric-value" style={{ color: urgencyColor, fontSize: '1rem' }}>
            ⚡ {result.urgency || '—'}
          </div>
        </div>
      </div>

      {/* Actions */}
      {(onConfirm || onReset) && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {onConfirm && (
            <button id="confirm-analysis-btn" className="btn btn-primary" style={{ flex: 1 }} onClick={onConfirm}>
              ✓ Confirm & Create Donation
            </button>
          )}
          {onReset && (
            <button id="retry-analysis-btn" className="btn btn-ghost" onClick={onReset}>
              ↺ Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}
