import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const FOOD_TYPE_OPTIONS = [
  'Cooked Meals', 'Raw Vegetables', 'Fruits', 'Bakery Items',
  'Packaged Food', 'Dairy', 'Beverages', 'Grain & Staples', 'Other'
]

export default function NgoRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    organizationName: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    capacity: '',
    acceptedFoodTypes: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleFoodType = (ft) => {
    setForm(f => ({
      ...f,
      acceptedFoodTypes: f.acceptedFoodTypes.includes(ft)
        ? f.acceptedFoodTypes.filter(t => t !== ft)
        : [...f.acceptedFoodTypes, ft]
    }))
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('latitude', pos.coords.latitude)
        set('longitude', pos.coords.longitude)
      },
      () => alert('Could not get location. Please enter manually.')
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.acceptedFoodTypes.length === 0) {
      return setError('Please select at least one accepted food type.')
    }
    setSubmitting(true)
    try {
      await api.post('/ngos', {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        capacity: parseInt(form.capacity),
      })
      alert('Registration successful! Your role has been upgraded to NGO. Please sign out and sign back in to access your new dashboard.')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>Register Your NGO 🏢</h1>
        <p>Fill in your organization details to start receiving food donations</p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card">
          <form id="ngo-register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Organization Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hope Foundation"
                value={form.organizationName}
                onChange={e => set('organizationName', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit phone"
                  pattern="[0-9]{10}"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity (servings) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 500"
                  min="1"
                  value={form.capacity}
                  onChange={e => set('capacity', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className="form-textarea"
                placeholder="Full address of your organization"
                rows={2}
                value={form.address}
                onChange={e => set('address', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label">Location *</label>
                <button
                  type="button"
                  id="ngo-get-location-btn"
                  className="btn btn-ghost btn-sm"
                  onClick={getLocation}
                >
                  📍 Use My Location
                </button>
              </div>
              <div className="form-row">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Latitude"
                  step="any"
                  value={form.latitude}
                  onChange={e => set('latitude', e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Longitude"
                  step="any"
                  value={form.longitude}
                  onChange={e => set('longitude', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Accepted Food Types *</label>
              <p className="text-xs text-muted" style={{ marginBottom: 10 }}>Select all that apply</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {FOOD_TYPE_OPTIONS.map(ft => (
                  <button
                    key={ft}
                    type="button"
                    id={`food-type-${ft.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`btn btn-sm ${form.acceptedFoodTypes.includes(ft) ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleFoodType(ft)}
                  >
                    {form.acceptedFoodTypes.includes(ft) ? '✓ ' : ''}{ft}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: '#f87171',
                fontSize: '0.875rem',
                marginBottom: 'var(--space-4)'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="register-ngo-submit-btn"
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              {submitting
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Registering...</>
                : '🏢 Register NGO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
