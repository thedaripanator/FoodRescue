import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import LandingPage from './pages/LandingPage'
import DonorDashboard from './pages/donor/DonorDashboard'
import CreateDonation from './pages/donor/CreateDonation'
import MyDonations from './pages/donor/MyDonations'
import NgoDashboard from './pages/ngo/NgoDashboard'
import NgoRegister from './pages/ngo/NgoRegister'
import NgoIncoming from './pages/ngo/NgoIncoming'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDonations from './pages/admin/AdminDonations'
import AdminNgos from './pages/admin/AdminNgos'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Donor routes */}
        <Route path="/donor" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <DonorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/donor/donate" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <CreateDonation />
          </ProtectedRoute>
        } />
        <Route path="/donor/donations" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <MyDonations />
          </ProtectedRoute>
        } />

        {/* NGO routes */}
        <Route path="/ngo" element={
          <ProtectedRoute allowedRoles={['NGO']}>
            <NgoDashboard />
          </ProtectedRoute>
        } />
        <Route path="/ngo/register" element={
          <ProtectedRoute allowedRoles={['NGO', 'DONOR']}>
            <NgoRegister />
          </ProtectedRoute>
        } />
        <Route path="/ngo/incoming" element={
          <ProtectedRoute allowedRoles={['NGO']}>
            <NgoIncoming />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/donations" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDonations />
          </ProtectedRoute>
        } />
        <Route path="/admin/ngos" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminNgos />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={
          user
            ? <Navigate to={
                user.role === 'DONOR' ? '/donor' :
                user.role === 'NGO' ? '/ngo' : '/admin'
              } replace />
            : <Navigate to="/" replace />
        } />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
