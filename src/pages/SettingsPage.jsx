import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'
import {
  Settings, Building, Phone, Mail, Clock, Package, DollarSign,
  MapPin, Truck, CreditCard, Bell, Shield, RefreshCw, Save,
  User, Key, Moon, Sun, Monitor, AlertTriangle, Wrench,
  Globe, Calendar, Percent, Ruler, ShoppingCart, HardDrive,
  MessageCircle, Smartphone, LogOut, Home, Briefcase, LifeBuoy
} from 'lucide-react'
// Social media icons from react-icons
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    store_name: 'Smart Laundry',
    store_address: 'Nairobi, Kenya',
    contact_phone: '+254 700 000 000',
    operating_hours: 'Mon-Fri: 7AM-8PM, Sat: 8AM-6PM, Sun: 9AM-4PM',
    pickup_fee: 100,
    delivery_fee: 150,
    theme: 'light',
    currency: 'Ksh',
    maintenance_mode: false,
    business_email: 'info@smartlaundry.com',
    facebook: '',
    instagram: '',
    twitter: '',
    pickup_slots: '8:00-10:00, 12:00-14:00, 16:00-18:00',
    delivery_slots: '10:00-12:00, 14:00-16:00, 18:00-20:00',
    service_radius: 10,
    min_order: 200,
    tax_rate: 0,
    notification_email: true,
    notification_sms: true,
    notification_push: false,
    enable_pickup_fee: true,
    enable_delivery_fee: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8088/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setSettings(response.data)
      }
      setLoading(false)
    } catch (error) {
      console.log('Settings fetch error:', error.message)
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put('http://localhost:8088/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Settings saved successfully!')
      setSaving(false)
    } catch (error) {
      toast.error('Failed to save settings')
      setSaving(false)
    }
  }

  const themes = [
    { name: 'Light', value: 'light', class: 'bg-gray-100' },
    { name: 'Dark', value: 'dark', class: 'bg-gray-800' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-200' },
    { name: 'Green', value: 'green', class: 'bg-green-200' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-200' },
  ]

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'services', label: 'Services & Pricing', icon: Package },
    { id: 'pickup', label: 'Pickup & Delivery', icon: Truck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: RefreshCw },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" /> Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your business settings and preferences.</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" /> General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.store_name} 
                  onChange={(e) => setSettings({...settings, store_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.contact_phone} 
                  onChange={(e) => setSettings({...settings, contact_phone: e.target.value})} 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.store_address} 
                  onChange={(e) => setSettings({...settings, store_address: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.business_email} 
                  onChange={(e) => setSettings({...settings, business_email: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.operating_hours} 
                  onChange={(e) => setSettings({...settings, operating_hours: e.target.value})} 
                />
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> Services & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.currency} 
                  onChange={(e) => setSettings({...settings, currency: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount ({settings.currency})</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.min_order} 
                  onChange={(e) => setSettings({...settings, min_order: parseFloat(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.tax_rate} 
                  onChange={(e) => setSettings({...settings, tax_rate: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
          </div>
        )}

        {/* PICKUP & DELIVERY TAB */}
        {activeTab === 'pickup' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" /> Pickup & Delivery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Fee ({settings.currency})</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.pickup_fee} 
                  onChange={(e) => setSettings({...settings, pickup_fee: parseFloat(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee ({settings.currency})</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.delivery_fee} 
                  onChange={(e) => setSettings({...settings, delivery_fee: parseFloat(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Radius (km)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.service_radius} 
                  onChange={(e) => setSettings({...settings, service_radius: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time Slots</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.pickup_slots} 
                  onChange={(e) => setSettings({...settings, pickup_slots: e.target.value})} 
                />
                <p className="text-xs text-gray-400 mt-1">Separate slots with commas</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time Slots</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={settings.delivery_slots} 
                  onChange={(e) => setSettings({...settings, delivery_slots: e.target.value})} 
                />
                <p className="text-xs text-gray-400 mt-1">Separate slots with commas</p>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Payment Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Enable Pickup Fee</p>
                  <p className="text-sm text-gray-400">Charge customers for pickup</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.enable_pickup_fee}
                    onChange={(e) => setSettings({...settings, enable_pickup_fee: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Enable Delivery Fee</p>
                  <p className="text-sm text-gray-400">Charge customers for delivery</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.enable_delivery_fee}
                    onChange={(e) => setSettings({...settings, enable_delivery_fee: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notification Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive order updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notification_email}
                    onChange={(e) => setSettings({...settings, notification_email: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">SMS Notifications</p>
                  <p className="text-sm text-gray-400">Receive order updates via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notification_sms}
                    onChange={(e) => setSettings({...settings, notification_sms: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">Push Notifications</p>
                  <p className="text-sm text-gray-400">Receive real-time mobile alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notification_push}
                    onChange={(e) => setSettings({...settings, notification_push: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security Settings
            </h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" className="w-full p-2 border rounded-lg" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" className="w-full p-2 border rounded-lg" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" className="w-full p-2 border rounded-lg" placeholder="Confirm new password" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Key className="w-4 h-4" /> Change Password
              </button>
            </div>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> System Settings
            </h3>
            
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Maintenance Mode</p>
                  <p className="text-sm text-gray-400">Temporarily disable customer access while you perform system updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Theme
              </label>
              <div className="flex gap-3">
                {themes.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setSettings({...settings, theme: t.value})}
                    className={`w-12 h-12 rounded-full border-2 transition flex items-center justify-center ${
                      settings.theme === t.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    } ${t.class}`}
                  >
                    <span className="sr-only">{t.name}</span>
                    {t.value === 'light' && <Sun className="w-5 h-5 text-gray-600" />}
                    {t.value === 'dark' && <Moon className="w-5 h-5 text-white" />}
                    {t.value === 'blue' && <span className="text-blue-700 text-sm font-bold">B</span>}
                    {t.value === 'green' && <span className="text-green-700 text-sm font-bold">G</span>}
                    {t.value === 'purple' && <span className="text-purple-700 text-sm font-bold">P</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaFacebook className="w-4 h-4 text-blue-600" /> Facebook
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="Facebook URL"
                  value={settings.facebook} 
                  onChange={(e) => setSettings({...settings, facebook: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaInstagram className="w-4 h-4 text-pink-600" /> Instagram
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="Instagram URL"
                  value={settings.instagram} 
                  onChange={(e) => setSettings({...settings, instagram: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTwitter className="w-4 h-4 text-blue-400" /> Twitter
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="Twitter URL"
                  value={settings.twitter} 
                  onChange={(e) => setSettings({...settings, twitter: e.target.value})} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}