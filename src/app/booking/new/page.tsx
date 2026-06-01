'use client'

import { useState } from 'react'
import {
  Scissors,
  Clock,
  ChevronRight,
  CheckCircle2,
  ShoppingCart,
  Trash2,
  User,
  CalendarDays,
  Sparkles,
  Star,
  BadgePercent,
} from 'lucide-react'

const CATEGORIES = ['All', 'Hair', 'Skin', 'Nails', 'Body', 'Makeup']

const SERVICES = [
  { id: 1, name: 'Haircut', category: 'Hair', price: 500, duration: 30, rating: 4.8 },
  { id: 2, name: 'Hair Coloring', category: 'Hair', price: 2000, duration: 90, rating: 4.9 },
  { id: 3, name: 'Hair Spa', category: 'Hair', price: 1200, duration: 60, rating: 4.7 },
  { id: 4, name: 'Facial', category: 'Skin', price: 800, duration: 60, rating: 4.8 },
  { id: 5, name: 'Manicure', category: 'Nails', price: 400, duration: 45, rating: 4.6 },
  { id: 6, name: 'Pedicure', category: 'Nails', price: 500, duration: 45, rating: 4.7 },
  { id: 7, name: 'Waxing (Full)', category: 'Body', price: 1000, duration: 60, rating: 4.5 },
  { id: 8, name: 'Bridal Makeup', category: 'Makeup', price: 5000, duration: 120, rating: 5 },
]

const COMBOS = [
  { id: 101, name: 'Cut + Color', price: 2400, originalPrice: 2500, tag: '10% off' },
  { id: 102, name: 'Mani + Pedi', price: 800, originalPrice: 900, tag: '11% off' },
]

const STAFF = [
  { id: 1, name: 'Priya Kumar', role: 'Senior Stylist', speciality: 'Hair', color: 'bg-salon-600' },
  { id: 2, name: 'Rahul Verma', role: 'Color Expert', speciality: 'Hair', color: 'bg-salon-400' },
  { id: 3, name: 'Sonal Patel', role: 'Nail Artist', speciality: 'Nails', color: 'bg-emerald-500' },
  { id: 4, name: 'Ritu Joshi', role: 'Makeup Artist', speciality: 'Makeup', color: 'bg-amber-500' },
]

const SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
]

const STEPS = [
  { label: 'Services', icon: Scissors },
  { label: 'Stylist', icon: User },
  { label: 'Date & Time', icon: CalendarDays },
  { label: 'Confirm', icon: CheckCircle2 },
]

interface CartItem {
  serviceId: number
  name: string
  price: number
  duration: number
  staffIds: number[]
  staffNames: string[]
  qty: number
  isCombo?: boolean
}

export default function NewBookingPage() {
  const [step, setStep] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [category, setCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const addService = (service: (typeof SERVICES)[number]) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.serviceId === service.id && !item.isCombo)

      if (existing) {
        return previous.map((item) =>
          item.serviceId === service.id && !item.isCombo ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [
        ...previous,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          qty: 1,
          staffIds: [],
          staffNames: [],
        },
      ]
    })
  }

  const addCombo = (combo: (typeof COMBOS)[number]) => {
    setCart((previous) => [
      ...previous,
      {
        serviceId: combo.id,
        name: combo.name,
        price: combo.price,
        duration: 90,
        qty: 1,
        staffIds: [],
        staffNames: [],
        isCombo: true,
      },
    ])
  }

  const removeItem = (id: number) => setCart((previous) => previous.filter((item) => item.serviceId !== id))

  const updateQty = (serviceId: number, delta: number) => {
    setCart((previous) =>
      previous.map((item) =>
        item.serviceId === serviceId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    )
  }

  const toggleStaff = (serviceId: number, staffId: number, staffName: string) => {
    setCart((previous) =>
      previous.map((item) => {
        if (item.serviceId !== serviceId) return item

        const hasStaff = item.staffIds.includes(staffId)

        return {
          ...item,
          staffIds: hasStaff ? item.staffIds.filter((id) => id !== staffId) : [...item.staffIds, staffId],
          staffNames: hasStaff
            ? item.staffNames.filter((name) => name !== staffName)
            : [...item.staffNames, staffName],
        }
      })
    )
  }

  const resetBooking = () => {
    setConfirmed(false)
    setStep(0)
    setCart([])
    setClientName('')
    setClientPhone('')
    setSelectedDate('')
    setSelectedSlot('')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst
  const filteredServices = category === 'All' ? SERVICES : SERVICES.filter((service) => service.category === category)

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {clientName} · {selectedDate} at {selectedSlot}
        </p>
        <button
          onClick={resetBooking}
          className="mt-2 rounded-xl bg-salon-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-salon-900"
        >
          New Booking
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Booking</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select services, assign staff, and confirm the appointment.</p>
      </div>

      <div className="flex items-center">
        {STEPS.map((item, index) => {
          const done = index < step
          const current = index === step

          return (
            <div key={item.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done || current
                      ? 'bg-salon-600 text-white shadow-sm shadow-salon-100 dark:shadow-none'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  } ${current ? 'ring-4 ring-salon-100/40 dark:ring-salon-900/50' : ''}`}
                >
                  {done ? <CheckCircle2 size={14} /> : <item.icon size={13} />}
                </div>
                <span
                  className={`hidden text-xs font-semibold sm:block ${
                    current || done ? 'text-salon-600 dark:text-salon-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`mx-3 h-px flex-1 ${index < step ? 'bg-salon-100' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {step === 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-5 pb-4 dark:border-gray-700">
                <div className="mb-3 flex items-center gap-2">
                  <BadgePercent size={14} className="text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Combo Packages</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {COMBOS.map((combo) => {
                    const inCart = cart.some((item) => item.serviceId === combo.id && item.isCombo)

                    return (
                      <button
                        key={combo.id}
                        onClick={() => addCombo(combo)}
                        className={`relative rounded-xl p-4 text-left transition-all ${
                          inCart
                            ? 'border-2 border-salon-600 bg-salon-100/10'
                            : 'border border-gray-200 bg-gray-50 hover:border-salon-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-salon-400'
                        }`}
                      >
                        <span className="absolute right-2.5 top-2.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                          {combo.tag}
                        </span>
                        <div className="mb-1.5 text-sm font-semibold text-gray-900 dark:text-white">{combo.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-salon-600 dark:text-salon-100">₹{combo.price}</span>
                          <span className="text-xs text-gray-500 line-through dark:text-gray-400">₹{combo.originalPrice}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors size={14} className="text-salon-600 dark:text-salon-100" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Individual Services</span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {CATEGORIES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        category === item
                          ? 'bg-salon-600 text-white'
                          : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredServices.map((service) => {
                    const inCart = cart.find((item) => item.serviceId === service.id)

                    return (
                      <button
                        key={service.id}
                        onClick={() => addService(service)}
                        className={`group flex items-center justify-between rounded-xl p-3.5 text-left transition-all ${
                          inCart
                            ? 'border-2 border-salon-600 bg-salon-100/10'
                            : 'border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">{service.name}</div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                              <Clock size={10} />{service.duration} min
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
                              <Star size={9} fill="currentColor" />{service.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-sm font-bold text-salon-600 dark:text-salon-100">₹{service.price}</span>
                          {inCart && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-salon-600 text-[10px] font-bold text-white">
                              {inCart.qty}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <User size={15} className="text-salon-600 dark:text-salon-100" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Assign Stylist</h2>
                <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-[10px] text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">Multiple allowed</span>
              </div>
              {cart.map((item) => (
                <div key={item.serviceId} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Scissors size={13} className="text-salon-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                    {item.qty > 1 && <span className="rounded-full bg-salon-100/25 px-1.5 py-0.5 text-[10px] text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">x{item.qty}</span>}
                    <span className="ml-auto text-xs font-bold text-salon-600 dark:text-salon-100">₹{item.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {STAFF.map((staff) => {
                      const selected = item.staffIds.includes(staff.id)

                      return (
                        <button
                          key={staff.id}
                          onClick={() => toggleStaff(item.serviceId, staff.id, staff.name)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                            selected
                              ? 'border-2 border-salon-600 bg-salon-100/10'
                              : 'border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${staff.color}`}>
                            {staff.name.charAt(0)}
                          </div>
                          <div className="text-center">
                            <div className={`text-xs font-semibold ${selected ? 'text-salon-600 dark:text-salon-100' : 'text-gray-900 dark:text-white'}`}>
                              {staff.name.split(' ')[0]}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">{staff.role}</div>
                          </div>
                          {selected && <CheckCircle2 size={12} className="text-salon-600 dark:text-salon-100" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-salon-600 dark:text-salon-100" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Pick Date & Time</h2>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold text-gray-500 dark:text-gray-400">Available Slots</label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {SLOTS.map((slot) => {
                    const selected = selectedSlot === slot

                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl py-2 text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-salon-600 text-white ring-4 ring-salon-100/40 dark:ring-salon-900/50'
                            : 'border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && selectedSlot && (
                <div className="flex items-center gap-2 rounded-xl border border-salon-100 bg-salon-100/10 px-4 py-3">
                  <CalendarDays size={14} className="shrink-0 text-salon-600" />
                  <span className="text-sm font-semibold text-salon-600 dark:text-salon-100">{selectedDate} at {selectedSlot}</span>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-salon-600 dark:text-salon-100" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Client Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="Client name"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Phone</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(event) => setClientPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2.5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Date & Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedDate} · {selectedSlot}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700" />
                {cart.map((item) => (
                  <div key={item.serviceId} className="flex justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {item.name}
                      {item.qty > 1 ? ` x${item.qty}` : ''}
                      {item.staffNames.length > 0 ? ` - ${item.staffNames.join(', ')}` : ''}
                    </span>
                    <span className="shrink-0 font-semibold text-gray-900 dark:text-white">₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-salon-600 dark:text-salon-100">₹{total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((current) => current - 1)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((current) => current + 1)}
                disabled={cart.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-salon-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-salon-100 transition hover:bg-salon-900 disabled:opacity-40 dark:shadow-none"
              >
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => setConfirmed(true)}
                disabled={!clientName || !clientPhone}
                className="flex-1 rounded-xl bg-salon-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-salon-100 transition hover:bg-salon-900 disabled:opacity-40 dark:shadow-none"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-4">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart size={15} className="text-salon-600 dark:text-salon-100" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Cart</h3>
            {cart.length > 0 && (
              <span className="ml-auto rounded-full bg-salon-100/25 px-1.5 py-0.5 text-[10px] font-bold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">
                {cart.length} item{cart.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <ShoppingCart size={28} className="text-gray-300 dark:text-gray-700" />
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">No services added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.serviceId} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2.5 dark:bg-gray-800">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-gray-900 dark:text-white">{item.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => updateQty(item.serviceId, -1)} className="flex h-4 w-4 items-center justify-center rounded bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">-</button>
                        <span className="px-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400">{item.qty}</span>
                        <button onClick={() => updateQty(item.serviceId, 1)} className="flex h-4 w-4 items-center justify-center rounded bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">+</button>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">₹{item.price}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-salon-600 dark:text-salon-100">₹{item.price * item.qty}</span>
                  <button onClick={() => removeItem(item.serviceId)} className="shrink-0 text-red-400 transition hover:text-red-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <div className="space-y-1.5 border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 text-sm font-bold dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-salon-600 dark:text-salon-100">₹{total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
