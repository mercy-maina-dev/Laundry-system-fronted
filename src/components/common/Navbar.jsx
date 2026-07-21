import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/') // Changed from '/login' to '/'
  }

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin'
    if (user?.role === 'DRIVER') return '/driver'
    return '/dashboard'
  }

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? getDashboardLink() : '/'} className="text-xl font-bold text-blue-600">
          🧺 Smart Laundry
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">👤 {user.full_name || 'User'}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{user.role}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}