'use client'

import { useState } from 'react'
import { Settings, Save, Scissors } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState({
    salonName: 'Hair Ahmedabad',
    email: 'admin@hairahmedabad.com',
    phone: '+91 98765 00000',
    address: 'Ahmedabad, Gujarat, India',
    gst: '24ABCDE1234F1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    openTime: '09:00',
    closeTime: '20:00',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Settings size={20} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-salon-400 to-salon-600 flex items-center justify-center">
            <Scissors size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Salon Profile</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Basic information about your salon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Salon Name',  key: 'salonName', placeholder: 'Hair Ahmedabad'      },
            { label: 'Email',       key: 'email',     placeholder: 'admin@salon.com'      },
            { label: 'Phone',       key: 'phone',     placeholder: '+91 98765 00000'       },
            { label: 'GST Number',  key: 'gst',       placeholder: '24ABCDE1234F1Z5'      },
            { label: 'Open Time',   key: 'openTime',  placeholder: '09:00', type: 'time'  },
            { label: 'Close Time',  key: 'closeTime', placeholder: '20:00', type: 'time'  },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
              <input type={type || 'text'} placeholder={placeholder} value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Address</label>
            <input placeholder="Salon address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-900 text-white text-sm font-semibold transition">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
