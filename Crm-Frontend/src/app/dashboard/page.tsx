'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatCurrency, formatDate, formatTime } from '@/utils/helpers'
import api from '@/lib/api'
import type { DashboardStats, Booking } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bookings?limit=5&sort=-createdAt'),
      ])
      setStats(statsRes.data)
      setRecentBookings(bookingsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Today Revenue',
      value: formatCurrency(stats?.todayRevenue || 0),
      change: stats?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Today Bookings',
      value: stats?.todayBookings || 0,
      change: stats?.bookingGrowth || 0,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Today Customers',
      value: stats?.todayCustomers || 0,
      change: stats?.customerGrowth || 0,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Month Revenue',
      value: formatCurrency(stats?.monthRevenue || 0),
      change: 0,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              {stat.change !== 0 && (
                <div className="flex items-center gap-1">
                  {stat.change > 0 ? (
                    <>
                      <TrendingUp size={16} className="text-emerald-600" />
                      <span className="text-sm text-emerald-600 font-medium">
                        +{stat.change}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown size={16} className="text-red-600" />
                      <span className="text-sm text-red-600 font-medium">
                        {stat.change}%
                      </span>
                    </>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Bookings
          </h2>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No bookings yet
              </p>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                      <span className="text-violet-600 dark:text-violet-400 font-semibold">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.staffName} • {formatTime(booking.startTime)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <Badge status={booking.status}>{booking.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => (window.location.href = '/booking/new')}
              className="p-4 rounded-xl border-2 border-violet-200 dark:border-violet-800 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all text-left"
            >
              <Calendar className="text-violet-600 dark:text-violet-400 mb-2" size={24} />
              <div className="font-semibold text-gray-900 dark:text-white">New Booking</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Create appointment</div>
            </button>
            <button
              onClick={() => (window.location.href = '/booking/pos')}
              className="p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left"
            >
              <DollarSign className="text-emerald-600 dark:text-emerald-400 mb-2" size={24} />
              <div className="font-semibold text-gray-900 dark:text-white">POS Billing</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Walk-in customer</div>
            </button>
            <button
              onClick={() => (window.location.href = '/customers')}
              className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
            >
              <Users className="text-blue-600 dark:text-blue-400 mb-2" size={24} />
              <div className="font-semibold text-gray-900 dark:text-white">Add Customer</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">New client profile</div>
            </button>
            <button
              onClick={() => (window.location.href = '/reports')}
              className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-left"
            >
              <TrendingUp className="text-amber-600 dark:text-amber-400 mb-2" size={24} />
              <div className="font-semibold text-gray-900 dark:text-white">View Reports</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Business insights</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
