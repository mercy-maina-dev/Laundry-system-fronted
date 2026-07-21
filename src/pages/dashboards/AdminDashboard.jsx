import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config/api'   // ✅ ADDED IMPORT
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts'
import { toast } from 'react-hot-toast'
import {
  Bell, RefreshCw, Download, Moon, Sun, 
  Package, DollarSign, Coins, Smartphone, Users, Truck,
  UserPlus, UserCog, Plus, Settings as SettingsIcon,
  Building, Store,
  TrendingUp, BarChart3, PieChart as PieChartIcon, ClipboardList, Zap,
  FileText, MessageSquare, AlertCircle, ShieldCheck,
  X, Camera, Phone, Mail, MapPin, Clock,
  Send, CheckCircle, Loader2,
  Star,
  Menu, Save, Info,
  LogOut, Eye
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // ---------- Core State ----------
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [payments, setPayments] = useState([])
  const [services, setServices] = useState([])
  const [feedback, setFeedback] = useState([])
  const [complaints, setComplaints] = useState([])
  const [chartData, setChartData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [driverPerformance, setDriverPerformance] = useState([])
  const [orderDrivers, setOrderDrivers] = useState({})

  // ---------- UI State ----------
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'light')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddDriverModal, setShowAddDriverModal] = useState(false)
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMpesaModal, setShowMpesaModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)

  // ---------- Selected Items ----------
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [editingService, setEditingService] = useState(null)

  // ---------- Form States ----------
  const [complaintReply, setComplaintReply] = useState('')
  const [mpesaPayment, setMpesaPayment] = useState({ order_id: '', phone: '', amount: '' })
  const [mpesaLoading, setMpesaLoading] = useState(false)
  const [cashPayment, setCashPayment] = useState({ order_id: '', amount: '', customer_name: '', phone: '' })
  const [profile, setProfile] = useState({
    full_name: '', email: '', phone: '', role: 'ADMIN', bio: 'System Administrator', profile_picture: null
  })
  const [newUser, setNewUser] = useState({ full_name: '', email: '', phone: '', password: '', role: 'CUSTOMER' })
  const [newDriver, setNewDriver] = useState({ full_name: '', email: '', phone: '', password: '', role: 'DRIVER' })
  const [newService, setNewService] = useState({ name: '', description: '', price_per_kg: '', category: 'WASH' })
  const [settings, setSettings] = useState({
    store_name: 'Smart Laundry',
    store_address: 'Nairobi, Kenya',
    contact_phone: '+254 700 000 000',
    operating_hours: 'Mon-Fri: 7AM-8PM, Sat: 8AM-6PM, Sun: 9AM-4PM',
    pickup_fee: 100,
    delivery_fee: 150,
    currency: 'Ksh',
    paybill_number: '174379',
    till_number: '123456'
  })

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to Admin Dashboard', time: 'Just now', read: false },
  ])

  const fileInputRef = useRef(null)
  const [profileImage, setProfileImage] = useState(null)

  // ---------- Stats ----------
  const [stats, setStats] = useState({
    orders: 0, revenue: 0, cashRevenue: 0, onlineRevenue: 0,
    users: 0, drivers: 0, pendingOrders: 0, completedOrders: 0,
    cancelledOrders: 0, totalServices: 0, totalPayments: 0,
    pendingPayments: 0, todayOrders: 0, growth: 0,
    complaints: 0, feedbackCount: 0
  })

  // ---------- Effects ----------
  useEffect(() => {
    fetchDashboardData()
    fetchSettings()
    fetchProfile()
    fetchComplaints()
    fetchFeedback()
    const interval = setInterval(() => {
      fetchDashboardData(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    localStorage.setItem('admin_theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // ---------- Logout Handler ----------
  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  // ---------- API Calls ----------
  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      else setRefreshing(true)
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const ordersRes = await axios.get(`${API_URL}/orders`, { headers })
      const ordersData = ordersRes.data?.Orders || ordersRes.data || []
      const ordersArray = Array.isArray(ordersData) ? ordersData : []
      setOrders(ordersArray)

      let usersArray = []
      try {
        const usersRes = await axios.get(`${API_URL}/admin/users`, { headers })
        usersArray = usersRes.data?.Users || usersRes.data || []
      } catch (e) { console.log('Users error:', e.message) }
      setUsers(usersArray)
      
      const driversList = usersArray.filter(u => u.role === 'DRIVER')
      setDrivers(driversList)

      let paymentsArray = []
      try {
        const paymentsRes = await axios.get(`${API_URL}/payments`, { headers })
        paymentsArray = Array.isArray(paymentsRes.data) ? paymentsRes.data : []
      } catch (e) { console.log('Payments error:', e.message) }
      setPayments(paymentsArray)

      let servicesArray = []
      try {
        const servicesRes = await axios.get(`${API_URL}/services`, { headers })
        servicesArray = servicesRes.data?.Services || servicesRes.data || []
      } catch (e) { console.log('Services error:', e.message) }
      setServices(servicesArray)

      const totalOrders = ordersArray.length
      const pending = ordersArray.filter(o => o.status === 'PENDING').length
      const completed = ordersArray.filter(o => o.status === 'DELIVERED').length
      const cancelled = ordersArray.filter(o => o.status === 'CANCELLED').length
      const totalRevenue = ordersArray.reduce((sum, o) => sum + (o.total_price || 0), 0)
      
      const cashRevenue = paymentsArray.filter(p => p.payment_method === 'CASH').reduce((sum, p) => sum + (p.amount || 0), 0)
      const onlineRevenue = paymentsArray.filter(p => p.payment_method === 'M-PESA').reduce((sum, p) => sum + (p.amount || 0), 0)

      const today = new Date().toDateString()
      const todayOrders = ordersArray.filter(o => o.created_at && new Date(o.created_at).toDateString() === today).length

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()
      const chartDataTemp = []
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const monthOrders = ordersArray.filter(o => {
          if (!o.created_at) return false
          return new Date(o.created_at).getMonth() === monthIndex
        })
        const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)
        chartDataTemp.push({
          name: monthNames[monthIndex],
          orders: monthOrders.length,
          revenue: monthRevenue
        })
      }
      setChartData(chartDataTemp)

      setStatusData([
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
        { name: 'Cancelled', value: cancelled }
      ])

      const driverPerf = driversList.map(d => ({
        ...d,
        name: d.full_name,
        orders: Math.floor(Math.random() * 50) + 5,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        onTime: Math.floor(Math.random() * 30) + 10,
        revenue: Math.floor(Math.random() * 50000) + 10000
      }))
      setDriverPerformance(driverPerf)

      setStats({
        orders: totalOrders,
        revenue: totalRevenue,
        cashRevenue,
        onlineRevenue,
        users: usersArray.length,
        drivers: driversList.length,
        pendingOrders: pending,
        completedOrders: completed,
        cancelledOrders: cancelled,
        totalServices: servicesArray.length,
        totalPayments: paymentsArray.length,
        pendingPayments: paymentsArray.filter(p => p.payment_status === 'PENDING').length,
        todayOrders,
        growth: totalOrders > 0 ? Math.round((completed / totalOrders) * 100) : 0,
        complaints: complaints.length,
        feedbackCount: feedback.length
      })

      setLoading(false)
      setRefreshing(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load dashboard')
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/settings`, { headers: { Authorization: `Bearer ${token}` } }) // ✅ fixed
      if (response.data) setSettings(response.data)
    } catch (error) { console.log('Settings fetch error:', error.message) }
  }

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if (userData) {
        setProfile({
          full_name: userData.full_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'ADMIN',
          bio: 'System Administrator',
          profile_picture: userData.profile_picture || null
        })
      }
    } catch (error) { console.log('Profile fetch error:', error.message) }
  }

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/complaints`, { headers: { Authorization: `Bearer ${token}` } })
      setComplaints(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.log('Complaints endpoint not found, using mock data')
      setComplaints([
        { id: 1, order_id: 101, customer_name: 'Alice', message: 'Late delivery', status: 'PENDING', created_at: new Date().toISOString() },
        { id: 2, order_id: 105, customer_name: 'Bob', message: 'Wrong item received', status: 'RESOLVED', created_at: new Date(Date.now() - 86400000).toISOString(), reply: 'We apologize, we will replace it.' }
      ])
    }
  }

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/feedback`, { headers: { Authorization: `Bearer ${token}` } })
      setFeedback(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.log('Feedback endpoint not found, using mock data')
      setFeedback([
        { id: 1, order_id: 102, customer_id: 3, rating: 5, comment: 'Excellent service!', created_at: new Date().toISOString() },
        { id: 2, order_id: 103, customer_id: 4, rating: 4, comment: 'Good, but a bit late.', created_at: new Date(Date.now() - 86400000).toISOString() }
      ])
    }
  }

  // ---------- Handlers ----------
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s/g, '')
    const phoneRegex = /^(?:\+254|0|07)?[0-9]{9}$/
    if (!phoneRegex.test(cleaned)) {
      toast.error('Please enter a valid phone number (10 digits or +254 format)')
      return false
    }
    return true
  }

  const handleMpesaPayment = async (e) => {
    e.preventDefault()
    if (!mpesaPayment.order_id || !mpesaPayment.phone || !mpesaPayment.amount) {
      toast.error('Please fill all fields')
      return
    }
    if (!validatePhone(mpesaPayment.phone)) return
    setMpesaLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/mpesa/stkpush`, {
        phone: mpesaPayment.phone,
        amount: parseFloat(mpesaPayment.amount),
        order_id: parseInt(mpesaPayment.order_id)
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('M-Pesa payment prompt sent! Please check your phone.')
      setMpesaPayment({ order_id: '', phone: '', amount: '' })
      setMpesaLoading(false)
      setShowMpesaModal(false)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send M-Pesa prompt')
      setMpesaLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newUser.full_name || !newUser.email || !newUser.phone || !newUser.password) {
      toast.error('Please fill all fields')
      return
    }
    if (!validatePhone(newUser.phone)) return
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/adduser`, newUser, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`${newUser.full_name} added as ${newUser.role}`)
      setShowAddUserModal(false)
      setNewUser({ full_name: '', email: '', phone: '', password: '', role: 'CUSTOMER' })
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add user')
    }
  }

  const handleAddDriver = async (e) => {
    e.preventDefault()
    if (!newDriver.full_name || !newDriver.email || !newDriver.phone || !newDriver.password) {
      toast.error('Please fill all fields')
      return
    }
    if (!validatePhone(newDriver.phone)) return
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/adduser`, newDriver, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`${newDriver.full_name} added as a Driver`)
      setShowAddDriverModal(false)
      setNewDriver({ full_name: '', email: '', phone: '', password: '', role: 'DRIVER' })
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add driver')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`${userName} deleted successfully`)
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`Order #${orderId} deleted successfully`)
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete order')
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`Order #${orderId} status updated to ${newStatus}`)
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const assignDriverToOrder = async (orderId, driverId) => {
    if (!driverId) {
      toast.error('Please select a driver')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/assign-pickup`, {
        order_id: orderId,
        driver_id: parseInt(driverId),
        location_address: 'Customer address'
      }, { headers: { Authorization: `Bearer ${token}` } })
      setOrderDrivers(prev => ({ ...prev, [orderId]: driverId }))
      toast.success(`Driver assigned to order #${orderId}`)
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to assign driver')
    }
  }

  const handleCashPayment = async (e) => {
    e.preventDefault()
    if (!cashPayment.order_id || !cashPayment.amount) {
      toast.error('Please fill in order ID and amount')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/addpayment`, {
        order_id: parseInt(cashPayment.order_id),
        amount: parseFloat(cashPayment.amount),
        payment_method: 'CASH',
        payment_status: 'SUCCESS',
        customer_name: cashPayment.customer_name,
        phone: cashPayment.phone
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Cash payment recorded successfully!')
      setShowPaymentModal(false)
      setCashPayment({ order_id: '', amount: '', customer_name: '', phone: '' })
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to record cash payment')
    }
  }

  const handleComplaintReply = async () => {
    if (!complaintReply.trim()) {
      toast.error('Please enter a reply')
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/complaints/${selectedComplaint.id}`, {
        reply: complaintReply,
        status: 'RESOLVED'
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Complaint resolved successfully!')
      setShowComplaintModal(false)
      setComplaintReply('')
      fetchComplaints()
    } catch (error) {
      toast.error('Failed to resolve complaint')
    }
  }

  // ---------- Service CRUD ----------
  const handleAddService = async (e) => {
    e.preventDefault()
    if (!newService.name || !newService.price_per_kg) {
      toast.error('Please fill in name and price')
      return
    }
    try {
      const token = localStorage.getItem('token')
      if (editingService) {
        await axios.put(`${API_URL}/services/${editingService.service_id}`, newService, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Service updated')
      } else {
        await axios.post(`${API_URL}/services`, newService, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Service added')
      }
      setShowServiceModal(false)
      setNewService({ name: '', description: '', price_per_kg: '', category: 'WASH' })
      setEditingService(null)
      fetchDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save service')
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/services/${serviceId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Service deleted')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  // ---------- Export ----------
  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Contact', 'Service', 'Description', 'Total', 'Status', 'Driver', 'Created At']
    const rows = orders.map(o => {
      const customer = users.find(u => u.user_id === o.user_id)
      const customerName = customer?.full_name || `User #${o.user_id}`
      const customerPhone = customer?.phone || ''
      const serviceName = o.service_name || 
                          (o.service_id && services.find(s => s.id === o.service_id)?.name) || 
                          ''
      const items = o.items || o.description || ''
      const driverId = o.assigned_driver_id || orderDrivers[o.order_id]
      const driver = drivers.find(d => d.user_id === driverId)
      const driverName = driver?.full_name || 'Not assigned'
      return [
        o.order_id,
        customerName,
        customerPhone,
        serviceName,
        items,
        o.total_price,
        o.status,
        driverName,
        new Date(o.created_at).toLocaleDateString()
      ]
    })
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Orders exported successfully')
  }

  // ---------- UI Helpers ----------
  const getStatusColor = (status) => {
    const s = status?.toUpperCase() || ''
    if (s === 'DELIVERED') return 'bg-green-100 text-green-700'
    if (s === 'PENDING') return 'bg-yellow-100 text-yellow-700'
    if (s === 'PICKED_UP') return 'bg-blue-100 text-blue-700'
    if (s === 'WASHING') return 'bg-indigo-100 text-indigo-700'
    if (s === 'READY') return 'bg-cyan-100 text-cyan-700'
    if (s === 'CANCELLED') return 'bg-red-100 text-red-700'
    if (s === 'PAID') return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getThemeClasses = () => {
    switch(theme) {
      case 'dark': return 'bg-gray-900 text-white'
      case 'blue': return 'bg-blue-50 text-blue-900'
      case 'green': return 'bg-green-50 text-green-900'
      case 'purple': return 'bg-purple-50 text-purple-900'
      default: return 'bg-gray-50 text-gray-900'
    }
  }

  const getCardTheme = () => {
    switch(theme) {
      case 'dark': return 'bg-gray-800 border-gray-700'
      case 'blue': return 'bg-white border-blue-200'
      case 'green': return 'bg-white border-green-200'
      case 'purple': return 'bg-white border-purple-200'
      default: return 'bg-white border-gray-100'
    }
  }

  // ---------- Filtered Data ----------
  const filteredOrders = orders.filter(o => {
    const customer = users.find(u => u.user_id === o.user_id)
    const customerName = customer?.full_name?.toLowerCase() || ''
    const customerPhone = customer?.phone || ''
    
    const serviceName = o.service_name || 
                        (o.service_id && services.find(s => s.id === o.service_id)?.name) || 
                        ''
    const description = o.items || o.description || o.service_description || ''
    const fullDescription = `${serviceName} ${description}`.toLowerCase()
    
    const search = searchTerm.toLowerCase()
    
    const matchesSearch = 
      o.order_id?.toString().includes(search) ||
      o.status?.toLowerCase().includes(search) ||
      customerName.includes(search) ||
      customerPhone.includes(search) ||
      fullDescription.includes(search)

    const matchesStatus = statusFilter === 'all' || o.status?.toUpperCase() === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone?.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role?.toUpperCase() === roleFilter.toUpperCase()
    return matchesSearch && matchesRole
  })

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

  // ---------- Profile Update Handler ----------
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/user/${user?.user_id}`, {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Profile updated successfully')
      setShowProfileModal(false)
      const updatedUser = { ...user, full_name: profile.full_name, email: profile.email, phone: profile.phone }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${getThemeClasses()} transition-colors duration-300`}>
      <div className="space-y-6 p-4 md:p-6">

        {/* ---------- HEADER ---------- */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl ${getCardTheme()} border shadow-sm`}>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.full_name || 'Admin'}!</h1>
            <p className="opacity-70">Manage orders, drivers, and your laundry business.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {['overview','users','payments','feedback','complaints','services','drivers','settings'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-sm transition capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white dark:bg-gray-700 rounded-full shadow hover:shadow-md transition"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
                    <h4 className="font-bold">Notifications</h4>
                    <button onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })))
                      toast.success('All marked read')
                    }} className="text-xs text-blue-600 hover:text-blue-800">Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => fetchDashboardData(true)} 
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-70"
            >
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={exportOrdersCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------- STATS CARDS ---------- */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Orders', value: stats.orders, icon: Package, color: 'blue' },
            { label: 'Revenue', value: `${settings.currency} ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
            { label: 'Cash', value: `${settings.currency} ${stats.cashRevenue.toLocaleString()}`, icon: Coins, color: 'yellow' },
            { label: 'Online', value: `${settings.currency} ${stats.onlineRevenue.toLocaleString()}`, icon: Smartphone, color: 'purple' },
            { label: 'Users', value: stats.users, icon: Users, color: 'indigo' },
            { label: 'Drivers', value: stats.drivers, icon: Truck, color: 'orange' },
          ].map((item, idx) => (
            <div key={idx} className={`${getCardTheme()} rounded-2xl shadow-sm border p-4 hover:shadow-md transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm opacity-70 font-medium">{item.label}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1">{item.value}</p>
                </div>
                <div className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-2 md:p-3 rounded-xl`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- QUICK STATS ROW ---------- */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <p className="text-blue-100 text-sm">Today's Orders</p>
            <p className="text-2xl font-bold">{stats.todayOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-white">
            <p className="text-green-100 text-sm">Pending</p>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-4 text-white">
            <p className="text-orange-100 text-sm">Services</p>
            <p className="text-2xl font-bold">{stats.totalServices}</p>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-white">
            <p className="text-red-100 text-sm">Pending Payments</p>
            <p className="text-2xl font-bold">{stats.pendingPayments}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-4 text-white">
            <p className="text-yellow-100 text-sm">Growth Rate</p>
            <p className="text-2xl font-bold">{stats.growth}%</p>
          </div>
        </div>

        {/* ---------- PAYBILL & MPESA SHORTCUT ---------- */}
        <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-4`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-sm opacity-70">Paybill</p>
                <p className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <Building className="w-5 h-5" /> {settings.paybill_number}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Till</p>
                <p className="text-xl font-bold text-green-600 flex items-center gap-2">
                  <Store className="w-5 h-5" /> {settings.till_number}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowPaymentModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Coins className="w-4 h-4" /> Cash Payment
              </button>
              <button onClick={() => setShowMpesaModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> M-Pesa Prompt
              </button>
            </div>
          </div>
        </div>

        {/* ---------- TAB CONTENT ---------- */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Revenue Overview
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Orders Overview
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" /> Order Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusData.filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" /> Quick Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Revenue', value: `${settings.currency} ${stats.revenue.toLocaleString()}`, color: 'text-green-600' },
                    { label: 'Total Orders', value: stats.orders, color: 'text-blue-600' },
                    { label: 'Avg Order Value', value: `${settings.currency} ${stats.orders > 0 ? Math.round(stats.revenue / stats.orders) : 0}`, color: 'text-purple-600' },
                    { label: 'Active Drivers', value: stats.drivers, color: 'text-orange-600' },
                    { label: 'Pending Complaints', value: complaints.filter(c => c.status !== 'RESOLVED').length, color: 'text-red-600' },
                  ].map((item, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <span className="opacity-70">{item.label}</span>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setShowAddUserModal(true)} className="p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition text-center">
                    <UserPlus className="w-6 h-6 mx-auto" />
                    <span className="text-xs font-medium">Add User</span>
                  </button>
                  <button onClick={() => setShowAddDriverModal(true)} className="p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition text-center">
                    <UserCog className="w-6 h-6 mx-auto" />
                    <span className="text-xs font-medium">Add Driver</span>
                  </button>
                  <button onClick={() => setShowServiceModal(true)} className="p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition text-center">
                    <Package className="w-6 h-6 mx-auto" />
                    <span className="text-xs font-medium">Add Service</span>
                  </button>
                  <button onClick={() => setActiveTab('settings')} className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition text-center">
                    <SettingsIcon className="w-6 h-6 mx-auto" />
                    <span className="text-xs font-medium">Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ---------- ORDERS TABLE ---------- */}
            <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6 overflow-x-auto`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5" /> All Orders ({orders.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Search by order, customer, phone, or description..."
                    className={`px-3 py-2 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select 
                    className={`px-3 py-2 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="WASHING">Washing</option>
                    <option value="READY">Ready</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>
              
              <table className="w-full">
                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="p-3 text-left text-xs font-medium uppercase">Order</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Customer</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Service / Description</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Total</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Status</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Driver</th>
                    <th className="p-3 text-left text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan="7" className="p-4 text-center opacity-70">No orders found</td></tr>
                  ) : (
                    filteredOrders.map(order => {
                      const customer = users.find(u => u.user_id === order.user_id)
                      const customerName = customer?.full_name || `User #${order.user_id}`
                      const customerEmail = customer?.email || ''
                      const customerPhone = customer?.phone || ''

                      const serviceName = order.service_name || 
                                          (order.service_id && services.find(s => s.id === order.service_id)?.name) || 
                                          ''
                      const items = order.items || order.description || order.service_description || ''
                      const displayDescription = items ? `${serviceName} ${items}` : serviceName || '–'

                      const driverId = order.assigned_driver_id || orderDrivers[order.order_id]
                      const driver = drivers.find(d => d.user_id === driverId)
                      const driverName = driver?.full_name || 'Not assigned'

                      return (
                        <tr key={order.order_id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 transition`}>
                          <td className="p-3 text-sm font-medium">#{order.order_id}</td>
                          <td className="p-3 text-sm">
                            <div className="flex flex-col">
                              <span className="font-medium">{customerName}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{customerEmail}</span>
                              {customerPhone && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {customerPhone}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <div className="flex flex-col">
                              {serviceName && <span className="font-medium">{serviceName}</span>}
                              {items && <span className="text-xs text-gray-500 dark:text-gray-400">{items}</span>}
                              {!serviceName && !items && <span className="text-gray-400">–</span>}
                            </div>
                          </td>
                          <td className="p-3 text-sm font-semibold">{settings.currency} {order.total_price}</td>
                          <td className="p-3">
                            <select 
                              className={`px-2 py-1 rounded text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PICKED_UP">PICKED_UP</option>
                              <option value="WASHING">WASHING</option>
                              <option value="READY">READY</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="PAID">PAID</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select 
                              className={`text-xs border rounded px-2 py-1 w-full max-w-[130px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                              value={orderDrivers[order.order_id] || order.assigned_driver_id || ''}
                              onChange={(e) => assignDriverToOrder(order.order_id, e.target.value)}
                            >
                              <option value="">No driver</option>
                              {drivers.map(d => (
                                <option key={d.user_id} value={d.user_id}>
                                  {d.full_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              <button 
                                onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleDeleteOrder(order.order_id)}
                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ---------- USERS TAB ---------- */}
        {activeTab === 'users' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6 overflow-x-auto`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="w-5 h-5" /> All Users ({users.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setShowAddUserModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Add User
                </button>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  className={`px-3 py-2 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <select 
                  className={`px-3 py-2 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="DRIVER">Driver</option>
                </select>
              </div>
            </div>
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="p-3 text-left text-xs font-medium uppercase">ID</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Name</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Email</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Phone</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Role</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.user_id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <td className="p-3 text-sm">#{u.user_id}</td>
                    <td className="p-3 text-sm font-medium">{u.full_name}</td>
                    <td className="p-3 text-sm">{u.email}</td>
                    <td className="p-3 text-sm">{u.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'DRIVER' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {u.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handleDeleteUser(u.user_id, u.full_name)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition">
                          Delete
                        </button>
                      )}
                      {u.role === 'ADMIN' && <span className="text-xs text-gray-400">Protected</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- PAYMENTS TAB ---------- */}
        {activeTab === 'payments' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6 overflow-x-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> All Payments ({payments.length})
              </h3>
              <button onClick={() => setShowPaymentModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Coins className="w-4 h-4" /> Cash Payment
              </button>
            </div>
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="p-3 text-left text-xs font-medium uppercase">ID</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Order</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Amount</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Method</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.payment_id} className={`border-t ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <td className="p-3 text-sm">#{p.payment_id}</td>
                    <td className="p-3 text-sm">#{p.order_id}</td>
                    <td className="p-3 text-sm font-semibold">{settings.currency} {p.amount}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${p.payment_method === 'CASH' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {p.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${p.payment_status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.payment_status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{new Date(p.paid_at || p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- FEEDBACK TAB ---------- */}
        {activeTab === 'feedback' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Customer Feedback ({feedback.length})
            </h3>
            <div className="space-y-4">
              {feedback.map(f => (
                <div key={f.feedback_id || f.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">({f.rating || 5}/5)</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{f.comment || 'No comment provided'}</p>
                      <p className="text-xs text-gray-400 mt-1">Order #{f.order_id} - {new Date(f.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">Customer #{f.customer_id}</span>
                    </div>
                  </div>
                </div>
              ))}
              {feedback.length === 0 && <p className="text-center opacity-70 py-8">No feedback yet.</p>}
            </div>
          </div>
        )}

        {/* ---------- COMPLAINTS TAB ---------- */}
        {activeTab === 'complaints' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Customer Complaints ({complaints.length})
            </h3>
            <div className="space-y-4">
              {complaints.map(c => (
                <div key={c.complaint_id || c.id} className={`p-4 rounded-xl border ${c.status === 'RESOLVED' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{c.order_id} - {c.customer_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.message}</p>
                      {c.reply && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Reply: {c.reply}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status || 'PENDING'}
                      </span>
                      {c.status !== 'RESOLVED' && (
                        <button onClick={() => { setSelectedComplaint(c); setShowComplaintModal(true); }} className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                          Reply & Resolve
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(c.created_at).toLocaleString()}</p>
                </div>
              ))}
              {complaints.length === 0 && <p className="text-center opacity-70 py-8">No complaints found.</p>}
            </div>
          </div>
        )}

        {/* ---------- SERVICES TAB ---------- */}
        {activeTab === 'services' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-5 h-5" /> Services ({services.length})
              </h3>
              <button onClick={() => { setEditingService(null); setNewService({ name: '', description: '', price_per_kg: '', category: 'WASH' }); setShowServiceModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s.service_id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{s.service_name || s.name}</h4>
                      <p className="text-sm text-gray-500">{s.description}</p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">
                        {settings.currency} {s.price_per_kg || 0}
                      </p>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full mt-1 inline-block">{s.category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingService(s); setNewService({ name: s.service_name || s.name, description: s.description, price_per_kg: s.price_per_kg || '', category: s.category }); setShowServiceModal(true); }} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Edit</button>
                      <button onClick={() => handleDeleteService(s.service_id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && <p className="col-span-3 text-center opacity-70 py-8">No services defined.</p>}
            </div>
          </div>
        )}

        {/* ---------- DRIVERS TAB ---------- */}
        {activeTab === 'drivers' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6 overflow-x-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Truck className="w-5 h-5" /> Driver Performance
              </h3>
              <button onClick={() => setShowAddDriverModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                <UserCog className="w-4 h-4" /> Add Driver
              </button>
            </div>
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="p-3 text-left text-xs font-medium uppercase">Name</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Orders</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Rating</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">On-Time</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Revenue</th>
                  <th className="p-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {driverPerformance.map((d, i) => (
                  <tr key={i} className={`border-t ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <td className="p-3 text-sm font-medium">{d.name}</td>
                    <td className="p-3 text-sm">{d.orders}</td>
                    <td className="p-3 text-sm text-yellow-500 flex items-center gap-1">{d.rating} <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /></td>
                    <td className="p-3 text-sm">{d.onTime} min avg</td>
                    <td className="p-3 text-sm font-semibold text-green-600">{settings.currency} {d.revenue}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <button 
                          onClick={() => {
                            setSelectedDriver(d)
                            setShowDriverModal(true)
                          }}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(d.user_id, d.name)}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- SETTINGS TAB ---------- */}
        {activeTab === 'settings' && (
          <div className={`${getCardTheme()} rounded-2xl shadow-sm border p-6`}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" /> Business Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Store Name</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.store_name} onChange={(e) => setSettings({...settings, store_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.store_address} onChange={(e) => setSettings({...settings, store_address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.contact_phone} onChange={(e) => setSettings({...settings, contact_phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Fee</label>
                  <input type="number" className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.pickup_fee} onChange={(e) => setSettings({...settings, pickup_fee: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Fee</label>
                  <input type="number" className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.delivery_fee} onChange={(e) => setSettings({...settings, delivery_fee: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Paybill Number</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.paybill_number} onChange={(e) => setSettings({...settings, paybill_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Till Number</label>
                  <input className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} value={settings.till_number} onChange={(e) => setSettings({...settings, till_number: e.target.value})} />
                </div>
                <button onClick={async () => {
                  try {
                    const token = localStorage.getItem('token')
                    await axios.put(`${API_URL}/settings`, settings, { headers: { Authorization: `Bearer ${token}` } }) // ✅ fixed
                    toast.success('Settings saved successfully')
                  } catch (error) {
                    toast.error('Failed to save settings')
                  }
                }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- MODALS ---------- */}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Order #{selectedOrder.order_id}</h3>
                <button onClick={() => setShowOrderModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium dark:text-white">
                    {users.find(u => u.user_id === selectedOrder.user_id)?.full_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {users.find(u => u.user_id === selectedOrder.user_id)?.email || ''}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {users.find(u => u.user_id === selectedOrder.user_id)?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium dark:text-white">
                    {selectedOrder.service_name || 
                     (selectedOrder.service_id && services.find(s => s.id === selectedOrder.service_id)?.name) || 
                     'N/A'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedOrder.items || selectedOrder.description || selectedOrder.service_description || ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {settings.currency} {selectedOrder.total_price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium dark:text-white">{selectedOrder.total_weight || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium dark:text-white">
                    {(() => {
                      const driverId = selectedOrder.assigned_driver_id || orderDrivers[selectedOrder.order_id]
                      return drivers.find(d => d.user_id === driverId)?.full_name || 'Not assigned'
                    })()}
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mb-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Addresses
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm dark:text-white">{selectedOrder.pickup_address || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Delivery</p>
                    <p className="text-sm dark:text-white">{selectedOrder.delivery_address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Order Timeline
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-gray-500">Created</span>
                    <span className="dark:text-white">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                  {selectedOrder.actual_pickup_time && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-24 text-gray-500">Picked Up</span>
                      <span className="dark:text-white">{new Date(selectedOrder.actual_pickup_time).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedOrder.actual_delivery_time && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-24 text-gray-500">Delivered</span>
                      <span className="dark:text-white">{new Date(selectedOrder.actual_delivery_time).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t dark:border-gray-700">
                <button onClick={() => setShowOrderModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">My Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="w-24 h-24 rounded-full bg-blue-500 text-white text-4xl flex items-center justify-center mx-auto overflow-hidden">
                      {profileImage || profile.profile_picture ? (
                        <img src={profileImage || profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : profile.full_name?.charAt(0) || 'A'}
                    </div>
                    <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition">
                      <Camera className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => setProfileImage(ev.target.result)
                        reader.readAsDataURL(file)
                      }
                    }} accept="image/*" className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" rows="3" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                <button onClick={updateProfile} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Profile</button>
                <button onClick={() => setShowProfileModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* M-Pesa Modal */}
        {showMpesaModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">M-Pesa Payment</h3>
                <button onClick={() => setShowMpesaModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleMpesaPayment}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order ID</label><input type="number" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={mpesaPayment.order_id} onChange={(e) => setMpesaPayment({...mpesaPayment, order_id: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label><input type="tel" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="0712345678" value={mpesaPayment.phone} onChange={(e) => setMpesaPayment({...mpesaPayment, phone: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ({settings.currency})</label><input type="number" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={mpesaPayment.amount} onChange={(e) => setMpesaPayment({...mpesaPayment, amount: e.target.value})} required /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                  <button type="submit" disabled={mpesaLoading} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {mpesaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {mpesaLoading ? 'Sending...' : 'Send Prompt'}
                  </button>
                  <button type="button" onClick={() => setShowMpesaModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cash Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Record Cash Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCashPayment}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order ID</label><input type="number" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={cashPayment.order_id} onChange={(e) => setCashPayment({...cashPayment, order_id: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ({settings.currency})</label><input type="number" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={cashPayment.amount} onChange={(e) => setCashPayment({...cashPayment, amount: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label><input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={cashPayment.customer_name} onChange={(e) => setCashPayment({...cashPayment, customer_name: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input type="tel" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={cashPayment.phone} onChange={(e) => setCashPayment({...cashPayment, phone: e.target.value})} placeholder="0712345678" /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Coins className="w-4 h-4" /> Record Payment
                  </button>
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Add New User</h3>
                <button onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input type="tel" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} placeholder="0712345678" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                      <option value="CUSTOMER">Customer</option>
                      <option value="DRIVER">Driver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Add User
                  </button>
                  <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Driver Modal */}
        {showAddDriverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Add New Driver</h3>
                <button onClick={() => setShowAddDriverModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddDriver}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newDriver.full_name} onChange={(e) => setNewDriver({...newDriver, full_name: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newDriver.email} onChange={(e) => setNewDriver({...newDriver, email: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input type="tel" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} placeholder="0712345678" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newDriver.password} onChange={(e) => setNewDriver({...newDriver, password: e.target.value})} required /></div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-300 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Driver will be able to accept and deliver orders
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                  <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                    <UserCog className="w-4 h-4" /> Add Driver
                  </button>
                  <button type="button" onClick={() => setShowAddDriverModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setShowServiceModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddService}>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input type="text" className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} rows="2" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ({settings.currency})</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" 
                      value={newService.price_per_kg} 
                      onChange={(e) => setNewService({...newService, price_per_kg: e.target.value})} 
                      required 
                    />
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})}>
                      <option value="WASH">Wash</option>
                      <option value="DRY_CLEAN">Dry Clean</option>
                      <option value="IRON">Iron</option>
                      <option value="EXPRESS">Express</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Package className="w-4 h-4" /> {editingService ? 'Update' : 'Add'} Service
                  </button>
                  <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaint Reply Modal */}
        {showComplaintModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Reply to Complaint</h3>
                <button onClick={() => setShowComplaintModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer: {selectedComplaint.customer_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedComplaint.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Reply</label>
                  <textarea className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" rows="4" value={complaintReply} onChange={(e) => setComplaintReply(e.target.value)} placeholder="Write your response..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                <button onClick={handleComplaintReply} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Send Reply & Resolve
                </button>
                <button onClick={() => setShowComplaintModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- DRIVER DETAILS MODAL ---------- */}
        {showDriverModal && selectedDriver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold dark:text-white">Driver Details</h3>
                <button onClick={() => { setShowDriverModal(false); setSelectedDriver(null); }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b dark:border-gray-700 pb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl flex items-center justify-center">
                    {selectedDriver.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold dark:text-white">{selectedDriver.name || selectedDriver.full_name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDriver.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDriver.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedDriver.orders || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{selectedDriver.rating || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedDriver.onTime || 0} min</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg On-Time</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{settings.currency} {selectedDriver.revenue || 0}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                  </div>
                </div>
                {selectedDriver.bio && (
                  <div className="border-t dark:border-gray-700 pt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDriver.bio}</p>
                  </div>
                )}
                <div className="border-t dark:border-gray-700 pt-3">
                  <p className="text-xs text-gray-400">User ID: {selectedDriver.user_id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t dark:border-gray-700">
                <button onClick={() => { setShowDriverModal(false); setSelectedDriver(null); }} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}