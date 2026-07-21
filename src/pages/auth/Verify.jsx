import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../../config/api';
import toast from 'react-hot-toast'
import { Mail, CheckCircle, Send, Lightbulb, Loader2, ArrowLeft } from 'lucide-react'

export default function Verify() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email || ''
  const phone = location.state?.phone || ''

  useEffect(() => {
    if (email) {
      startTimer()
    }
  }, [email])

  const startTimer = () => {
    setCanResend(false)
    setTimer(60)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!code || code.length < 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/verify`, { 
        email, 
        code 
      })
      toast.success('Email verified successfully! Your account is now active.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return
    
    setResendLoading(true)
    try {
      await axios.post(`${API_URL}/resend-verification`, { email })
      toast.success('A new verification code has been sent to your email and phone.')
      startTimer()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    navigate('/register')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Account</h2>
          <p className="text-gray-500 mt-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-blue-600 font-semibold text-sm mt-1">{email}</p>
          <p className="text-gray-400 text-xs mt-1">and to your phone number</p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-center text-2xl tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Enter the 6-digit code sent to your email and phone
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendCode}
              disabled={!canResend || resendLoading}
              className={`font-semibold transition flex items-center justify-center gap-1 ${
                canResend && !resendLoading
                  ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {resendLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <Send className="w-4 h-4" />
                  Resend Code
                </>
              ) : (
                `Resend in ${timer}s`
              )}
            </button>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            Check your spam folder if you don't see the email. 
            The verification code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}