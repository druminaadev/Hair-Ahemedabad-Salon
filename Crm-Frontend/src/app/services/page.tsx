'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Scissors, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency, debounce, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { Service } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [categoryFilter])

  const fetchServices = async (search?: string) => {
    try {
      let params = '?'
      if (search) params += `search=${encodeURIComponent(search)}&`
      if (categoryFilter !== 'all') params += `category=${categoryFilter}&`
      
      const response = await api.get(`/services${params}`)
      setServices(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => {
    fetchServices(value)
  }, 500)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      await api.delete(`/services/${id}`)
      setServices(services.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete service:', error)
      alert('Failed to delete service')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" />
      </div>
    )
  }

  const categories = Array.from(new Set(services.map(s => s.category)))
  const activeServices = services.filter(s => s.isActive).length
  const inactiveServices = services.filter(s => !s.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your service catalog
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{services.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Services</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{activeServices}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-600">{inactiveServices}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Inactive</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Scissors size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No services found</p>
            </div>
          ) : (
            services.map((service) => (
              <Card key={service.id} hover className="relative">
                <div className="absolute top-4 right-4">
                  <Badge status={service.isActive ? 'active' : 'inactive'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-3">
                    <Scissors className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                    {service.category}
                  </p>
                </div>

                {service.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
                    <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                      {formatCurrency(service.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                      <Clock size={14} />
                      {service.duration} min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service)
                      setShowModal(true)
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 font-medium text-sm transition-colors"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
          setSelectedService(null)
        }}
        title={selectedService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <ServiceForm
          service={selectedService}
          onSuccess={() => {
            setShowModal(false)
            setSelectedService(null)
            fetchServices()
          }}
        />
      </Modal>
    </div>
  )
}

function ServiceForm({ service, onSuccess }: { service: Service | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || '',
    price: service?.price || 0,
    duration: service?.duration || 30,
    description: service?.description || '',
    isActive: service?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0'

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
        price: formData.price,
        duration: formData.duration,
        description: sanitizeInput(formData.description),
        isActive: formData.isActive,
      }

      if (service) {
        await api.put(`/services/${service.id}`, data)
      } else {
        await api.post('/services', data)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save service:', error)
      alert('Failed to save service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Service Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="e.g., Haircut, Hair Coloring"
        required
      />

      <Input
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        placeholder="e.g., Hair, Spa, Makeup"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          error={errors.price}
          min="0"
          step="10"
          required
        />
        <Input
          label="Duration (minutes)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          error={errors.duration}
          min="5"
          step="5"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          placeholder="Brief description of the service..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Active Service
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {service ? 'Update' : 'Create'} Service
        </Button>
      </div>
    </form>
  )
}
