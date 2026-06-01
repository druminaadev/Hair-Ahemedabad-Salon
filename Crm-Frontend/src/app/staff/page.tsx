'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Mail, Phone, Award } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatPhone, debounce, sanitizeInput, validateEmail } from '@/utils/helpers'
import api from '@/lib/api'
import type { Staff } from '@/types'

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async (search?: string) => {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const response = await api.get(`/staff${params}`)
      setStaff(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => {
    fetchStaff(value)
  }, 500)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return
    
    try {
      await api.delete(`/staff/${id}`)
      setStaff(staff.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete staff:', error)
      alert('Failed to delete staff member')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  const activeStaff = staff.filter(s => s.isActive).length
  const inactiveStaff = staff.filter(s => !s.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{staff.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Staff</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{activeStaff}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-600">{inactiveStaff}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Inactive</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No staff members found</p>
            </div>
          ) : (
            staff.map((member) => (
              <Card key={member.id} hover className="relative">
                <div className="absolute top-4 right-4">
                  <Badge status={member.isActive ? 'active' : 'inactive'}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                    {member.role}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={14} />
                    <span>{formatPhone(member.phone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award size={14} />
                    <span>Commission: {member.commissionRate}%</span>
                  </div>
                </div>

                {member.specialization && member.specialization.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Specialization</div>
                    <div className="flex flex-wrap gap-1">
                      {member.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setSelectedStaff(member)
                      setShowModal(true)
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 font-medium text-sm transition-colors"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium text-sm transition-colors"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedStaff(null)
        }}
        title={selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="lg"
      >
        <StaffForm
          staff={selectedStaff}
          onSuccess={() => {
            setShowModal(false)
            setSelectedStaff(null)
            fetchStaff()
          }}
        />
      </Modal>
    </div>
  )
}

function StaffForm({ staff, onSuccess }: { staff: Staff | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    role: staff?.role || 'stylist',
    specialization: staff?.specialization?.join(', ') || '',
    commissionRate: staff?.commissionRate || 10,
    isActive: staff?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = 'Commission must be between 0 and 100'
    }

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
        email: sanitizeInput(formData.email),
        phone: formData.phone,
        role: formData.role,
        specialization: formData.specialization
          ? formData.specialization.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        commissionRate: formData.commissionRate,
        isActive: formData.isActive,
      }

      if (staff) {
        await api.put(`/staff/${staff.id}`, data)
      } else {
        await api.post('/staff', data)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save staff:', error)
      alert('Failed to save staff member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="stylist">Stylist</option>
            <option value="assistant">Assistant</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <Input
          label="Commission Rate (%)"
          type="number"
          value={formData.commissionRate}
          onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
          error={errors.commissionRate}
          min="0"
          max="100"
          required
        />
      </div>

      <Input
        label="Specialization (comma-separated)"
        value={formData.specialization}
        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
        placeholder="e.g., Haircut, Coloring, Styling"
        helperText="Enter specializations separated by commas"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Active Staff Member
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {staff ? 'Update' : 'Create'} Staff
        </Button>
      </div>
    </form>
  )
}
