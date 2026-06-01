'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatPhone, formatCurrency, formatDate, debounce } from '@/utils/helpers'
import api from '@/lib/api'
import type { Customer } from '@/types'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async (search?: string) => {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const response = await api.get(`/customers${params}`)
      setCustomers(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => {
    fetchCustomers(value)
  }, 500)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    
    try {
      await api.delete(`/customers/${id}`)
      setCustomers(customers.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete customer:', error)
      alert('Failed to delete customer')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your customer database
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch(e.target.value)
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400"
            />
          </div>
          <Button variant="secondary">
            <Filter size={20} className="mr-2" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Loyalty Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No customers found. Add your first customer to get started.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-salon-100/40 dark:bg-salon-900/20 flex items-center justify-center">
                          <span className="text-salon-600 dark:text-salon-100 font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Phone size={14} />
                          {formatPhone(customer.phone)}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Mail size={14} />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-salon-600 dark:text-salon-100">
                        {customer.loyaltyPoints} pts
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {customer.totalVisits}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.membershipTier ? (
                        <Badge status="active">{customer.membershipTier}</Badge>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                          aria-label="View customer"
                        >
                          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowModal(true)
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                          aria-label="Edit customer"
                        >
                          <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                          aria-label="Delete customer"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedCustomer(null)
        }}
        title={selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={selectedCustomer}
          onSuccess={() => {
            setShowModal(false)
            setSelectedCustomer(null)
            fetchCustomers()
          }}
        />
      </Modal>
    </div>
  )
}

function CustomerForm({ customer, onSuccess }: { customer: Customer | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    gender: customer?.gender || 'male',
    dateOfBirth: customer?.dateOfBirth || '',
    address: customer?.address || '',
    notes: customer?.notes || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (customer) {
        await api.put(`/customers/${customer.id}`, formData)
      } else {
        await api.post('/customers', formData)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save customer:', error)
      alert('Failed to save customer')
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
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Input
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />
      </div>

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400 resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {customer ? 'Update' : 'Create'} Customer
        </Button>
      </div>
    </form>
  )
}
