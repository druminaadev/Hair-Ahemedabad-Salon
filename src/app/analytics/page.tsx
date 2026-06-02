'use client'

import { BarChart2, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'

const monthlyData = [
  { month: 'Jan', revenue: 82000, bookings: 210 },
  { month: 'Feb', revenue: 91000, bookings: 234 },
  { month: 'Mar', revenue: 78000, bookings: 198 },
  { month: 'Apr', revenue: 105000, bookings: 267 },
  { month: 'May', revenue: 118000, bookings: 289 },
  { month: 'Jun', revenue: 124500, bookings: 284 },
]

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

const insights = [
  { label: 'Best Month',      value: 'June',   sub: '₹1,24,500 revenue',  icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Avg Monthly Rev', value: '₹99,750', sub: 'Last 6 months',     icon: DollarSign, color: 'text-salon-600 dark:text-salon-100', bg: 'bg-salon-100/25 dark:bg-salon-900/30' },
  { label: 'Peak Day',        value: 'Saturday', sub: 'Most bookings',    icon: Calendar,   color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Top Category',    value: 'Hair',    sub: '58% of revenue',    icon: Users,      color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-900/20' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart2 size={20} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6">Monthly Revenue Trend</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 dark:text-white">₹{(d.revenue / 1000).toFixed(0)}k</span>
              <div className="w-full rounded-t-xl transition-all duration-700"
                style={{ height: `${(d.revenue / maxRevenue) * 100}px`, background: i === monthlyData.length - 1 ? 'linear-gradient(to top, #971549, #CF455C)' : '#e5e7eb' }} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
