'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency, formatDate, debounce, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { InventoryItem } from '@/types'

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    fetchInventory()
  }, [categoryFilter, stockFilter])

  const fetchInventory = async (search?: string) => {
    try {
      let params = '?'
      if (search) params += `search=${encodeURIComponent(search)}&`
      if (categoryFilter !== 'all') params += `category=${categoryFilter}&`
      if (stockFilter === 'low') params += `lowStock=true&`
      if (stockFilter === 'out') params += `outOfStock=true&`
      
      const response = await api.get(`/inventory${params}`)
      setInventory(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => {
    fetchInventory(value)
  }, 500)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await api.delete(`/inventory/${id}`)
      setInventory(inventory.filter(i => i.id !== id))
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { status: 'out', label: 'Out of Stock', color: 'text-red-600' }
    if (item.quantity <= item.minStockLevel) return { status: 'low', label: 'Low Stock', color: 'text-amber-600' }
    return { status: 'good', label: 'In Stock', color: 'text-emerald-600' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  const categories = Array.from(new Set(inventory.map(i => i.category)))
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStockLevel && i.quantity > 0).length
  const outOfStockItems = inventory.filter(i => i.quantity === 0).length
  const totalValue = inventory.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track products and stock levels
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Items</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{inventory.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
              <Package className="text-violet-600 dark:text-violet-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Low Stock</div>
              <div className="text-3xl font-bold text-amber-600">{lowStockItems}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Out of Stock</div>
              <div className="text-3xl font-bold text-red-600">{outOfStockItems}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalValue)}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    No inventory items found
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const stockStatus = getStockStatus(item)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          {item.brand && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {item.brand}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.quantity} {item.unit}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Min: {item.minStockLevel}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            stockStatus.status === 'out' ? 'bg-red-600' :
                            stockStatus.status === 'low' ? 'bg-amber-600' :
                            'bg-emerald-600'
                          }`} />
                          <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setShowModal(true)
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                            aria-label="Edit item"
                          >
                            <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                            aria-label="Delete item"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedItem(null)
        }}
        title={selectedItem ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <InventoryForm
          item={selectedItem}
          onSuccess={() => {
            setShowModal(false)
            setSelectedItem(null)
            fetchInventory()
          }}
        />
      </Modal>
    </div>
  )
}

function InventoryForm({ item, onSuccess }: { item: InventoryItem | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    brand: item?.brand || '',
    quantity: item?.quantity || 0,
    unit: item?.unit || 'pcs',
    minStockLevel: item?.minStockLevel || 10,
    price: item?.price || 0,
    supplier: item?.supplier || '',
    expiryDate: item?.expiryDate || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative'
    if (formData.minStockLevel < 0) newErrors.minStockLevel = 'Min stock level cannot be negative'
    if (formData.price < 0) newErrors.price = 'Price cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)
    try {
      const data = {
        name: sanitizeInput(formData.name),
        category: sanitizeInput(formData.category),
        brand: sanitizeInput(formData.brand),
        quantity: formData.quantity,
        unit: formData.unit,
        minStockLevel: formData.minStockLevel,
        price: formData.price,
        supplier: sanitizeInput(formData.supplier),
        expiryDate: formData.expiryDate || undefined,
      }

      if (item) {
        await api.put(`/inventory/${item.id}`, data)
      } else {
        await api.post('/inventory', data)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save item:', error)
      alert('Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="e.g., Shampoo, Hair Oil"
          required
        />
        <Input
          label="Brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., L'Oreal, Dove"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          error={errors.category}
          placeholder="e.g., Hair Care, Skin Care"
          required
        />
        <Input
          label="Supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          placeholder="Supplier name"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          error={errors.quantity}
          min="0"
          required
        />
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Unit *
          </label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="pcs">Pieces</option>
            <option value="ml">ML</option>
            <option value="l">Liters</option>
            <option value="g">Grams</option>
            <option value="kg">KG</option>
            <option value="box">Box</option>
          </select>
        </div>
        <Input
          label="Min Stock Level"
          type="number"
          value={formData.minStockLevel}
          onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
          error={errors.minStockLevel}
          min="0"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price per Unit (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          error={errors.price}
          min="0"
          step="0.01"
          required
        />
        <Input
          label="Expiry Date (Optional)"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {item ? 'Update' : 'Add'} Product
        </Button>
      </div>
    </form>
  )
}
