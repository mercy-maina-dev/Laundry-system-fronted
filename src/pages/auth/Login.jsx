

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api';

import { useAuth } from '../../hooks/useAuth'
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  Sparkles, Loader2, CheckCircle, Shield,
  User, Phone, Calendar
} from 'lucide-react'
import logoImg from '../../assets/images/logo.png'
import loginBg from '../../assets/images/photo.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      if (response.data.token) {
        const userData = response.data.user
        login(userData, response.data.token)
        
        if (rememberMe) {
          localStorage.setItem('remembered_email', email)
        } else {
          localStorage.removeItem('remembered_email')
        }
        
        toast.success(`Welcome back, ${userData.full_name || 'User'}!`)
        
        if (userData.role === 'ADMIN') {
          navigate('/admin')
        } else if (userData.role === 'DRIVER') {
          navigate('/driver')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      
      {/* ===== LEFT COLUMN ===== */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logoImg} alt="Smart Laundry" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Smart<span className="text-blue-600 dark:text-blue-400">Laundry</span>
            </span>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Login to continue and enjoy our premium laundry services.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Encrypted Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or continue with</span>
            </div>
          </div>

          <button
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-3 cursor-not-allowed opacity-60"
            disabled
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <span className="text-xs text-gray-400">(Coming Soon)</span>
          </button>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* ===== RIGHT COLUMN – Image ===== */}
      <div className="hidden md:flex flex-1 relative min-h-screen">
        <div className="absolute inset-0">
          <img 
            src={loginBg} 
            alt="Smart Laundry" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Overlay content on the image */}
        <div className="relative z-10 flex flex-col justify-between w-full h-full p-12 text-white">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Smart Laundry" className="h-10 w-auto brightness-0 invert" />
            <span className="text-xl font-bold">SmartLaundry</span>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Clean Clothes.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Fresh Life.
              </span>
            </h2>
            <p className="text-white/80 text-lg">
              We take care of your laundry, so you can focus on what really matters.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Fast Pickup
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Professional Clean
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                On-Time Delivery
              </div>
            </div>
          </div>

          <div className="text-sm text-white/50">
            &copy; 2025 Smart Laundry. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Mobile: show image as background with overlay */}
      <div className="md:hidden fixed inset-0 z-0">
        <img 
          src={loginBg} 
          alt="Smart Laundry" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 6s ease-in-out infinite;
        }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  )
}