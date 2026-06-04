'use client'

import { useState } from 'react'
import {
  Search, Plus, CalendarDays, Clock, User, Phone,
  CheckCircle2, XCircle, AlertCircle, Loader2, Scissors, X, ChevronDown, MapPin,
} from 'lucide-react'
import { useLocationStore, BRANCHES, type BranchId } from '@/store/locationStore'

interface Booking {
  id: number
  customerName: string
  customerPhone: string
  services: string[]
  staff: string
  date: string
  time: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  total: number
}

const SEED: Record<BranchId, Booking[]> = {
  main: [
    { id: 1, customerName: 'Priya Sharma',  customerPhone: '+91 98765 43210', services: ['Haircut', 'Hair Spa'],   staff: 'Priya Kumar',  date: '2024-01-20', time: '10:00', status: 'confirmed',  total: 1700 },
    { id: 2, customerName: 'Riya Patel',    customerPhone: '+91 98765 43211', services: ['Facial'],               staff: 'Sonal Patel',  date: '2024-01-20', time: '11:30', status: 'completed',  total: 800  },
    { id: 3, customerName: 'Anita Verma',   customerPhone: '+91 98765 43212', services: ['Bridal Makeup'],        staff: 'Ritu Joshi',   date: '2024-01-21', time: '09:00', status: 'pending',    total: 5000 },
    { id: 4, customerName: 'Meena Joshi',   customerPhone: '+91 98765 43213', services: ['Manicure', 'Pedicure'], staff: 'Sonal Patel',  date: '2024-01-19', time: '14:00', status: 'cancelled',  total: 900  },
  ],
  satellite: [
    { id: 1, customerName: 'Kavita Singh',  customerPhone: '+91 91234 56780', services: ['Hair Coloring'],        staff: 'Rahul Verma',  date: '2024-01-20', time: '10:00', status: 'confirmed',  total: 2000 },
    { id: 2, customerName: 'Deepa Mehta',   customerPhone: '+91 91234 56781', services: ['Facial', 'Manicure'],   staff: 'Neha Shah',    date: '2024-01-21', time: '12:00', status: 'pending',    total: 1200 },
    { id: 3, customerName: 'Pooja Desai',   customerPhone: '+91 91234 56782', services: ['Waxing (Full)'],        staff: 'Rahul Verma',  date: '2024-01-19', time: '15:00', status: 'completed',  total: 1000 },
  ],
  sghighway: [
    { id: 1, customerName: 'Nisha Kapoor',  customerPhone: '+91 99887 76650', services: ['Hair Spa'],             staff: 'Amit Joshi',   date: '2024-01-20', time: '11:00', status: 'confirmed',  total: 1200 },
    { id: 2, customerName: 'Rekha Trivedi', customerPhone: '+91 99887 76651', services: ['Pedicure', 'Haircut'],  staff: 'Sima Rao',     date: '2024-01-22', time: '14:30', status: 'pending',    total: 1000 },
    { id: 3, customerName: 'Alka Bhat',     customerPhone: '+91 99887 76652', services: ['Bridal Makeup'],        staff: 'Sima Rao',     date: '2024-01-21', time: '09:30', status: 'cancelled',  total: 5000 },
    { id: 4, customerName: 'Jyoti Pillai',  customerPhone: '+91 99887 76653', services: ['Facial'],               staff: 'Amit Joshi',   date: '2024-01-20', time: '16:00', status: 'completed',  total: 800  },
  ],
}

const SERVICES = ['Haircut', 'Hair Coloring', 'Hair Spa', 'Facial', 'Manicure', 'Pedicure', 'Waxing (Full)', 'Bridal Makeup']
const STAFF_BY: Record<BranchId, string[]> = {
  main:      ['Priya Kumar', 'Rahul Verma', 'Sonal Patel', 'Ritu Joshi'],
  satellite: ['Rahul Verma', 'Neha Shah', 'Priya Kumar'],
  sghighway: ['Amit Joshi', 'Sima Rao', 'Neha Shah'],
}
const SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00']

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'Cancelled', icon: XCircle,      color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
  pending:   { label: 'Pending',   icon: Loader2,      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' },
}
const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

function AddBookingModal({ onClose, onSave, branchId }: { onClose: () => void; onSave: (b: Omit<Booking, 'id'>) => void; branchId: BranchId }) {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', services: [] as string[],
    staff: '', date: '', time: '', status: 'pending' as Booking['status'], total: 0,
  })

  const toggleService = (s: string) =>
    setForm(p => ({ ...p, services: p.services.includes(s) ? p.services.filter(x => x !== s) : [...p.services, s] }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName || !form.customerPhone || form.services.length === 0 || !form.date || !form.time) return
    onSave(form)
    onClose()
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9D679F] dark:border-gray-700 dark:bg-gray-900 dark:text-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" style={{ border: '1px solid var(--border)' }}>
        <div className="h-1 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors size={16} style={{ color: '#6F5AA3' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Add Booking</h2>
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <MapPin size={9} />{BRANCHES.find(b => b.id === branchId)?.short}
              </span>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Customer Name *</label>
                <input className={inputCls} placeholder="Full name" value={form.customerName}
                  onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
                <input className={inputCls} placeholder="+91 98765 43210" value={form.customerPhone}
                  onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Services *</label>
              <div className="flex flex-wrap gap-1.5">
                {SERVICES.map(s => (
                  <button type="button" key={s} onClick={() => toggleService(s)}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition"
                    style={form.services.includes(s)
                      ? { background: 'linear-gradient(135deg,#6F5AA3,#9D679F)', color: '#fff' }
                      : { border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Staff</label>
                <div className="relative">
                  <select className={inputCls + ' appearance-none pr-8'} value={form.staff}
                    onChange={e => setForm(p => ({ ...p, staff: e.target.value }))}>
                    <option value="">Select staff</option>
                    {STAFF_BY[branchId].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</label>
                <div className="relative">
                  <select className={inputCls + ' appearance-none pr-8'} value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as Booking['status'] }))}>
                    {(['pending','confirmed','completed','cancelled'] as const).map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Date *</label>
                <input type="date" className={inputCls} value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Time *</label>
                <div className="relative">
                  <select className={inputCls + ' appearance-none pr-8'} value={form.time}
                    onChange={e => setForm(p => ({ ...p, time: e.target.value }))}>
                    <option value="">Select slot</option>
                    {SLOTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Amount (₹)</label>
              <input type="number" className={inputCls} placeholder="0" value={form.total || ''}
                onChange={e => setForm(p => ({ ...p, total: Number(e.target.value) }))} />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
              <button type="submit"
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                style={{ background: 'linear-gradient(135deg,#6F5AA3,#9D679F)' }}>
                Add Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function BookingListPage() {
  const { branchId } = useLocationStore()
  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  // per-branch state maps
  const [allBookings, setAllBookings] = useState<Record<BranchId, Booking[]>>({
    main:      [...SEED.main],
    satellite: [...SEED.satellite],
    sghighway: [...SEED.sghighway],
  })

  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState<typeof STATUSES[number]>('all')
  const [showModal, setShowModal] = useState(false)

  const bookings = allBookings[branchId]

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = b.customerName.toLowerCase().includes(q) || b.customerPhone.includes(q) || b.services.some(s => s.toLowerCase().includes(q))
    return matchSearch && (filter === 'all' || b.status === filter)
  })

  const setBookings = (updater: (prev: Booking[]) => Booking[]) =>
    setAllBookings(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))

  const handleAdd          = (data: Omit<Booking, 'id'>) => setBookings(p => [{ id: Date.now(), ...data }, ...p])
  const handleStatusChange = (id: number, status: Booking['status']) => setBookings(p => p.map(b => b.id === id ? { ...b, status } : b))
  const handleDelete       = (id: number) => { if (confirm('Delete this booking?')) setBookings(p => p.filter(b => b.id !== id)) }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Booking List</h1>
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <MapPin size={10} />{activeBranch.short}
            </span>
          </div>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{bookings.length} bookings · {activeBranch.address}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#6F5AA3,#9D679F)' }}>
          <Plus size={15} /> Add Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search by name, phone, service..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition"
              style={filter === s
                ? { background: 'linear-gradient(135deg,#6F5AA3,#9D679F)', color: '#fff' }
                : { border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="h-0.5 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--hover)' }}>
                {['Customer', 'Services', 'Staff', 'Date & Time', 'Status', 'Total', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const cfg  = STATUS_CONFIG[b.status]
                const Icon = cfg.icon
                return (
                  <tr key={b.id} className="transition" style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg,#9D679F,#6F5AA3)' }}>
                          {b.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.customerName}</div>
                          <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            <Phone size={10} />{b.customerPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {b.services.map(s => (
                          <span key={s} className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <User size={13} style={{ color: 'var(--text-secondary)' }} />{b.staff || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                        <CalendarDays size={13} style={{ color: 'var(--text-secondary)' }} />{b.date}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        <Clock size={10} />{b.time}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.color}`}>
                        <Icon size={11} />{cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold" style={{ color: '#6F5AA3' }}>₹{b.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <select value={b.status} onChange={e => handleStatusChange(b.id, e.target.value as Booking['status'])}
                          className="rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#9D679F]"
                          style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                          {(['pending','confirmed','completed','cancelled'] as const).map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <button onClick={() => handleDelete(b.id)} className="text-xs font-medium text-red-400 hover:text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <AlertCircle size={24} className="mx-auto mb-2 opacity-30" />
                    No bookings found for {activeBranch.short}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddBookingModal onClose={() => setShowModal(false)} onSave={handleAdd} branchId={branchId} />}
    </div>
  )
}
