'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Save, Palette } from 'lucide-react'

const COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#14b8a6']

const initialCategories = [
  { id: 1, name: 'Hair',   color: '#7c3aed', services: 12 },
  { id: 2, name: 'Skin',   color: '#0ea5e9', services: 8  },
  { id: 3, name: 'Nails',  color: '#10b981', services: 6  },
  { id: 4, name: 'Body',   color: '#f59e0b', services: 5  },
  { id: 5, name: 'Makeup', color: '#ec4899', services: 4  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', color: COLORS[0] })

  const handleSave = () => {
    if (!form.name) return
    setCategories(p => [...p, { id: Date.now(), name: form.name, color: form.color, services: 0 }])
    setForm({ name: '', color: COLORS[0] })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Service Categories</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Organize services by category</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-2xl p-5 transition hover:shadow-md group"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                <Palette size={20} style={{ color: cat.color }} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-1.5 rounded-lg transition"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover)'; e.currentTarget.style.color = '#7c3aed' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                  <Edit2 size={13} />
                </button>
                <button className="p-1.5 rounded-lg transition"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  onClick={() => setCategories(p => p.filter(x => x.id !== cat.id))}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.services} services</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Add Category</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg transition" style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category Name</label>
                <input type="text" placeholder="e.g. Bridal Services" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      className="w-10 h-10 rounded-lg transition"
                      style={{ background: c, border: form.color === c ? '3px solid var(--text-primary)' : 'none' }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Cancel</button>
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
