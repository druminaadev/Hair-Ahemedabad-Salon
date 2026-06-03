'use client'

import { useState } from 'react'
import { Plus, Search, Phone, Mail, X } from 'lucide-react'
import ClientForm from '@/components/forms/ClientForm'

const initialClients = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@example.com',  phone: '+91 98765 43210', visits: 24, lastVisit: '2024-01-10', spent: '₹12,400' },
  { id: 2, name: 'Riya Patel',    email: 'riya@example.com',   phone: '+91 98765 43211', visits: 18, lastVisit: '2024-01-12', spent: '₹9,800'  },
  { id: 3, name: 'Anita Verma',   email: 'anita@example.com',  phone: '+91 98765 43212', visits: 32, lastVisit: '2024-01-14', spent: '₹18,200' },
  { id: 4, name: 'Meena Joshi',   email: 'meena@example.com',  phone: '+91 98765 43213', visits: 15, lastVisit: '2024-01-08', spent: '₹7,500'  },
  { id: 5, name: 'Sunita Rao',    email: 'sunita@example.com', phone: '+91 98765 43214', visits: 28, lastVisit: '2024-01-13', spent: '₹15,600' },
]

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data: any) => {
    setClients(p => [...p, { id: Date.now(), ...data, visits: 0, lastVisit: '-', spent: '₹0' }])
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition" style={{ background: '#CF455C' }}>
          <Plus size={15} /> Add Client
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase" style={{ background: 'var(--hover)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {['Name', 'Contact', 'Visits', 'Last Visit', 'Total Spent', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border)' }}>
              {filtered.map(c => (
                <tr key={c.id} className="transition" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: '#CF455C' }}>
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Mail size={12} />{c.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Phone size={12} />{c.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{c.visits}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{c.lastVisit}</td>
                  <td className="px-6 py-4 font-semibold text-salon-600 dark:text-salon-100">{c.spent}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => alert(`View details for ${c.name}`)}
                        className="text-xs font-medium hover:underline" style={{ color: '#CF455C' }}>View</button>
                      <button onClick={() => { if (confirm(`Delete ${c.name}?`)) setClients(clients.filter(x => x.id !== c.id)) }}
                        className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No clients found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add New Client</h2>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={18} />
              </button>
            </div>
            <ClientForm onClose={() => setShowModal(false)} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
  )
}
