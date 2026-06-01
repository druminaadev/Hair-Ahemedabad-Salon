'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Tag, Copy } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency, formatDate, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { Discount } from '@/types'

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)

  useEffect(() => { fetchDiscounts() }, [])

  const fetchDiscounts = async () => {
    try {
      const res = await api.get('/discounts')
      setDiscounts(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount?')) return
    try {
      await api.delete(`/discounts/${id}`)
      setDiscounts(discounts.filter(d => d.id !== id))
    } catch (error) {
      alert('Failed to delete discount')
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Copied: ${code}`)
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const activeDiscounts = discounts.filter(d => d.isActive && new Date(d.validTo) >= new Date()).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discounts & Coupons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage discount codes and offers</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Discount
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{discounts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Discounts</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{activeDiscounts}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-amber-600">{discounts.reduce((sum, d) => sum + d.usedCount, 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Uses</div>
        </Card>
      </div>

      {discounts.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <Tag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Discounts Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create discount codes to attract more customers</p>
            <Button onClick={() => setShowModal(true)}>
              <Plus size={20} className="mr-2" />
              Create First Discount
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map(discount => {
            const isExpired = new Date(discount.validTo) < new Date()
            const isActive = discount.isActive && !isExpired
            return (
              <Card key={discount.id} className="relative">
                <div className="absolute top-4 right-4">
                  <Badge status={isActive ? 'active' : 'inactive'}>
                    {isExpired ? 'Expired' : isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                  <Tag className="text-amber-600" size={24} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <code className="text-lg font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    {discount.code}
                  </code>
                  <button onClick={() => copyCode(discount.code)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
                    <Copy size={14} className="text-gray-500" />
                  </button>
                </div>

                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {discount.type === 'percentage' ? `${discount.value}% OFF` : `${formatCurrency(discount.value)} OFF`}
                </div>

                {discount.minPurchase && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Min purchase: {formatCurrency(discount.minPurchase)}
                  </p>
                )}

                <div className="space-y-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>Valid: {formatDate(discount.validFrom)} – {formatDate(discount.validTo)}</div>
                  <div>Used: {discount.usedCount}{discount.usageLimit ? ` / ${discount.usageLimit}` : ''} times</div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => { setSelectedDiscount(discount); setShowModal(true) }} className="flex-1 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 font-medium text-sm transition-colors">
                    <Edit size={14} className="inline mr-1" />Edit
                  </button>
                  <button onClick={() => handleDelete(discount.id)} className="flex-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 font-medium text-sm transition-colors">
                    <Trash2 size={14} className="inline mr-1" />Delete
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedDiscount(null) }}
        title={selectedDiscount ? 'Edit Discount' : 'Add Discount'}
        size="md"
      >
        <DiscountForm
          discount={selectedDiscount}
          onSuccess={() => { setShowModal(false); setSelectedDiscount(null); fetchDiscounts() }}
        />
      </Modal>
    </div>
  )
}

function DiscountForm({ discount, onSuccess }: { discount: Discount | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    code: discount?.code || '',
    type: discount?.type || 'percentage',
    value: discount?.value || 0,
    minPurchase: discount?.minPurchase || 0,
    maxDiscount: discount?.maxDiscount || 0,
    validFrom: discount?.validFrom?.split('T')[0] || new Date().toISOString().split('T')[0],
    validTo: discount?.validTo?.split('T')[0] || '',
    usageLimit: discount?.usageLimit || 0,
    isActive: discount?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || formData.value <= 0 || !formData.validTo) { alert('Please fill all required fields'); return }
    setLoading(true)
    try {
      const data = {
        ...formData,
        code: sanitizeInput(formData.code.toUpperCase()),
        minPurchase: formData.minPurchase || undefined,
        maxDiscount: formData.maxDiscount || undefined,
        usageLimit: formData.usageLimit || undefined,
      }
      if (discount) {
        await api.put(`/discounts/${discount.id}`, data)
      } else {
        await api.post('/discounts', data)
      }
      onSuccess()
    } catch (error) {
      alert('Failed to save discount')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Discount Code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., SAVE20" required />
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type *</label>
          <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label={`Value (${formData.type === 'percentage' ? '%' : '₹'})`} type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} min="0" required />
        <Input label="Min Purchase (₹)" type="number" value={formData.minPurchase} onChange={e => setFormData({ ...formData, minPurchase: Number(e.target.value) })} min="0" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Valid From" type="date" value={formData.validFrom} onChange={e => setFormData({ ...formData, validFrom: e.target.value })} required />
        <Input label="Valid To" type="date" value={formData.validTo} onChange={e => setFormData({ ...formData, validTo: e.target.value })} required />
      </div>
      <Input label="Usage Limit (0 = unlimited)" type="number" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })} min="0" />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" isLoading={loading}>{discount ? 'Update' : 'Create'} Discount</Button>
      </div>
    </form>
  )
}
