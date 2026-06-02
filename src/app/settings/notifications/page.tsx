'use client'

import { useState } from 'react'
import { Bell, Save } from 'lucide-react'

const notifSettings = [
  { key: 'newBooking',    label: 'New Booking',       sub: 'Get notified when a new appointment is scheduled'  },
  { key: 'cancellation',  label: 'Cancellation',      sub: 'Get notified when an appointment is cancelled'     },
  { key: 'payment',       label: 'Payment Received',  sub: 'Get notified when a payment is completed'          },
  { key: 'lowStock',      label: 'Low Stock Alert',   sub: 'Get notified when inventory is running low'        },
  { key: 'newReview',     label: 'New Review',        sub: 'Get notified when a client leaves a review'        },
  { key: 'whatsapp',      label: 'WhatsApp Updates',  sub: 'Send booking confirmations via WhatsApp'           },
]

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    newBooking: true, cancellation: true, payment: true, lowStock: true, newReview: false, whatsapp: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Bell size={20} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
          Notification preferences saved.
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
        {notifSettings.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
            </div>
            <button type="button" onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings[key] ? 'bg-salon-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-900 text-white text-sm font-semibold transition">
          <Save size={15} /> Save Preferences
        </button>
      </div>
    </div>
  )
}
