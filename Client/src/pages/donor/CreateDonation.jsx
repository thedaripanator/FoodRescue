import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axios'
import ImageUploader from '../../components/ImageUploader'
import FoodAnalysisResult from '../../components/FoodAnalysisResult'
import { useAuth } from '../../context/AuthContext'

const FOOD_TYPES = ['Cooked Meals', 'Raw Vegetables', 'Fruits', 'Bakery Items', 'Packaged Food', 'Dairy', 'Beverages', 'Other']
const URGENCY_OPTS = ['low', 'medium', 'high', 'critical']

function GeoButton({ onLocation }) {
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation(pos.coords.latitude, pos.coords.longitude)
        setLoading(false)
      },
      () => {
        alert('Could not get location. Please enter manually.')
        setLoading(false)
      }
    )
  }

  return (
    <button
      id="get-location-btn"
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={getLocation}
      disabled={loading}
      style={{ whiteSpace: 'nowrap' }}
    >
      {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '📍'}
      {loading ? 'Getting...' : 'Use My Location'}
    </button>
  )
}

function ManualDonationForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    foodType: '',
    quantity: '',
    estimatedServings: '',
    latitude: '',
    longitude: '',
    pickupDeadline: '',
    urgency: 'medium',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/donations', {
        ...form,
        quantity: parseFloat(form.quantity),
        estimatedServings: parseInt(form.estimatedServings),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        pickupDeadline: form.pickupDeadline,
      })
      navigate('/donor/donations')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create donation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="manual-donation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Food Type *</label>
        <select
          className="form-select"
          value={form.foodType}
          onChange={e => set('foodType', e.target.value)}
          required
        >
          <option value="">Select food type</option>
          {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Quantity (kg) *</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 5"
            min="0"
            step="0.1"
            value={form.quantity}
            onChange={e => set('quantity', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Estimated Servings *</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 20"
            min="1"
            value={form.estimatedServings}
            onChange={e => set('estimatedServings', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label className="form-label">Location *</label>
          <GeoButton onLocation={(lat, lng) => { set('latitude', lat); set('longitude', lng) }} />
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

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Pickup Deadline *</label>
          <input
            type="datetime-local"
            className="form-input"
            value={form.pickupDeadline}
            onChange={e => set('pickupDeadline', e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Urgency</label>
          <select
            className="form-select"
            value={form.urgency}
            onChange={e => set('urgency', e.target.value)}
          >
            {URGENCY_OPTS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <button
        id="submit-donation-btn"
        type="submit"
        className="btn btn-primary w-full"
        disabled={submitting}
      >
        {submitting ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : '🍱'}
        {submitting ? 'Submitting...' : 'Submit Donation'}
      </button>
    </form>
  )
}

function AIDonationForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [location, setLocation] = useState({ latitude: '', longitude: '' })
  const [deadline, setDeadline] = useState('')

  const handleAnalyze = async () => {
    if (!file) return alert('Please select an image first')
    if (!location.latitude || !location.longitude) return alert('Please set your location first')
    if (!deadline) return alert('Please set a pickup deadline')

    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('donorId', user.id)
      formData.append('latitude', location.latitude)
      formData.append('longitude', location.longitude)
      formData.append('pickupDeadline', deadline)

      const res = await api.post('/ml/analyze-donation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAnalysis(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleConfirm = async () => {
    if (!analysis) return
    setSubmitting(true)
    try {
      const foodAnalysis = analysis.foodAnalysis
      await api.post('/donations/from-analysis', {
        donorId: analysis.donorId,
        latitude: analysis.latitude,
        longitude: analysis.longitude,
        pickupDeadline: analysis.pickupDeadline,
        foodType: foodAnalysis.foodType,
        estimatedServings: foodAnalysis.estimatedServings,
        urgency: foodAnalysis.urgency,
        quantity: 1, // default
        confidence: foodAnalysis.confidence,
        foodItems: foodAnalysis.foodItems,
        suitability: foodAnalysis.suitability,
      })
      navigate('/donor/donations')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create donation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {!analysis ? (
        <>
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <p className="text-sm" style={{ marginBottom: 16 }}>
              📸 Take a photo of your food and our AI will automatically determine food type, quantity, and urgency.
            </p>
            <ImageUploader onFile={setFile} label="Upload Food Photo for AI Analysis" />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label">Your Location *</label>
              <GeoButton onLocation={(lat, lng) => setLocation({ latitude: lat, longitude: lng })} />
            </div>
            <div className="form-row">
              <input
                type="number"
                className="form-input"
                placeholder="Latitude"
                step="any"
                value={location.latitude}
                onChange={e => setLocation(l => ({ ...l, latitude: e.target.value }))}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Longitude"
                step="any"
                value={location.longitude}
                onChange={e => setLocation(l => ({ ...l, longitude: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pickup Deadline *</label>
            <input
              type="datetime-local"
              className="form-input"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>

          <button
            id="analyze-food-btn"
            className="btn btn-primary w-full"
            onClick={handleAnalyze}
            disabled={analyzing || !file}
          >
            {analyzing
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Analyzing with AI...</>
              : '🤖 Analyze Food with AI'}
          </button>
        </>
      ) : (
        <FoodAnalysisResult
          result={analysis.foodAnalysis}
          onConfirm={submitting ? undefined : handleConfirm}
          onReset={() => setAnalysis(null)}
        />
      )}
    </div>
  )
}

export default function CreateDonation() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'manual' ? 1 : 0
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="main-content animate-fade-in">
      <div className="page-header">
        <h1>Donate Food 🍱</h1>
        <p>Use AI assistance or enter details manually</p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="tabs">
          <button
            id="tab-ai-btn"
            className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            🤖 AI-Assisted
          </button>
          <button
            id="tab-manual-btn"
            className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            ✏️ Manual Entry
          </button>
        </div>

        <div className="card">
          {activeTab === 0 ? <AIDonationForm /> : <ManualDonationForm />}
        </div>
      </div>
    </div>
  )
}
