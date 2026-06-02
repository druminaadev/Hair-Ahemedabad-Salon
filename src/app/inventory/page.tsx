'use client'

import { useState } from 'react'
import { Package, Plus, AlertTriangle, TrendingDown, Search, Edit2, Trash2 } from 'lucide-react'

const MOCK_PRODUCTS = [
  { id: 1, name: 'ABC Shampoo',        sku: 'SHP001', category: 'Shampoo',     stock: 15, minThreshold: 10, unit: 'bottle', costPrice: 200, sellingPrice: 350,  isConsumable: true,  usagePerService: 1 },
  { id: 2, name: 'XYZ Hair Color',     sku: 'CLR001', category: 'Color',       stock: 3,  minThreshold: 5,  unit: 'bottle', costPrice: 800, sellingPrice: 1200, isConsumable: true,  usagePerService: 1 },
  { id: 3, name: 'Premium Conditioner',sku: 'CND001', category: 'Conditioner', stock: 25, minThreshold: 10, unit: 'bottle', costPrice: 150, sellingPrice: 280,  isConsumable: true,  usagePerService: 1 },
  { id: 4, name: 'Hair Treatment Oil', sku: 'TRT001', category: 'Treatment',   stock: 0,  minThreshold: 5,  unit: 'bottle', costPrice: 300, sellingPrice: 500,  isConsumable: false, usagePerService: 0 },
  { id: 5, name: 'Styling Gel',        sku: 'STY001', category: 'Styling',     stock: 18, minThreshold: 8,  unit: 'bottle', costPrice: 180, sellingPrice: 320,  isConsumable: true,  usagePerService: 1 },
]

export default function InventoryPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'low') return p.stock <= p.minThreshold && p.stock > 0
    if (filter === 'out') return p.stock === 0
    return true
  })

  const lowStock  = products.filter(p => p.stock <= p.minThreshold && p.stock > 0).length
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-violet-500" />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Inventory Management</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Total Products</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{products.length}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #f59e0b' }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-amber-600"><AlertTriangle size={12} />Low Stock</div>
          <div className="text-2xl font-bold text-amber-600">{lowStock}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #ef4444' }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-red-600"><TrendingDown size={12} />Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #10b981' }}>
          <div className="text-xs font-semibold mb-1 text-emerald-600">Inventory Value</div>
          <div className="text-2xl font-bold text-emerald-600">
            ₹{products.reduce((sum, p) => sum + p.stock * p.costPrice, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: 'All' }, { key: 'low', label: 'Low Stock' }, { key: 'out', label: 'Out of Stock' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: filter === f.key ? '#7c3aed' : 'var(--hover)',
                color: filter === f.key ? '#fff' : 'var(--text-secondary)',
                border: filter === f.key ? 'none' : '1px solid var(--border)',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--hover)' }}>
                {['Product', 'SKU', 'Category', 'Stock', 'Cost', 'Selling', 'Consumable', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold ${i >= 3 ? 'text-center' : 'text-left'}`}
                    style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const isLow = product.stock <= product.minThreshold && product.stock > 0
                const isOut = product.stock === 0
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                          <Package size={14} className="text-violet-600" />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{product.sku}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`text-sm font-bold ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {product.stock}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{product.unit}</span>
                        {isLow && <AlertTriangle size={12} className="text-amber-500" />}
                        {isOut && <TrendingDown size={12} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>₹{product.costPrice}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-violet-600">₹{product.sellingPrice}</td>
                    <td className="px-4 py-3 text-center">
                      {product.isConsumable ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                          Yes ({product.usagePerService}/service)
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => alert(`Edit product: ${product.name}`)}
                          className="p-1.5 rounded-lg transition" style={{ background: 'var(--hover)' }}>
                          <Edit2 size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button onClick={() => { if (confirm(`Delete ${product.name}?`)) setProducts(products.filter(p => p.id !== product.id)) }}
                          className="p-1.5 rounded-lg transition hover:bg-red-100 dark:hover:bg-red-900/20">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
