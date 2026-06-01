'use client'

import { useState } from 'react'
import { Save, Building, Clock, Bell, Shield, Palette } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useThemeStore } from '@/store/themeStore'
import api from '@/lib/api'

type SettingsTab = 'general' | 'hours' | 'notifications' | 'security' | 'appearance'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const [generalSettings, setGeneralSettings] = useState({
    salonName: 'Hair Ahmedabad',
    address: 'Ahmedabad, Gujarat, India',
    phone: '',
    email: 'admin@hairahmedabad.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  })

  const [businessHours, setBusinessHours] = useState(
    DAYS.map(day => ({
      day,
      isOpen: day !== 'Sunday',
      openTime: '09:00',
      closeTime: '20:00',
    }))
  )

  const [notificationSettings, setNotificationSettings] = useState({
    bookingConfirmation: true,
    appointmentReminder: true,
    birthdayGreeting: true,
    paymentReceipt: true,
    reminderHours: 24,
    whatsappEnabled: false,
    whatsappApiKey: '',
  })

  const saveSettings = async (data: any, endpoint: string) => {
    setLoading(true)
    try {
      await api.put(`/settings/${endpoint}`, data)
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your salon system</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSuccess('') }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="flex-1">
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
            </div>
          )}

          {activeTab === 'general' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h2>
              <div className="space-y-4">
                <Input label="Salon Name" value={generalSettings.salonName} onChange={e => setGeneralSettings({ ...generalSettings, salonName: e.target.value })} required />
                <Input label="Address" value={generalSettings.address} onChange={e => setGeneralSettings({ ...generalSettings, address: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" type="tel" value={generalSettings.phone} onChange={e => setGeneralSettings({ ...generalSettings, phone: e.target.value })} />
                  <Input label="Email" type="email" value={generalSettings.email} onChange={e => setGeneralSettings({ ...generalSettings, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select value={generalSettings.currency} onChange={e => setGeneralSettings({ ...generalSettings, currency: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select value={generalSettings.timezone} onChange={e => setGeneralSettings({ ...generalSettings, timezone: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
                <Button onClick={() => saveSettings(generalSettings, 'general')} isLoading={loading}>
                  <Save size={20} className="mr-2" />Save Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'hours' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Business Hours</h2>
              <div className="space-y-3">
                {businessHours.map((hours, index) => (
                  <div key={hours.day} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="w-28 font-medium text-gray-900 dark:text-white text-sm">{hours.day}</div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={e => {
                          const updated = [...businessHours]
                          updated[index] = { ...hours, isOpen: e.target.checked }
                          setBusinessHours(updated)
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
                    </label>
                    {hours.isOpen && (
                      <>
                        <input
                          type="time"
                          value={hours.openTime}
                          onChange={e => {
                            const updated = [...businessHours]
                            updated[index] = { ...hours, openTime: e.target.value }
                            setBusinessHours(updated)
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <span className="text-gray-500">–</span>
                        <input
                          type="time"
                          value={hours.closeTime}
                          onChange={e => {
                            const updated = [...businessHours]
                            updated[index] = { ...hours, closeTime: e.target.value }
                            setBusinessHours(updated)
                          }}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                      </>
                    )}
                    {!hours.isOpen && <span className="text-sm text-gray-400">Closed</span>}
                  </div>
                ))}
                <Button onClick={() => saveSettings(businessHours, 'hours')} isLoading={loading}>
                  <Save size={20} className="mr-2" />Save Hours
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { key: 'bookingConfirmation', label: 'Booking Confirmation', desc: 'Send confirmation when booking is created' },
                  { key: 'appointmentReminder', label: 'Appointment Reminder', desc: 'Remind customers before their appointment' },
                  { key: 'birthdayGreeting', label: 'Birthday Greeting', desc: 'Send birthday wishes to customers' },
                  { key: 'paymentReceipt', label: 'Payment Receipt', desc: 'Send receipt after payment' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                        onChange={e => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="font-semibold text-gray-900 dark:text-white mb-3">WhatsApp Integration</div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Enable WhatsApp notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationSettings.whatsappEnabled} onChange={e => setNotificationSettings({ ...notificationSettings, whatsappEnabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                  {notificationSettings.whatsappEnabled && (
                    <Input label="WhatsApp API Key" value={notificationSettings.whatsappApiKey} onChange={e => setNotificationSettings({ ...notificationSettings, whatsappApiKey: e.target.value })} placeholder="Enter your WhatsApp Business API key" type="password" />
                  )}
                </div>

                <Button onClick={() => saveSettings(notificationSettings, 'notifications')} isLoading={loading}>
                  <Save size={20} className="mr-2" />Save Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: false },
                  { label: 'Session Timeout', desc: 'Automatically log out after inactivity', enabled: true },
                  { label: 'Login Notifications', desc: 'Get notified of new login attempts', enabled: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['light', 'dark'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          theme === t
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg mb-3 ${t === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-900'}`} />
                        <div className="font-semibold text-gray-900 dark:text-white capitalize">{t} Mode</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
