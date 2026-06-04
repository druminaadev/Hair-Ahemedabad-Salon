'use client'

import { useState } from 'react'
import { Trash2, DollarSign, CreditCard, Smartphone, Wallet, Plus, Minus, User, Phone } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/utils/helpers'
import type { Service, Staff } from '@/types'

const FALLBACK_SERVICES: Service[] = [
  { id: 'haircut', name: 'Haircut', category: 'Hair', price: 500, duration: 30, isActive: true, createdAt: '' },
  { id: 'hair-coloring', name: 'Hair Coloring', category: 'Hair', price: 2000, duration: 90, isActive: true, createdAt: '' },
  { id: 'hair-spa', name: 'Hair Spa', category: 'Hair', price: 1200, duration: 60, isActive: true, createdAt: '' },
  { id: 'facial', name: 'Facial', category: 'Skin', price: 800, duration: 60, isActive: true, createdAt: '' },
  { id: 'manicure', name: 'Manicure', category: 'Nails', price: 400, duration: 45, isActive: true, createdAt: '' },
  { id: 'pedicure', name: 'Pedicure', category: 'Nails', price: 500, duration: 45, isActive: true, createdAt: '' },
  { id: 'waxing-full', name: 'Waxing (Full)', category: 'Body', price: 1000, duration: 60, isActive: true, createdAt: '' },
  { id: 'bridal-makeup', name: 'Bridal Makeup', category: 'Makeup', price: 5000, duration: 120, isActive: true, createdAt: '' },
]

const FALLBACK_STAFF: Staff[] = [
  { id: 'priya', name: 'Priya Kumar', email: '', phone: '', role: 'stylist', specialization: ['Hair'], commissionRate: 0, isActive: true, createdAt: '' },
  { id: 'rahul', name: 'Rahul Verma', email: '', phone: '', role: 'stylist', specialization: ['Hair Color'], commissionRate: 0, isActive: true, createdAt: '' },
  { id: 'sonal', name: 'Sonal Patel', email: '', phone: '', role: 'stylist', specialization: ['Nails'], commissionRate: 0, isActive: true, createdAt: '' },
  { id: 'ritu', name: 'Ritu Joshi', email: '', phone: '', role: 'stylist', specialization: ['Makeup'], commissionRate: 0, isActive: true, createdAt: '' },
]

// Uses global salon + support palette from tailwind.config.ts
const CATEGORY_COLORS: Record<string, string> = {
  Hair:   'bg-salon-50 text-salon-600 dark:bg-salon-900/40 dark:text-salon-100',
  Skin:   'bg-salon-50 text-support-sage dark:bg-salon-900/20 dark:text-support-sage',
  Nails:  'bg-salon-50 text-support-plum dark:bg-salon-900/30 dark:text-support-plum',
  Body:   'bg-salon-50 text-support-gold dark:bg-salon-900/20 dark:text-support-gold',
  Makeup: 'bg-salon-50 text-support-sky dark:bg-salon-900/30 dark:text-support-sky',
}

const getCategoryClass = (category: string) =>
  CATEGORY_COLORS[category] ?? 'bg-salon-50 text-salon-600'

type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet'

const PAYMENT_METHODS = [
  { value: 'cash' as PaymentMethod, label: 'Cash', icon: DollarSign },
  { value: 'card' as PaymentMethod, label: 'Card', icon: CreditCard },
  { value: 'upi' as PaymentMethod, label: 'UPI', icon: Smartphone },
  { value: 'wallet' as PaymentMethod, label: 'Wallet', icon: Wallet },
]

export default function POSPage() {
  const [services] = useState<Service[]>(FALLBACK_SERVICES)
  const [staff] = useState<Staff[]>(FALLBACK_STAFF)
  const [selectedServices, setSelectedServices] = useState<Array<{ service: Service; quantity: number }>>([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  const addService = (service: Service) => {
    const existing = selectedServices.find(s => s.service.id === service.id)
    if (existing) {
      setSelectedServices(selectedServices.map(s =>
        s.service.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
      ))
    } else {
      setSelectedServices([...selectedServices, { service, quantity: 1 }])
    }
  }

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.service.id !== serviceId))
  }

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedServices(selectedServices.map(s =>
      s.service.id === serviceId ? { ...s, quantity } : s
    ))
  }

  const subtotal = selectedServices.reduce((sum, item) => sum + (item.service.price * item.quantity), 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !selectedStaff || selectedServices.length === 0) {
      alert('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      alert('Billing completed successfully!')
      resetForm()
    } catch (error) {
      console.error('Failed to complete billing:', error)
      alert('Failed to complete billing')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedServices([])
    setCustomerName('')
    setCustomerPhone('')
    setSelectedStaff('')
    setDiscount(0)
    setPaymentMethod('cash')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Point of Sale</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Quick billing for walk-in clients</p>
        </div>
        {selectedServices.length > 0 && (
          <button
            onClick={resetForm}
            className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Client Details */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Client Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Services */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Services</h2>
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">Click to add</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {services.map((service) => {
                const isAdded = selectedServices.some(s => s.service.id === service.id)
                return (
                  <button
                    key={service.id}
                    onClick={() => addService(service)}
                    className={`relative p-3.5 rounded-xl border-2 transition-all text-left group ${
                      isAdded
                        ? 'border-salon-400 bg-salon-50 dark:bg-salon-900/20'
                        : 'border-gray-100 dark:border-gray-700 hover:border-salon-300 dark:hover:border-salon-700 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                  >
                    {isAdded && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-salon-500" />
                    )}
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${getCategoryClass(service.category)}`}>
                      {service.category}
                    </span>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{service.name}</div>
                    <div className="text-sm font-bold text-salon-600 dark:text-salon-400 mt-1.5">
                      {formatCurrency(service.price)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{service.duration} min</div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Cart */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Cart</h2>
              {selectedServices.length > 0 && (
                <span className="ml-1 text-xs bg-salon-100 dark:bg-salon-900/40 text-salon-700 dark:text-salon-300 font-semibold px-2 py-0.5 rounded-full">
                  {selectedServices.length} item{selectedServices.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {selectedServices.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <p className="text-sm text-gray-400 dark:text-gray-500">No services added yet</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Select services from above</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {selectedServices.map((item) => (
                  <div key={item.service.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{item.service.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {formatCurrency(item.service.price)} per session
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 flex items-center justify-center shadow-sm transition-colors"
                        >
                          <Minus size={12} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 flex items-center justify-center shadow-sm transition-colors"
                        >
                          <Plus size={12} className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">
                        {formatCurrency(item.service.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeService(item.service.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400 hover:text-red-600 dark:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">

          {/* Assign Staff */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Assign Staff</h2>
            </div>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent transition-all"
            >
              <option value="">Select staff member</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {selectedStaff && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pl-1">
                {staff.find(s => s.id === selectedStaff)?.specialization.join(', ')} Specialist
              </p>
            )}
          </Card>

          {/* Payment Method */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Payment Method</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon
                const isSelected = paymentMethod === method.value
                return (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-salon-400 bg-salon-50 dark:bg-salon-900/20'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-salon-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      <Icon size={14} />
                    </div>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-salon-700 dark:text-salon-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {method.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Bill Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-salon-600 rounded-full" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Bill Summary</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span>Discount</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-14 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-salon-400 transition-all"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-xs">%</span>
                </div>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-red-500 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg">
                  <span>Discount applied</span>
                  <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 mt-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Payable</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">{paymentMethod} payment</span>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleCheckout}
            className="w-full"
            size="lg"
            isLoading={loading}
            disabled={selectedServices.length === 0 || !customerName || !customerPhone || !selectedStaff}
          >
            Complete Billing
          </Button>

          {(selectedServices.length === 0 || !customerName || !customerPhone || !selectedStaff) && (
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 -mt-3">
              Fill all fields and add at least one service
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
