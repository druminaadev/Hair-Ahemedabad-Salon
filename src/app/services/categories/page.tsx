'use client'

import { useState } from 'react'
import {
  Plus, Edit2, Trash2, X, Save, Scissors, Sparkles,
  Layers, Check, TrendingUp, Clock, Star,
} from 'lucide-react'

const COLORS = [
  { hex: '#6F5AA3', gradient: 'from-[#6F5AA3] to-[#9D679F]', label: 'Violet'  },
  { hex: '#6D91BF', gradient: 'from-[#6D91BF] to-[#5F4C86]', label: 'Sky'     },
  { hex: '#6F9F8F', gradient: 'from-[#6F9F8F] to-[#6D91BF]', label: 'Sage'    },
  { hex: '#C7923E', gradient: 'from-[#C7923E] to-[#D88385]', label: 'Amber'   },
  { hex: '#C96F9B', gradient: 'from-[#C96F9B] to-[#D88385]', label: 'Pink'    },
  { hex: '#D88385', gradient: 'from-[#D88385] to-[#C96F9B]', label: 'Rose'    },
  { hex: '#5F4C86', gradient: 'from-[#5F4C86] to-[#6F5AA3]', label: 'Plum'    },
  { hex: '#9D679F', gradient: 'from-[#9D679F] to-[#C96F9B]', label: 'Coral'   },
]

const CAT_ICONS: Record<string, React.ElementType> = {
  Hair:   Scissors,
  Skin:   Sparkles,
  Nails:  Star,
  Body:   TrendingUp,
  Makeup: Layers,
}

const initialCategories = [
  { id: 1, name: 'Hair',   colorHex: '#6F5AA3', gradient: 'from-[#6F5AA3] to-[#9D679F]', services: 12, avgPrice: 1000, topService: 'Hair Color'    },
  { id: 2, name: 'Skin',   colorHex: '#6D91BF', gradient: 'from-[#6D91BF] to-[#5F4C86]', services: 8,  avgPrice: 800,  topService: 'Facial'         },
  { id: 3, name: 'Nails',  colorHex: '#6F9F8F', gradient: 'from-[#6F9F8F] to-[#6D91BF]', services: 6,  avgPrice: 450,  topService: 'Nail Art'       },
  { id: 4, name: 'Body',   colorHex: '#C7923E', gradient: 'from-[#C7923E] to-[#D88385]', services: 5,  avgPrice: 900,  topService: 'Waxing (Full)'  },
  { id: 5, name: 'Makeup', colorHex: '#C96F9B', gradient: 'from-[#C96F9B] to-[#D88385]', services: 4,  avgPrice: 3000, topService: 'Bridal Makeup'  },
]

type Category = typeof initialCategories[number]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [form, setForm]             = useState({ name: '', colorHex: COLORS[0].hex, gradient: COLORS[0].gradient })

  const totalServices = categories.reduce((s, c) => s + c.services, 0)
  const maxServices   = Math.max(...categories.map(c => c.services))

  const openAdd = () => {
    setEditTarget(null)
    setForm({ name: '', colorHex: COLORS[0].hex, gradient: COLORS[0].gradient })
    setShowModal(true)
  }

  const openEdit = (cat: Category) => {
    setEditTarget(cat)
    const match = COLORS.find(c => c.hex === cat.colorHex) ?? COLORS[0]
    setForm({ name: cat.name, colorHex: cat.colorHex, gradient: match.gradient })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editTarget) {
      setCategories(p => p.map(c => c.id === editTarget.id ? { ...c, name: form.name, colorHex: form.colorHex, gradient: form.gradient } : c))
    } else {
      setCategories(p => [...p, { id: Date.now(), name: form.name, colorHex: form.colorHex, gradient: form.gradient, services: 0, avgPrice: 0, topService: '—' }])
    }
    setShowModal(false)
  }

  return (
    <main className="min-h-full space-y-6 pb-6">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-7 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-20 w-20 rounded-full bg-[#C96F9B]/40 blur-xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Layers size={12} className="animate-pulse" /> Service Categories
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Categories</h1>
            <p className="mt-1 text-sm font-medium text-white/80">{categories.length} categories · {totalServices} total services</p>
          </div>
          <button onClick={openAdd}
            className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-white/30 bg-white/20 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 sm:self-auto">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Categories', value: categories.length,  gradient: 'from-[#6F5AA3] to-[#9D679F]', icon: Layers      },
          { label: 'Total Services',   value: totalServices,       gradient: 'from-[#6D91BF] to-[#5F4C86]', icon: Scissors    },
          { label: 'Avg per Category', value: Math.round(totalServices / categories.length), gradient: 'from-[#6F9F8F] to-[#6D91BF]', icon: TrendingUp },
          { label: 'Top Category',     value: categories.reduce((a, b) => a.services > b.services ? a : b).name, gradient: 'from-[#C96F9B] to-[#D88385]', icon: Star },
        ].map(({ label, value, gradient, icon: Icon }) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(36,21,26,0.07)] transition-all duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.04]">
            <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${gradient}`} />
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon size={17} className="text-white" />
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-[#24151A] dark:text-white">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Category Cards Grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => {
          const Icon = CAT_ICONS[cat.name] ?? Layers
          const pct  = maxServices ? Math.round((cat.services / maxServices) * 100) : 0
          return (
            <div key={cat.id}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(36,21,26,0.13)] dark:border-white/10 dark:bg-white/[0.04]">
              {/* top gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${cat.gradient}`} />
              {/* left accent */}
              <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${cat.gradient}`} style={{ top: 4 }} />

              <div className="p-5 pl-6">
                {/* icon + actions */}
                <div className="mb-4 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl transition"
                      style={{ background: 'var(--hover)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = cat.colorHex)}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => { if (confirm(`Delete category "${cat.name}"?`)) setCategories(p => p.filter(c => c.id !== cat.id)) }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* name + top service */}
                <h3 className="text-xl font-bold text-[#24151A] dark:text-white">{cat.name}</h3>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Top: <span className="font-semibold" style={{ color: cat.colorHex }}>{cat.topService}</span>
                </p>

                {/* stats row */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${cat.colorHex}18` }}>
                      <Scissors size={12} style={{ color: cat.colorHex }} />
                    </div>
                    <div>
                      <p className="text-base font-bold" style={{ color: cat.colorHex }}>{cat.services}</p>
                      <p className="text-[10px] leading-none" style={{ color: 'var(--text-secondary)' }}>services</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${cat.colorHex}18` }}>
                      <Clock size={12} style={{ color: cat.colorHex }} />
                    </div>
                    <div>
                      <p className="text-base font-bold" style={{ color: cat.colorHex }}>₹{cat.avgPrice.toLocaleString()}</p>
                      <p className="text-[10px] leading-none" style={{ color: 'var(--text-secondary)' }}>avg price</p>
                    </div>
                  </div>
                </div>

                {/* service share bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Service Share</span>
                    <span className="text-[10px] font-bold" style={{ color: cat.colorHex }}>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--hover)' }}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} transition-all duration-700`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add new card */}
        <button onClick={openAdd}
          className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition hover:border-[#9D679F] hover:bg-[#F9EEF4] dark:hover:bg-[#2d2029]"
          style={{ borderColor: 'var(--border)' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:bg-gradient-to-br group-hover:from-[#6F5AA3] group-hover:to-[#9D679F] group-hover:shadow-lg"
            style={{ background: 'var(--hover)' }}>
            <Plus size={22} className="transition group-hover:text-white" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <span className="text-sm font-semibold transition group-hover:text-[#9D679F]" style={{ color: 'var(--text-secondary)' }}>New Category</span>
        </button>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            {/* modal gradient top bar */}
            <div className={`h-1 bg-gradient-to-r ${form.gradient}`} />

            <div className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${form.gradient}`}>
                    <Layers size={14} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {editTarget ? 'Edit Category' : 'New Category'}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl transition"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Name input */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Category Name *</label>
                  <input type="text" placeholder="e.g. Bridal Services" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>

                {/* Color picker */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Color Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map(c => (
                      <button key={c.hex} onClick={() => setForm(f => ({ ...f, colorHex: c.hex, gradient: c.gradient }))}
                        className="group/c relative overflow-hidden rounded-xl p-3 transition"
                        style={{ border: form.colorHex === c.hex ? `2px solid ${c.hex}` : '1px solid var(--border)', background: form.colorHex === c.hex ? `${c.hex}10` : 'var(--bg-secondary)' }}>
                        <div className={`mx-auto h-6 w-6 rounded-lg bg-gradient-to-br ${c.gradient} shadow-sm`} />
                        <p className="mt-1.5 text-center text-[10px] font-semibold" style={{ color: form.colorHex === c.hex ? c.hex : 'var(--text-secondary)' }}>{c.label}</p>
                        {form.colorHex === c.hex && (
                          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: c.hex }}>
                            <Check size={9} className="text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live preview */}
                {form.name && (
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${form.colorHex}40` }}>
                    <div className={`h-1 bg-gradient-to-r ${form.gradient}`} />
                    <div className="flex items-center gap-3 p-3" style={{ background: `${form.colorHex}08` }}>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${form.gradient}`}>
                        <Layers size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{form.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Preview</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.name.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(111,90,163,0.35)] transition hover:opacity-90 disabled:opacity-40"
                  style={{ background: `linear-gradient(135deg,#6F5AA3,#9D679F)` }}>
                  <Save size={14} /> {editTarget ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
