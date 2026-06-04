'use client'

import { useState } from 'react'
import { Users, Plus, Edit2, Trash2, X, Phone, Mail, Award } from 'lucide-react'

const SPECIALITIES = ['Hair', 'Skin', 'Nails', 'Body', 'Makeup']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

import { useLocationStore, BRANCHES, BRANCH_STAFF, type BranchId } from '@/store/locationStore'

export default function StaffPage() {
  const { branchId } = useLocationStore()
  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]
  const [allStaff, setAllStaff] = useState<Record<BranchId, typeof BRANCH_STAFF.main>>({
    main: [...BRANCH_STAFF.main],
    satellite: [...BRANCH_STAFF.satellite],
    sghighway: [...BRANCH_STAFF.sghighway],
  })
  const [showForm, setShowForm] = useState(false)
  const staff = allStaff[branchId]
  const setStaff = (updater: (prev: typeof BRANCH_STAFF.main) => typeof BRANCH_STAFF.main) =>
    setAllStaff(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))
  const [formData, setFormData] = useState({
    name: '', role: '', speciality: 'Hair', phone: '', email: '',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: [] as string[],
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStaff(prev => [...prev, { id: Date.now(), ...formData }])
    setShowForm(false)
    setFormData({ name: '', role: '', speciality: 'Hair', phone: '', email: '', workingHours: { start: '09:00', end: '18:00' }, workingDays: [], isActive: true })
  }

  const toggleDay = (day: string) =>
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day],
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: '#9D679F' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Staff Management</h1>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            📍 {activeBranch.short}
          </span>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Staff Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add Staff Member</h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition"
                style={{ background: 'var(--hover)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Speciality *</label>
                  <select required value={formData.speciality}
                    onChange={e => setFormData({ ...formData, speciality: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                    {SPECIALITIES.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
                  <input type="tel" required value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Working Days *</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{
                        background: formData.workingDays.includes(day) ? '#9D679F' : 'var(--hover)',
                        color: formData.workingDays.includes(day) ? '#fff' : 'var(--text-secondary)',
                        border: formData.workingDays.includes(day) ? 'none' : '1px solid var(--border)',
                      }}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Start Time</label>
                  <input type="time" value={formData.workingHours.start}
                    onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, start: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>End Time</label>
                  <input type="time" value={formData.workingHours.end}
                    onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, end: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: 'linear-gradient(135deg, #9D679F, #6F5AA3)' }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {member.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Award size={12} /><span>{member.speciality}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={12} /><span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={12} /><span>{member.email}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Working Days</div>
              <div className="flex flex-wrap gap-1">
                {member.workingDays.map(day => (
                  <span key={day} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#9D679F18', color: '#9D679F' }}>
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => alert(`Edit staff: ${member.name}`)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition"
                style={{ background: 'var(--hover)', color: 'var(--text-primary)' }}>
                <Edit2 size={12} className="inline mr-1" /> Edit
              </button>
              <button onClick={() => { if (confirm(`Remove ${member.name} from staff?`)) setStaff(prev => prev.filter(s => s.id !== member.id)) }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600">
                <Trash2 size={12} className="inline mr-1" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
