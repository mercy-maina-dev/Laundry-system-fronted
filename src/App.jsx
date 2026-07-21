import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Landing from './components/landing/Landing'
import Login from './pages/auth/Login.jsx'
import Verify from './pages/auth/Verify.jsx'
import Register from './pages/auth/Register.jsx'
import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import CustomerDashboard from './pages/dashboards/CustomerDashboard'
import DriverDashboard from './pages/dashboards/DriverDashboard'
import SettingsPage from './pages/SettingsPage'

function AppRoutes() {
  const { user } = useAuth()

  const getDashboard = () => {
    if (user?.role === 'ADMIN') return <AdminDashboard />
    if (user?.role === 'DRIVER') return <DriverDashboard />
    return <CustomerDashboard />
  }

  return (
    <>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

        {/* Protected routes with DashboardLayout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={getDashboard()} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DriverDashboard />} />
        </Route>

        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
              padding: '16px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App