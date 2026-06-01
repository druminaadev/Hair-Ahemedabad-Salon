'use client'

import { useState } from 'react'
import { Trash2, DollarSign, CreditCard, Smartphone, Wallet } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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

type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet'

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">POS Billing</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quick billing for walk-in customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Customer Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter name"
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone"
                required
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Select Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => addService(service)}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-salon-400 hover:bg-salon-100/20 dark:hover:bg-salon-900/20 transition-all text-left"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{service.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{service.category}</div>
                  <div className="text-salon-600 dark:text-salon-100 font-semibold mt-2">
                    {formatCurrency(service.price)}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Selected Services
            </h2>
            {selectedServices.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No services selected
              </p>
            ) : (
              <div className="space-y-3">
                {selectedServices.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {item.service.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.service.price)} x {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white w-24 text-right">
                        {formatCurrency(item.service.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeService(item.service.id)}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Assign Staff
            </h2>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400"
              required
            >
              <option value="">Select staff member</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'cash', label: 'Cash', icon: DollarSign },
                { value: 'card', label: 'Card', icon: CreditCard },
                { value: 'upi', label: 'UPI', icon: Smartphone },
                { value: 'wallet', label: 'Wallet', icon: Wallet },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === method.value
                      ? 'border-salon-400 bg-salon-100/20 dark:bg-salon-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <method.icon size={20} className="mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {method.label}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Bill Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Discount</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-16 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-600 dark:text-gray-400">%</span>
                </div>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Discount Amount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
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
        </div>
      </div>
    </div>
  )
}
