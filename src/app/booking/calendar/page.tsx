'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Scissors } from 'lucide-react'

const STAFF = [
  { id: 1, name: 'Priya Kumar', color: '#7c3aed' },
  { id: 2, name: 'Rahul Verma', color: '#0ea5e9' },
  { id: 3, name: 'Sonal Patel', color: '#10b981' },
  { id: 4, name: 'Ritu Joshi',  color: '#f59e0b' },
]

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9)

const MOCK_BOOKINGS = [
  { id: 1, staffId: 1, hour: 9, duration: 1, client: 'Anjali Sharma', service: 'Haircut', phone: '+91 98765 43210' },
  { id: 2, staffId: 1, hour: 11, duration: 1.5, client: 'Priya Gupta', service: 'Cut + Color', phone: '+91 98765 43211' },
  { id: 3, staffId: 2, hour: 10, duration: 1.5, client: 'Rahul Singh', service: 'Hair Coloring', phone: '+91 98765 43212' },
  { id: 4, staffId: 3, hour: 14, duration: 0.75, client: 'Neha Patel', service: 'Manicure', phone: '+91 98765 43213' },
  { id: 5, staffId: 3, hour: 15, duration: 0.75, client: 'Sonal Kumar', service: 'Pedicure', phone: '+91 98765 43214' },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-violet-500" />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Calendar View</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg transition"
            style={{ border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: 'var(--hover)', color: 'var(--text-primary)' }}>
            {formatDate(selectedDate)}
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg transition"
            style={{ border: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ background: 'var(--hover)', color: 'var(--text-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--hover)')}
          >
            Today
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-5 divide-x" style={{ borderColor: 'var(--border)' }}>
          <div className="col-span-1" style={{ background: 'var(--hover)' }}>
            <div className="h-12 flex items-center justify-center font-semibold text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
              Time
            </div>
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-20 flex items-center justify-center text-xs font-semibold"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {STAFF.map(staff => (
            <div key={staff.id} className="col-span-1 relative">
              <div
                className="h-12 flex items-center justify-center gap-2 font-semibold text-xs"
                style={{ borderBottom: '1px solid var(--border)', background: `${staff.color}10` }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: staff.color }}>
                  {staff.name.charAt(0)}
                </div>
                <span style={{ color: staff.color }}>{staff.name.split(' ')[0]}</span>
              </div>
              <div className="relative">
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="h-20 transition cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  />
                ))}
                {MOCK_BOOKINGS.filter(b => b.staffId === staff.id).map(booking => (
                  <button
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="absolute left-1 right-1 rounded-lg p-2 text-left transition-all"
                    style={{
                      top: `${(booking.hour - 9) * 80 + 12}px`,
                      height: `${booking.duration * 80 - 4}px`,
                      background: `${staff.color}20`,
                      border: `1.5px solid ${staff.color}`,
                      zIndex: 10,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div className="text-[11px] font-bold truncate" style={{ color: staff.color }}>
                      {booking.client}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      <Scissors size={9} />
                      {booking.service}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      <Clock size={9} />
                      {booking.hour}:00 · {booking.duration}h
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="rounded-2xl p-6 max-w-md w-full mx-4 space-y-4"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition"
                style={{ background: 'var(--hover)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--hover)')}
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={16} className="text-violet-500" />
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Client</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedBooking.client}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Scissors size={16} className="text-violet-500" />
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Service</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedBooking.service}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-violet-500" />
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Time</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedBooking.hour}:00 ({selectedBooking.duration}h)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: STAFF.find(s => s.id === selectedBooking.staffId)?.color }} />
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Stylist</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {STAFF.find(s => s.id === selectedBooking.staffId)?.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition">
                Edit
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
