'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Scissors,
  ShoppingBag,
  Plus,
  Star,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Timer,
  ChevronRight,
  Sparkles,
  Bell,
  Activity,
  Receipt,
  Gift,
  BadgePercent,
  Boxes,
  BarChart2,
  Settings,
  FileText,
  Package,
  Tag,
  RefreshCw,
  BarChart,
  CreditCard,
  UserCircle,
  CalendarCheck,
  type LucideIcon,
} from 'lucide-react'

const theme = {
  primary: '#971549',
  primarySoft: '#FF9898',
  primaryMid: '#CF455C',
  primaryDark: '#470031',
  emerald: '#10B981',
  amber: '#F59E0B',
  sky: '#0EA5E9',
}

const stats = [
  {
    label: 'Total Revenue',
    value: '₹1,24,500',
    change: '+12.5%',
    up: true,
    icon: DollarSign,
    iconBox: 'bg-salon-100/25 dark:bg-salon-900/30',
    iconColor: 'text-salon-600 dark:text-salon-100',
  },
  {
    label: 'Appointments',
    value: '284',
    change: '+8.2%',
    up: true,
    icon: Calendar,
    iconBox: 'bg-rose-100 dark:bg-rose-950/40',
    iconColor: 'text-rose-600 dark:text-rose-300',
  },
  {
    label: 'Active Clients',
    value: '1,340',
    change: '+5.1%',
    up: true,
    icon: Users,
    iconBox: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Avg. Ticket',
    value: '₹438',
    change: '-2.3%',
    up: false,
    icon: TrendingUp,
    iconBox: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
]

const appointments = [
  { id: 1, client: 'Priya Sharma', avatar: 'PS', service: 'Hair Cut & Color', staff: 'Neha', time: '10:00 AM', duration: '90 min', status: 'completed', amount: '₹1,800' },
  { id: 2, client: 'Riya Patel', avatar: 'RP', service: 'Facial', staff: 'Pooja', time: '11:30 AM', duration: '60 min', status: 'in-progress', amount: '₹800' },
  { id: 3, client: 'Anita Verma', avatar: 'AV', service: 'Manicure', staff: 'Sonal', time: '01:00 PM', duration: '45 min', status: 'upcoming', amount: '₹400' },
  { id: 4, client: 'Meena Joshi', avatar: 'MJ', service: 'Hair Spa', staff: 'Neha', time: '02:30 PM', duration: '60 min', status: 'upcoming', amount: '₹1,200' },
  { id: 5, client: 'Sunita Rao', avatar: 'SR', service: 'Waxing', staff: 'Pooja', time: '04:00 PM', duration: '60 min', status: 'upcoming', amount: '₹1,000' },
]

const staff = [
  { name: 'Neha Sharma', role: 'Senior Stylist', avatar: 'N', revenue: '₹48,200', bookings: 142, rating: 4.9 },
  { name: 'Pooja Verma', role: 'Beautician', avatar: 'P', revenue: '₹32,100', bookings: 98, rating: 4.7 },
  { name: 'Sonal Patel', role: 'Nail Artist', avatar: 'S', revenue: '₹24,800', bookings: 76, rating: 4.8 },
  { name: 'Ritu Joshi', role: 'Makeup Artist', avatar: 'R', revenue: '₹18,600', bookings: 54, rating: 4.6 },
]

const services = [
  { name: 'Hair Cut & Color', bookings: 84, revenue: '₹42,000', pct: 90 },
  { name: 'Facial', bookings: 62, revenue: '₹24,800', pct: 66 },
  { name: 'Hair Spa', bookings: 48, revenue: '₹28,800', pct: 51 },
  { name: 'Manicure', bookings: 44, revenue: '₹8,800', pct: 47 },
  { name: 'Waxing', bookings: 38, revenue: '₹19,000', pct: 40 },
]

const revenueChart = [
  { month: 'Aug', value: 82 },
  { month: 'Sep', value: 91 },
  { month: 'Oct', value: 78 },
  { month: 'Nov', value: 105 },
  { month: 'Dec', value: 124 },
  { month: 'Jan', value: 118 },
]

const notifications = [
  { text: 'Priya Sharma booked Hair Spa for tomorrow', time: '2m ago', dot: 'bg-salon-600' },
  { text: 'Low stock alert: Hair Color (Blonde)', time: '15m ago', dot: 'bg-amber-500' },
  { text: 'Riya Patel left a 5 star review', time: '1h ago', dot: 'bg-emerald-500' },
]

const statusConfig: Record<string, { label: string; icon: LucideIcon; cls: string }> = {
  completed: { label: 'Completed', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  'in-progress': { label: 'In Progress', icon: Timer, cls: 'bg-salon-100/25 text-salon-600 dark:bg-salon-900/40 dark:text-salon-100' },
  upcoming: { label: 'Upcoming', icon: Circle, cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
}

const avatarColors = ['bg-salon-600', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500']
const maxRevenue = Math.max(...revenueChart.map((d) => d.value))

const pages = [
  {
    group: 'Booking',
    color: theme.primary,
    icon: CalendarCheck,
    items: [
      { label: 'New Booking', path: '/booking/new', icon: Calendar, desc: 'Schedule a new appointment' },
      { label: 'POS / Walk-in', path: '/booking/pos', icon: ShoppingBag, desc: 'Quick walk-in billing' },
      { label: 'Calendar View', path: '/booking/calendar', icon: CalendarCheck, desc: 'Plan daily appointments' },
    ],
  },
  {
    group: 'Invoices',
    color: theme.amber,
    icon: Receipt,
    items: [
      { label: 'All Invoices', path: '/invoices', icon: FileText, desc: 'Manage billing and payments' },
    ],
  },
  {
    group: 'Services',
    color: theme.primaryMid,
    icon: Scissors,
    items: [
      { label: 'All Services', path: '/services', icon: Scissors, desc: '5 active services' },
      { label: 'Categories', path: '/services/categories', icon: Tag, desc: 'Organise service types' },
    ],
  },
  {
    group: 'Staff',
    color: theme.sky,
    icon: Users,
    items: [
      { label: 'Staff List', path: '/staff', icon: Users, desc: '5 staff members' },
      { label: 'Add Staff', path: '/staff/add', icon: UserCircle, desc: 'Onboard new member' },
    ],
  },
  {
    group: 'Clients',
    color: theme.emerald,
    icon: UserCircle,
    items: [
      { label: 'Client List', path: '/customers', icon: UserCircle, desc: '1,340 active clients' },
      { label: 'Add Client', path: '/customers', icon: Plus, desc: 'Register new client' },
    ],
  },
  {
    group: 'Membership',
    color: '#EC4899',
    icon: Gift,
    items: [
      { label: 'Plans', path: '/membership', icon: CreditCard, desc: 'Subscription plans' },
      { label: 'Packages', path: '/membership/packages', icon: Package, desc: 'Service bundles' },
      { label: 'Loyalty', path: '/loyalty', icon: Star, desc: 'Reward points program' },
    ],
  },
  {
    group: 'Discounts',
    color: '#F97316',
    icon: BadgePercent,
    items: [
      { label: 'All Discounts', path: '/discounts', icon: BadgePercent, desc: 'Coupons and offers' },
    ],
  },
  {
    group: 'Inventory',
    color: '#14B8A6',
    icon: Boxes,
    items: [
      { label: 'Stock', path: '/inventory', icon: Boxes, desc: 'Product stock levels' },
      { label: 'Reorder', path: '/inventory/reorder', icon: RefreshCw, desc: '3 items low on stock' },
    ],
  },
  {
    group: 'Reports',
    color: theme.primaryDark,
    icon: BarChart2,
    items: [
      { label: 'Reports', path: '/reports', icon: Activity, desc: 'Business overview' },
      { label: 'Transactions', path: '/reports/transactions', icon: FileText, desc: 'All transactions log' },
      { label: 'Business Trend', path: '/reports/business-trend', icon: TrendingUp, desc: 'Growth analytics' },
      { label: 'Stylist Progress', path: '/reports/stylist-progress', icon: BarChart, desc: 'Staff performance' },
    ],
  },
  {
    group: 'Notifications',
    color: '#64748B',
    icon: Bell,
    items: [
      { label: 'WhatsApp Logs', path: '/notifications', icon: Bell, desc: 'Message delivery logs' },
    ],
  },
  {
    group: 'Settings',
    color: '#94A3B8',
    icon: Settings,
    items: [
      { label: 'Salon Info', path: '/settings', icon: Sparkles, desc: 'Salon profile and branding' },
      { label: 'Notifications', path: '/settings/notifications', icon: Bell, desc: 'Alert preferences' },
    ],
  },
]

const serviceBars = [
  'from-salon-600 to-salon-400',
  'from-rose-500 to-pink-400',
  'from-emerald-500 to-green-400',
  'from-amber-500 to-yellow-400',
  'from-sky-500 to-blue-400',
]

const staffColors = [theme.primary, theme.primaryMid, theme.emerald, theme.amber]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today')

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-salon-600 dark:text-salon-100" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {greeting}, Admin
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{dateStr}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/booking/new" className="flex items-center gap-1.5 rounded-xl bg-salon-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-salon-100 transition hover:bg-salon-900 dark:shadow-none">
            <Plus size={14} />New Booking
          </Link>
          <Link href="/booking/pos" className="flex items-center gap-1.5 rounded-xl bg-salon-400 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-salon-100 transition hover:bg-salon-600 dark:shadow-none">
            <ShoppingBag size={14} />Walk-in POS
          </Link>
          <Link href="/customers" className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">
            <Users size={14} />Add Client
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, change, up, icon: Icon, iconBox, iconColor }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBox}`}>
                <Icon size={18} className={iconColor} />
              </div>
              <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
                {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {change}
              </span>
            </div>
            <p className="mb-0.5 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 xl:col-span-2">
          <div className="flex items-center justify-between px-5 pb-4 pt-5">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-salon-600 dark:text-salon-100" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Appointments</h2>
              <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-xs font-semibold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">
                {appointments.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex overflow-hidden rounded-xl border border-gray-200 text-xs font-semibold dark:border-gray-700">
                {(['today', 'upcoming'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 capitalize transition ${activeTab === tab ? 'bg-salon-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <Link href="/booking/calendar" className="flex items-center gap-0.5 text-xs font-semibold text-salon-600 hover:underline dark:text-salon-100">
                View all <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {appointments.map((appointment, index) => {
              const status = statusConfig[appointment.status]
              const StatusIcon = status.icon

              return (
                <div key={appointment.id} className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColors[index % avatarColors.length]}`}>
                    {appointment.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">{appointment.client}</span>
                      <span className={`hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:flex ${status.cls}`}>
                        <StatusIcon size={10} />{status.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Scissors size={11} className="shrink-0 text-salon-400" />
                      <span className="truncate text-xs text-gray-500 dark:text-gray-400">{appointment.service}</span>
                      <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">· {appointment.staff}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-900 dark:text-white">
                      <Clock size={11} className="text-salon-400" />{appointment.time}
                    </div>
                    <div className="mt-0.5 text-xs font-bold text-salon-600 dark:text-salon-100">{appointment.amount}</div>
                  </div>
                  <MoreHorizontal size={15} className="shrink-0 text-gray-400 opacity-0 transition group-hover:opacity-100" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-salon-600 dark:text-salon-100" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
              </div>
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ArrowUpRight size={11} />+12.5%
              </span>
            </div>
            <div className="flex h-20 items-end gap-1.5">
              {revenueChart.map((day, index) => (
                <div key={day.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${(day.value / maxRevenue) * 72}px`,
                      background: index === revenueChart.length - 1
                        ? `linear-gradient(to top, ${theme.primary}, ${theme.primarySoft})`
                        : 'rgb(229 231 235)',
                    }}
                  />
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">{day.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">This month</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">₹1,18,000</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <Bell size={15} className="text-salon-600 dark:text-salon-100" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.text} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-gray-900 dark:text-white">{notification.text}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors size={15} className="text-salon-600 dark:text-salon-100" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Services</h3>
            </div>
            <Link href="/services" className="flex items-center gap-0.5 text-xs font-semibold text-salon-600 hover:underline dark:text-salon-100">
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">Bookings this month</p>

          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={service.name}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-salon-600 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-medium text-gray-900 dark:text-white">{service.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">{service.bookings} bookings</span>
                    <span className="text-xs font-bold text-salon-600 dark:text-salon-100">{service.revenue}</span>
                  </div>
                </div>
                <div className="relative h-6 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className={`flex h-full items-center justify-end rounded-lg bg-gradient-to-r pr-2 transition-all duration-700 ${serviceBars[index]}`} style={{ width: `${service.pct}%` }}>
                    <span className="text-[10px] font-bold text-white">{service.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between px-0.5">
            {[0, 25, 50, 75, 100].map((value) => (
              <span key={value} className="text-[9px] text-gray-500 dark:text-gray-400">{value}%</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-salon-600 dark:text-salon-100" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Staff Performance</h3>
            </div>
            <Link href="/staff" className="flex items-center gap-0.5 text-xs font-semibold text-salon-600 hover:underline dark:text-salon-100">
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">Revenue contribution this month</p>

          {(() => {
            const totalRevenue = staff.reduce((sum, member) => sum + Number(member.revenue.replace(/[₹,]/g, '')), 0)
            const size = 140
            const cx = size / 2
            const cy = size / 2
            const r = 52
            const strokeWidth = 18
            const circumference = 2 * Math.PI * r
            let offset = 0
            const segments = staff.map((member, index) => {
              const value = Number(member.revenue.replace(/[₹,]/g, ''))
              const pct = value / totalRevenue
              const dash = pct * circumference
              const segment = { offset, dash, color: staffColors[index] }
              offset += dash
              return segment
            })

            return (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0 self-center" style={{ width: size, height: size }}>
                  <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgb(229 231 235)" strokeWidth={strokeWidth} />
                    {segments.map((segment, index) => (
                      <circle
                        key={segment.color}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${segment.dash - 2} ${circumference - segment.dash + 2}`}
                        strokeDashoffset={-segment.offset}
                        strokeLinecap="round"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹1.2L</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {staff.map((member, index) => {
                    const value = Number(member.revenue.replace(/[₹,]/g, ''))
                    const pct = Math.round((value / totalRevenue) * 100)

                    return (
                      <div key={member.name} className="flex cursor-pointer items-center gap-2.5 rounded-xl p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: staffColors[index] }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-semibold text-gray-900 dark:text-white">{member.name.split(' ')[0]}</span>
                            <span className="text-xs font-bold" style={{ color: staffColors[index] }}>{pct}%</span>
                          </div>
                          <div className="mt-0.5 flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">{member.revenue}</span>
                            <div className="flex items-center gap-0.5">
                              <Star size={9} className="text-amber-400" fill="currentColor" />
                              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{member.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={15} className="text-salon-600 dark:text-salon-100" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">All Pages</h2>
          <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-xs font-semibold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">
            {pages.reduce((sum, group) => sum + group.items.length, 0)}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pages.map((group) => (
            <div key={group.group} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${group.color}18` }}>
                  <group.icon size={14} style={{ color: group.color }} />
                </div>
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{group.group}</span>
                <span className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: `${group.color}18`, color: group.color }}>
                  {group.items.length}
                </span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.path} href={item.path} className="group/page flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800">
                    <item.icon size={13} style={{ color: group.color, opacity: 0.85, flexShrink: 0 }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-gray-900 dark:text-white">{item.label}</div>
                      <div className="truncate text-[10px] text-gray-500 dark:text-gray-400">{item.desc}</div>
                    </div>
                    <ChevronRight size={12} className="shrink-0 opacity-0 transition group-hover/page:opacity-100" style={{ color: group.color }} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
