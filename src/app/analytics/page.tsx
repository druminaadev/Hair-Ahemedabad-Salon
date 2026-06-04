'use client'

import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, ArrowUpRight, Star, Scissors } from 'lucide-react'

const revenueData = [
  { month: 'Aug', value: 82 }, { month: 'Sep', value: 91 }, { month: 'Oct', value: 78 },
  { month: 'Nov', value: 105 }, { month: 'Dec', value: 124 }, { month: 'Jan', value: 118 },
]
const maxRev = Math.max(...revenueData.map(d => d.value))

const clientGrowth = [
  { month: 'Aug', new: 42, returning: 168 }, { month: 'Sep', new: 55, returning: 179 },
  { month: 'Oct', new: 38, returning: 182 }, { month: 'Nov', new: 61, returning: 207 },
  { month: 'Dec', new: 74, returning: 236 }, { month: 'Jan', new: 68, returning: 222 },
]

const topServices = [
  { name: 'Hair Cut & Color', revenue: 42000, pct: 90, color: '#6F5AA3' },
  { name: 'Facial',           revenue: 24800, pct: 59, color: '#6D91BF' },
  { name: 'Hair Spa',         revenue: 28800, pct: 69, color: '#6F9F8F' },
  { name: 'Manicure',         revenue: 8800,  pct: 21, color: '#C7923E' },
  { name: 'Waxing',           revenue: 19000, pct: 45, color: '#C96F9B' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',   value: '₹1,24,500', change: '+12.5%', icon: DollarSign, color: '#6F5AA3', bg: '#6F5AA318' },
          { label: 'Total Clients',   value: '1,340',      change: '+5.1%',  icon: Users,      color: '#6D91BF', bg: '#6D91BF18' },
          { label: 'Appointments',    value: '284',        change: '+8.2%',  icon: Calendar,   color: '#6F9F8F', bg: '#6F9F8F18' },
          { label: 'Avg Ticket',      value: '₹438',       change: '-2.3%',  icon: TrendingUp, color: '#C7923E', bg: '#C7923E18' },
        ].map(({ label, value, change, icon: Icon, color, bg }) => {
          const up = change.startsWith('+')
          return (
            <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {up ? <ArrowUpRight size={11} /> : <TrendingDown size={11} />}{change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue Bar Chart */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <DollarSign size={15} className="text-rose-500" />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight size={11} />+12.5%
            </span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold" style={{ color: '#6F5AA3' }}>₹{d.value}k</span>
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxRev) * 100}px`, background: i === revenueData.length - 1 ? 'linear-gradient(to top, #6F5AA3, #B784B7)' : 'var(--border)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth Stacked */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Users size={15} className="text-sky-500" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Client Growth</h3>
            <div className="ml-auto flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />New</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-300 inline-block" />Returning</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {clientGrowth.map(d => {
              const total = d.new + d.returning
              const maxTotal = Math.max(...clientGrowth.map(x => x.new + x.returning))
              const h = (total / maxTotal) * 120
              const newH = (d.new / total) * h
              const retH = (d.returning / total) * h
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col rounded-t-lg overflow-hidden">
                    <div style={{ height: `${newH}px`, background: '#6D91BF' }} />
                    <div style={{ height: `${retH}px`, background: '#c4b5fd' }} />
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Scissors size={15} className="text-rose-500" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Top Services by Revenue</h3>
        </div>
        <div className="space-y-4">
          {topServices.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.pct}%</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>₹{s.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2.5 rounded-full" style={{ background: 'var(--hover)' }}>
                <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
