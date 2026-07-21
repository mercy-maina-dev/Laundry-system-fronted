import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle, Shield, Sparkles, Loader2
} from 'lucide-react'
import logoImg from '../../assets/images/logo.png'
import registerBg from '../../assets/images/photo.jpeg'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const navigate = useNavigate()

  const validatePhone = (phone) => {
    const phoneRegex = /^(?:\+254|0|07)?[0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const formatPhone = (value) => {
    let cleaned = value.replace(/\D/g, '')
    if (cleaned.startsWith('254')) {
      return '+' + cleaned
    }
    return cleaned
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters!')
      return
    }

    if (!validatePhone(phone)) {
      toast.error('Please enter a valid phone number (e.g., 0712345678 or +254712345678)')
      return
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms & Conditions')
      return
    }

    setLoading(true)
    try {
      await axios.post('http://localhost:8088/adduser', {
        full_name: fullName,
        email,
        phone,
        password,
        role: 'CUSTOMER'  // Hardcoded – only customers can register
      })
      toast.success(`Welcome ${fullName}! Your account has been created. Please check your email and phone for verification code.`)
      navigate('/verify', { state: { email, phone } })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
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
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join Smart Laundry and enjoy premium laundry services.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Data Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Free Signup</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="0712345678 or +254712345678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter 10 digits (e.g., 0712345678)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm dark:text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match!</p>
              )}
            </div>

            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* ===== RIGHT COLUMN – Image ===== */}
      <div className="hidden md:flex flex-1 relative min-h-screen">
        <div className="absolute inset-0">
          <img 
            src={registerBg} 
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
              Start Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Laundry Journey
              </span>
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of happy customers who trust us with their laundry every day.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Free Pickup
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Quality Guarantee
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-300" />
                10% First Order
              </div>
            </div>
          </div>

          <div className="text-sm text-white/50">
            &copy; 2025 Smart Laundry. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* ===== Mobile: Image as Background ===== */}
      <div className="md:hidden fixed inset-0 z-0">
        <img 
          src={registerBg} 
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