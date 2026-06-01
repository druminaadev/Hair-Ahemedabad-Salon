'use client'

import { useState } from 'react'
import { ShoppingBag, CalendarCheck, CalendarDays, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'

const NewBooking = dynamic(() => import('./new/page'), { ssr: false })
const POSBooking = dynamic(() => import('./pos/page'), { ssr: false })
const CalendarView = dynamic(() => import('./calendar/page'), { ssr: false })

const TABS = [
  {
    key: 'schedule',
    label: 'Schedule Booking',
    sub: 'Book future appointments',
    icon: CalendarCheck,
    color: '#971549',
    bg: 'from-salon-400 to-salon-600',
  },
  {
    key: 'walkin',
    label: 'Walk-in / POS',
    sub: 'Instant billing at counter',
    icon: ShoppingBag,
    color: '#CF455C',
    bg: 'from-salon-400 to-salon-900',
  },
  {
    key: 'calendar',
    label: 'Calendar View',
    sub: 'Stylist-wise schedule',
    icon: CalendarDays,
    color: '#10b981',
    bg: 'from-emerald-500 to-green-600',
  },
] as const

type BookingTab = (typeof TABS)[number]['key']

export default function BookingPage() {
  const [tab, setTab] = useState<BookingTab>('schedule')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Booking</h1>
      </div>

      <div className="grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
        {TABS.map((item) => {
          const active = tab === item.key
          const Icon = item.icon

          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`relative flex flex-col items-start gap-1.5 overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 ${
                active
                  ? ''
                  : 'border-2 border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'
              }`}
              style={{
                border: active ? `2px solid ${item.color}` : undefined,
                background: active ? `${item.color}10` : undefined,
                boxShadow: active ? `0 0 0 4px ${item.color}15` : 'none',
              }}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${item.bg}`}>
                <Icon size={16} />
              </div>
              <div>
                <div className={`text-sm font-bold ${active ? '' : 'text-gray-900 dark:text-white'}`} style={{ color: active ? item.color : undefined }}>
                  {item.label}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.sub}</div>
              </div>
              {active && <span className="absolute right-3 top-3 h-2 w-2 rounded-full" style={{ background: item.color }} />}
            </button>
          )
        })}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {tab === 'schedule' && <NewBooking />}
      {tab === 'walkin' && <POSBooking />}
      {tab === 'calendar' && <CalendarView />}
    </div>
  )
}
