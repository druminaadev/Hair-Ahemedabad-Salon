'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Calendar, Clock, Phone, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatCurrency, formatDate, formatTime, debounce } from '@/utils/helpers'
import api from '@/lib/api'
import type { Booking } from '@/types'

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter, dateFilter])

  const fetchBookings = async (search?: string) => {
    try {
      let params = '?'
      if (search) params += `search=${encodeURIComponent(search)}&`
      if (statusFilter !== 'all') params += `status=${statusFilter}&`
      if (dateFilter !== 'all') params += `date=${dateFilter}&`
      
      const response = await api.get(`/bookings${params}`)
      setBookings(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => {
    fetchBookings(value)
  }, 500)

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}`, { status })
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b))
    } catch (error) {
      console.error('Failed to update booking:', error)
      alert('Failed to update booking status')
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    
    try {
      await api.delete(`/bookings/${id}`)
      setBookings(bookings.filter(b => b.id !== id))
    } catch (error) {
      console.error('Failed to delete booking:', error)
      alert('Failed to delete booking')
    }
  }

  const getStatusActions = (booking: Booking) => {
    const actions = []
    
    if (booking.status === 'pending' || booking.status === 'confirmed') {
      actions.push({
        label: 'Start',
        status: 'in-progress',
        icon: Clock,
        color: 'text-blue-600',
      })
    }
    
    if (booking.status === 'in-progress') {
      actions.push({
        label: 'Complete',
        status: 'completed',
        icon: CheckCircle,
        color: 'text-emerald-600',
      })
    }
    
    if (booking.status !== 'completed' && booking.status !== 'cancelled') {
      actions.push({
        label: 'Cancel',
        status: 'cancelled',
        icon: XCircle,
        color: 'text-red-600',
      })
    }
    
    return actions
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all bookings and appointments
          </p>
        </div>
        <Button onClick={() => window.location.href = '/booking/new'}>
          <Plus size={20} className="mr-2" />
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Confirmed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Cancelled</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No appointments found</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                        <span className="text-violet-600 dark:text-violet-400 font-semibold text-lg">
                          {booking.customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.customerName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Phone size={14} />
                          {booking.customerPhone}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date & Time</div>
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Calendar size={14} />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Clock size={14} />
                          {formatTime(booking.startTime)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Staff</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {booking.staffName}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Services</div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {booking.services.map(s => s.serviceName).join(', ')}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                        <Badge status={booking.paymentStatus}>{booking.paymentStatus}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge status={booking.status}>{booking.status}</Badge>
                    
                    <div className="flex items-center gap-2">
                      {getStatusActions(booking).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => updateBookingStatus(booking.id, action.status)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                          title={action.label}
                        >
                          <action.icon size={16} className={action.color} />
                        </button>
                      ))}
                      
                      <button
                        onClick={() => window.location.href = `/booking/${booking.id}/edit`}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
