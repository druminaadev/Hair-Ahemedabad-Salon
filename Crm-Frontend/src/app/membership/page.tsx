'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, CreditCard, Crown, Star } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { Membership } from '@/types'

export default function MembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null)

  useEffect(() => { fetchMemberships() }, [])

  const fetchMemberships = async () => {
    try {
      const res = await api.get('/memberships')
      setMemberships(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch memberships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this membership plan?')) return
    try {
      await api.delete(`/memberships/${id}`)
      setMemberships(memberships.filter(m => m.id !== id))
    } catch (error) {
      alert('Failed to delete membership')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const tierIcons: Record<string, any> = { silver: Star, gold: Crown, platinum: CreditCard }
  const tierColors: Record<string, string> = {
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-amber-400 to-amber-500',
    platinum: 'from-violet-500 to-violet-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Membership Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage membership tiers and benefits</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{memberships.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Plans</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{memberships.filter(m => m.isActive).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Plans</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-violet-600">{memberships.filter(m => m.tier === 'platinum').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Platinum Plans</div>
        </Card>
      </div>

      {memberships.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Membership Plans</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create membership plans to offer to your customers</p>
            <Button onClick={() => setShowModal(true)}>
              <Plus size={20} className="mr-2" />
              Create First Plan
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map(membership => {
            const TierIcon = tierIcons[membership.tier] || Star
            const gradient = tierColors[membership.tier] || 'from-gray-400 to-gray-500'
            return (
              <Card key={membership.id} className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge status={membership.isActive ? 'active' : 'inactive'}>
                    {membership.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                  <TierIcon className="text-white" size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{membership.name}</h3>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium capitalize mb-4">{membership.tier} Tier</p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(membership.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{membership.duration} days</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Discount</div>
                    <div className="text-sm font-semibold text-emerald-600">{membership.discount}% off</div>
                  </div>
                </div>

                {membership.benefits.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Benefits</div>
                    <ul className="space-y-1">
                      {membership.benefits.slice(0, 3).map((benefit, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                      {membership.benefits.length > 3 && (
                        <li className="text-xs text-gray-500 dark:text-gray-400">+{membership.benefits.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => { setSelectedMembership(membership); setShowModal(true) }} className="flex-1 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 font-medium text-sm transition-colors">
                    <Edit size={14} className="inline mr-1" />Edit
                  </button>
                  <button onClick={() => handleDelete(membership.id)} className="flex-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 font-medium text-sm transition-colors">
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
        onClose={() => { setShowModal(false); setSelectedMembership(null) }}
        title={selectedMembership ? 'Edit Membership Plan' : 'Add Membership Plan'}
        size="lg"
      >
        <MembershipForm
          membership={selectedMembership}
          onSuccess={() => { setShowModal(false); setSelectedMembership(null); fetchMemberships() }}
        />
      </Modal>
    </div>
  )
}

function MembershipForm({ membership, onSuccess }: { membership: Membership | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: membership?.name || '',
    tier: membership?.tier || 'silver',
    price: membership?.price || 0,
    duration: membership?.duration || 30,
    benefits: membership?.benefits.join('\n') || '',
    discount: membership?.discount || 0,
    isActive: membership?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || formData.price <= 0) { alert('Please fill all required fields'); return }
    setLoading(true)
    try {
      const data = {
        name: sanitizeInput(formData.name),
        tier: formData.tier,
        price: formData.price,
        duration: formData.duration,
        benefits: formData.benefits.split('\n').map(b => b.trim()).filter(Boolean),
        discount: formData.discount,
        isActive: formData.isActive,
      }
      if (membership) {
        await api.put(`/memberships/${membership.id}`, data)
      } else {
        await api.post('/memberships', data)
      }
      onSuccess()
    } catch (error) {
      alert('Failed to save membership plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Plan Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Gold Membership" required />
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tier *</label>
          <select value={formData.tier} onChange={e => setFormData({ ...formData, tier: e.target.value as any })} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Price (₹)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} min="0" required />
        <Input label="Duration (days)" type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} min="1" required />
        <Input label="Discount (%)" type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} min="0" max="100" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefits (one per line)</label>
        <textarea value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" placeholder="Free haircut&#10;10% discount on services&#10;Priority booking" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Plan</label>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" isLoading={loading}>{membership ? 'Update' : 'Create'} Plan</Button>
      </div>
    </form>
  )
}
