'use client'

import { UserCog, Star, TrendingUp, Calendar } from 'lucide-react'

const stylists = [
  { id: 1, name: 'Neha Sharma',  role: 'Senior Stylist', avatar: 'N', revenue: 48200, bookings: 142, rating: 4.9, completed: 138, cancelled: 4,  topService: 'Hair Color'   },
  { id: 2, name: 'Pooja Verma',  role: 'Beautician',     avatar: 'P', revenue: 32100, bookings: 98,  rating: 4.7, completed: 94,  cancelled: 4,  topService: 'Facial'       },
  { id: 3, name: 'Sonal Patel',  role: 'Nail Artist',    avatar: 'S', revenue: 24800, bookings: 76,  rating: 4.8, completed: 74,  cancelled: 2,  topService: 'Manicure'     },
  { id: 4, name: 'Ritu Joshi',   role: 'Makeup Artist',  avatar: 'R', revenue: 18600, bookings: 54,  rating: 4.6, completed: 50,  cancelled: 4,  topService: 'Bridal Makeup'},
]

const totalRevenue = stylists.reduce((s, st) => s + st.revenue, 0)
const avatarColors = ['bg-salon-600', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500']

export default function StylistProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCog size={20} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stylist Progress</h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stylists.map((s, i) => {
          const revPct = Math.round((s.revenue / totalRevenue) * 100)
          return (
            <div key={s.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${avatarColors[i]}`}>
                  {s.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><TrendingUp size={12} />Revenue</span>
                  <span className="font-bold text-salon-600 dark:text-salon-100">₹{s.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><Calendar size={12} />Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{s.bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><Star size={12} />Rating</span>
                  <span className="font-semibold text-amber-500">{s.rating} ★</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Revenue Share</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{revPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${avatarColors[i]}`}
                    style={{ width: `${revPct}%`, background: avatarColors[i].replace('bg-', '') === 'salon-600' ? '#971549' : '' }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Detailed Performance</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {['Stylist', 'Revenue', 'Bookings', 'Completed', 'Cancelled', 'Rating', 'Top Service'].map(h => (
                <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {stylists.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColors[i]}`}>{s.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-bold text-salon-600 dark:text-salon-100">₹{s.revenue.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-gray-900 dark:text-white font-semibold">{s.bookings}</td>
                <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">{s.completed}</td>
                <td className="px-5 py-3.5 text-red-500 font-semibold">{s.cancelled}</td>
                <td className="px-5 py-3.5 text-amber-500 font-semibold">{s.rating} ★</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{s.topService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
