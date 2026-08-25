import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('foodrescue_user')
    const storedToken = localStorage.getItem('foodrescue_token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('foodrescue_user')
        localStorage.removeItem('foodrescue_token')
      }
    }
    setLoading(false)
  }, [])

  // Called after Google Sign-In gives us an idToken
  const loginWithGoogle = async (idToken) => {
    const res = await api.post('/auth/google', { idToken })
    const { token, ...userData } = res.data
    localStorage.setItem('foodrescue_token', token)
    localStorage.setItem('foodrescue_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('foodrescue_token')
    localStorage.removeItem('foodrescue_user')
    setUser(null)
  }

  const isRole = (role) => user?.role === role

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
