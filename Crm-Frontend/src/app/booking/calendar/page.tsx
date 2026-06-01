'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatTime } from '@/utils/helpers'
import api from '@/lib/api'
import type { Booking } from '@/types'

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week'>('day')

  useEffect(() => { fetchBookings() }, [currentDate, view])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const dateStr = currentDate.toISOString().split('T')[0]
      const params = view === 'day'
        ? `?date=${dateStr}`
        : `?dateFrom=${getWeekStart(currentDate).toISOString().split('T')[0]}&dateTo=${getWeekEnd(currentDate).toISOString().split('T')[0]}`
      const res = await api.get(`/bookings${params}`)
      setBookings(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date)
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  const getWeekDays = () => {
    const start = getWeekStart(currentDate)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }

  const navigate = (direction: 'prev' | 'next') => {
    const d = new Date(currentDate)
    if (view === 'day') {
      d.setDate(d.getDate() + (direction === 'next' ? 1 : -1))
    } else {
      d.setDate(d.getDate() + (direction === 'next' ? 7 : -7))
    }
    setCurrentDate(d)
  }

  const getBookingsForHour = (hour: number, date?: Date) => {
    const dateStr = (date || currentDate).toISOString().split('T')[0]
    return bookings.filter(b => {
      const bookingDate = b.date?.split('T')[0] || b.date
      const bookingHour = parseInt(b.startTime?.split(':')[0] || '0')
      return bookingDate === dateStr && bookingHour === hour
    })
  }

  const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    pending: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
    'in-progress': 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700',
    completed: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700',
    cancelled: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
  }

  const formatHeaderDate = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }
    const start = getWeekStart(currentDate)
    const end = getWeekEnd(currentDate)
    return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visual appointment schedule</p>
        </div>
        <Button onClick={() => window.location.href = '/booking/new'}>
          <Plus size={20} className="mr-2" />
          New Booking
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('prev')} className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{formatHeaderDate()}</h2>
            <button onClick={() => navigate('next')} className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
              <ChevronRight size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Today
            </button>
          </div>
          <div className="flex gap-2">
            {(['day', 'week'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all capitalize ${
                  view === v ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            {view === 'day' ? (
              <div className="min-w-[600px]">
                {HOURS.map(hour => {
                  const hourBookings = getBookingsForHour(hour)
                  return (
                    <div key={hour} className="flex border-b border-gray-100 dark:border-gray-800 min-h-[64px]">
                      <div className="w-20 flex-shrink-0 py-2 pr-4 text-right text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                      <div className="flex-1 py-1 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1">
                        {hourBookings.map(booking => (
                          <div
                            key={booking.id}
                            className={`p-2 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${statusColors[booking.status] || 'bg-gray-100 border-gray-300'}`}
                            onClick={() => window.location.href = `/booking/${booking.id}/edit`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User size={12} />
                              <span className="font-semibold text-gray-900 dark:text-white">{booking.customerName}</span>
                              <Badge status={booking.status}>{booking.status}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Clock size={12} />
                              <span>{formatTime(booking.startTime)} • {booking.staffName}</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 mt-1">
                              {booking.services.map(s => s.serviceName).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="min-w-[900px]">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <div className="w-20 flex-shrink-0" />
                  {getWeekDays().map(day => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    return (
                      <div key={day.toISOString()} className={`flex-1 text-center py-3 text-sm font-semibold border-l border-gray-200 dark:border-gray-700 ${isToday ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        <div>{day.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                        <div className={`text-lg font-bold ${isToday ? 'text-violet-600' : ''}`}>{day.getDate()}</div>
                      </div>
                    )
                  })}
                </div>
                {HOURS.map(hour => (
                  <div key={hour} className="flex border-b border-gray-100 dark:border-gray-800 min-h-[56px]">
                    <div className="w-20 flex-shrink-0 py-2 pr-4 text-right text-xs text-gray-500 dark:text-gray-400">
                      {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    {getWeekDays().map(day => {
                      const dayBookings = getBookingsForHour(hour, day)
                      const isToday = day.toDateString() === new Date().toDateString()
                      return (
                        <div key={day.toISOString()} className={`flex-1 py-1 px-1 border-l border-gray-200 dark:border-gray-700 space-y-1 ${isToday ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''}`}>
                          {dayBookings.map(booking => (
                            <div
                              key={booking.id}
                              className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border ${statusColors[booking.status] || 'bg-gray-100 border-gray-300'}`}
                              onClick={() => window.location.href = `/booking/${booking.id}/edit`}
                            >
                              <div className="font-semibold text-gray-900 dark:text-white truncate">{booking.customerName}</div>
                              <div className="text-gray-600 dark:text-gray-400">{formatTime(booking.startTime)}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries({ confirmed: 'Confirmed', pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed', cancelled: 'Cancelled' }).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full border ${statusColors[status]}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
