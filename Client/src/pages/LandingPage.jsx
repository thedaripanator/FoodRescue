import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const routes = { DONOR: '/donor', NGO: '/ngo', ADMIN: '/admin' }
      navigate(routes[user.role] || '/')
    }
  }, [user, navigate])

  return (
    <div className="landing">
      {/* Animated background orbs */}
      <div className="landing-bg">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
      </div>

      <div className="landing-content">
        <div className="landing-badge">
          🌿 AI-Powered Food Rescue Platform
        </div>

        <h1 className="landing-title">
          Don't Waste Food.
          <br />
          Save Lives Instead.
        </h1>

        <p className="landing-subtitle">
          FoodRescue connects food donors with verified NGOs using AI-powered
          matching — so no meal goes to waste while someone goes hungry.
        </p>

        <GoogleSignInButton />

        <p className="text-xs text-muted" style={{ marginTop: 16 }}>
          Your role (Donor / NGO / Admin) is assigned by an administrator after sign-in.
        </p>

        <div className="landing-stats">
          <div className="landing-stat-item">
            <span className="landing-stat-num">10k+</span>
            <span className="landing-stat-label">Meals Rescued</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-num">200+</span>
            <span className="landing-stat-label">Partner NGOs</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-num">98%</span>
            <span className="landing-stat-label">Match Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            // credentialResponse.credential is the ID token
            const user = await loginWithGoogle(credentialResponse.credential)
            const routes = { DONOR: '/donor', NGO: '/ngo', ADMIN: '/admin' }
            navigate(routes[user.role] || '/')
          } catch (err) {
            console.error('Login error:', err)
            alert('Login failed. Please try again.')
          }
        }}
        onError={() => alert('Google login failed. Please try again.')}
        size="large"
        shape="pill"
      />
    </div>
  )
}
