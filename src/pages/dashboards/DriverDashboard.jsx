import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import {
  User, Clock, CheckCircle, Package, MapPin, Phone, AlertTriangle,
  Star, Bell, Menu, X, Send, Camera, Navigation, TrendingUp,
  Fuel, BarChart, Flag, LogOut, MessageCircle, Award, Sun, Moon,
  Circle, Truck, Home, Sparkles, ArrowRight, Loader2,
} from 'lucide-react'

export default function DriverDashboard() {
  const { user } = useAuth()

  // ---------- STATE ----------
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, earnings: 0, rating: 4.8 })
  const [isDark, setIsDark] = useState(false)
  const [showChat, setShowChat] = useState(null) // orderId or null
  const [chatMessages, setChatMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [photoEvidence, setPhotoEvidence] = useState({}) // orderId -> image data URL
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order #102 assigned to you', time: '2 min ago', read: false },
    { id: 2, message: 'Customer gave you 5 stars!', time: '10 min ago', read: false },
  ])
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [time, setTime] = useState('')
  const [greeting, setGreeting] = useState('')

  const profileMenuRef = useRef(null)
  const notifRef = useRef(null)

  // ---------- EFFECTS ----------
  useEffect(() => {
    fetchAssignedOrders()
    updateTimeAndGreeting()
    const timer = setInterval(updateTimeAndGreeting, 60000)

    const handleOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target))
        setShowProfileMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotif(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => {
      clearInterval(timer)
      document.removeEventListener('mousedown', handleOutside)
    }
  }, [])

  // ---------- HELPERS ----------
  const updateTimeAndGreeting = () => {
    const now = new Date()
    const hrs = now.getHours()
    let greet = 'Good Morning'
    if (hrs >= 12 && hrs < 17) greet = 'Good Afternoon'
    else if (hrs >= 17) greet = 'Good Evening'
    setGreeting(greet)
    setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
  }

  // ---------- API CALLS (MOCK) ----------
  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8088/driver/${user?.user_id}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = response.data.data || []
      setOrders(data)
      setStats(prev => ({
        ...prev,
        total: data.length,
        completed: data.filter(o => o.status === 'DELIVERED').length,
        earnings: data.reduce((sum, o) => sum + (o.price || 0), 0)
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
      const mockOrders = [
        { id: 102, customer: 'Alice', address: '123 Main St, Nairobi', status: 'PENDING', priority: 'high', price: 350, items: '3 kg laundry', distance: '1.2 km' },
        { id: 105, customer: 'Bob', address: '456 Oak Ave, Nairobi', status: 'ASSIGNED', priority: 'medium', price: 200, items: '2 shirts, 1 dress', distance: '3.5 km' },
        { id: 108, customer: 'Carol', address: '789 Pine Rd, Nairobi', status: 'PICKED_UP', priority: 'low', price: 450, items: '5 kg mixed', distance: '0.8 km' },
        { id: 110, customer: 'David', address: '321 Elm St, Nairobi', status: 'DELIVERED', priority: 'low', price: 300, items: 'dry cleaning', distance: '2.0 km' },
      ]
      setOrders(mockOrders)
      setStats({ total: mockOrders.length, completed: mockOrders.filter(o => o.status === 'DELIVERED').length, earnings: 1300, rating: 4.8 })
    }
  }

  // ---------- ACTION HANDLERS ----------
  const handleAccept = (orderId) => {
    toast.success(`Order #${orderId} accepted!`)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ACCEPTED' } : o))
  }

  const handlePickup = (orderId) => {
    toast.success(`Order #${orderId} picked up.`)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'PICKED_UP' } : o))
  }

  const handleDeliver = (orderId) => {
    toast.success(`Order #${orderId} delivered! +Ksh ${orders.find(o => o.id === orderId)?.price || 0}`)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DELIVERED' } : o))
    setStats(prev => ({ ...prev, completed: prev.completed + 1, earnings: prev.earnings + (orders.find(o => o.id === orderId)?.price || 0) }))
  }

  // Chat
  const openChat = (orderId) => {
    if (!chatMessages[orderId]) {
      setChatMessages(prev => ({
        ...prev,
        [orderId]: [
          { sender: 'customer', text: `Hi! I'm the customer for order #${orderId}. Let me know when you're on the way.`, time: '10:00 AM' }
        ]
      }))
    }
    setShowChat(orderId)
  }

  const sendMessage = (orderId) => {
    if (!newMessage.trim()) return
    setChatMessages(prev => ({
      ...prev,
      [orderId]: [
        ...(prev[orderId] || []),
        { sender: 'driver', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    }))
    setNewMessage('')
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [orderId]: [
          ...(prev[orderId] || []),
          { sender: 'customer', text: 'Thanks! I appreciate the update.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }))
    }, 1500)
  }

  // Photo Evidence
  const handlePhotoUpload = (e, orderId) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoEvidence(prev => ({ ...prev, [orderId]: event.target.result }))
      toast.success(`Photo added for order #${orderId}`)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = (orderId) => {
    setPhotoEvidence(prev => {
      const newState = { ...prev }
      delete newState[orderId]
      return newState
    })
    toast('Photo removed')
  }

  // ---------- UI HELPERS ----------
  const statusColor = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800'
    }
    return map[status] || 'bg-gray-100 text-gray-800'
  }

  const priorityColor = (p) => {
    const map = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' }
    return map[p] || 'bg-gray-400'
  }

  const getNextAction = (order) => {
    if (order.status === 'PENDING') return { label: 'Accept', handler: handleAccept, color: 'bg-blue-600' }
    if (order.status === 'ACCEPTED') return { label: 'Mark Picked Up', handler: handlePickup, color: 'bg-purple-600' }
    if (order.status === 'PICKED_UP') return { label: 'Deliver', handler: handleDeliver, color: 'bg-green-600' }
    return null
  }

  // ---------- RENDER ----------
  const containerBg = isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'

  return (
    <div className={`min-h-screen ${containerBg} transition-colors duration-300 pb-20 md:pb-0`}>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ---------- HEADER ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {greeting}, {user?.full_name?.split(' ')[0] || 'Driver'} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-sm opacity-70 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {time}
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Online</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>
                    <button onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} className="text-xs text-blue-500">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500">All caught up!</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded-lg text-sm ${n.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                          <p>{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-white transition"
              >
                {user?.full_name?.charAt(0) || 'D'}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm flex items-center gap-2">
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> Performance
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition text-sm flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- STATS CARDS ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${cardBg} rounded-xl p-4 shadow-sm border`}>
            <p className="text-2xl font-bold text-blue-600">Ksh {stats.earnings}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Today's Earnings</p>
          </div>
          <div className={`${cardBg} rounded-xl p-4 shadow-sm border`}>
            <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1"><Package className="w-4 h-4" /> Total Orders</p>
          </div>
          <div className={`${cardBg} rounded-xl p-4 shadow-sm border`}>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Completed</p>
          </div>
          <div className={`${cardBg} rounded-xl p-4 shadow-sm border`}>
            <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">{stats.rating} <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /></p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
        </div>

        {/* ---------- TODAY'S ROUTE (MAP PLACEHOLDER) ---------- */}
        <div className={`${cardBg} rounded-xl shadow-sm border p-4`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold flex items-center gap-2"><MapPin className="w-5 h-5" /> Today's Route</h3>
            <span className="text-xs text-blue-500">Optimized • {orders.filter(o => o.status !== 'DELIVERED').length} stops</span>
          </div>
          <div className="relative bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden h-48 md:h-64">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400" />
                <span className="text-sm">Map integration (Google Maps / Leaflet)</span>
                <p className="text-xs text-gray-400 mt-1">Route: {orders.filter(o => o.status !== 'DELIVERED').map(o => `#${o.id}`).join(' → ')}</p>
              </div>
            </div>
            {/* Animated car marker */}
            <div className="absolute top-1/4 left-1/3 animate-pulse text-2xl">🚗</div>
          </div>
        </div>

        {/* ---------- ASSIGNED ORDERS LIST ---------- */}
        <div className={`${cardBg} rounded-xl shadow-sm border p-4`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2"><Package className="w-5 h-5" /> Assigned Orders ({orders.length})</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {orders.filter(o => o.status !== 'DELIVERED').length} active
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p>No orders assigned yet. Check back later.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const nextAction = getNextAction(order)
                return (
                  <div
                    key={order.id}
                    className="flex flex-col lg:flex-row lg:items-start justify-between p-4 border rounded-xl hover:shadow-md transition bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700"
                  >
                    {/* Left: Order details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start gap-3">
                        <Circle className={`w-4 h-4 mt-1 rounded-full ${priorityColor(order.priority)}`} />
                        <div>
                          <p className="font-medium text-sm">
                            Order #{order.id} – {order.customer}
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">{order.address} • {order.distance}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Package className="w-3 h-3" /> {order.items} • Ksh {order.price}</p>
                        </div>
                      </div>

                      {/* Photo evidence preview */}
                      {photoEvidence[order.id] && (
                        <div className="flex items-center gap-2 mt-1">
                          <img src={photoEvidence[order.id]} alt="Evidence" className="w-16 h-16 object-cover rounded border" />
                          <button onClick={() => removePhoto(order.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 lg:mt-0">
                      {/* Chat button */}
                      <button
                        onClick={() => openChat(order.id)}
                        className="text-sm bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" /> Chat
                      </button>

                      {/* Photo upload */}
                      <label className="text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1">
                        <Camera className="w-4 h-4" /> Photo
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, order.id)}
                        />
                      </label>

                      {/* Next action button (Accept / Pickup / Deliver) */}
                      {nextAction && (
                        <button
                          onClick={() => nextAction.handler(order.id)}
                          className={`text-sm text-white ${nextAction.color} hover:brightness-110 px-4 py-1.5 rounded-lg transition`}
                        >
                          {nextAction.label}
                        </button>
                      )}

                      {/* Navigate button */}
                      <button className="text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                        <Navigation className="w-4 h-4" /> Navigate
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ---------- CHAT MODAL ---------- */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Chat – Order #{showChat}</h4>
                <button onClick={() => setShowChat(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-60">
                {(chatMessages[showChat] || []).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'driver' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t dark:border-gray-700 pt-3">
                <input
                  type="text"
                  className="flex-1 p-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(showChat)}
                />
                <button
                  onClick={() => sendMessage(showChat)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-1"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- BOTTOM ROW: TIPS & QUICK LINKS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${cardBg} rounded-xl shadow-sm border p-4`}>
            <h4 className="font-bold mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Pro Tips</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <CloudRain className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Rain forecast at 4 PM – carry extra covers for laundry.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>You're 2 deliveries away from a Ksh 100 bonus.</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Peak demand in Westlands in 30 min – reposition for more orders.</span>
              </li>
            </ul>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm border p-4`}>
            <h4 className="font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5" /> Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-3 rounded-lg text-sm transition flex flex-col items-center">
                <Phone className="w-6 h-6 text-blue-600" />
                <span className="mt-1">Call Support</span>
              </button>
              <button className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 p-3 rounded-lg text-sm transition flex flex-col items-center">
                <Fuel className="w-6 h-6 text-green-600" />
                <span className="mt-1">Nearest Fuel</span>
              </button>
              <button className="bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 p-3 rounded-lg text-sm transition flex flex-col items-center">
                <BarChart className="w-6 h-6 text-yellow-600" />
                <span className="mt-1">My Stats</span>
              </button>
              <button className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 p-3 rounded-lg text-sm transition flex flex-col items-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="mt-1">Report Issue</span>
              </button>
            </div>
          </div>
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-400">
          <span>© 2026 Laundry App – Driver v2.0</span>
          <button onClick={() => toast('Logging out...')} className="hover:text-red-500 transition flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

      </div>
    </div>
  )
}