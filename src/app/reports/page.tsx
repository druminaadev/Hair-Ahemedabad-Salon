'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  Banknote,
  CreditCard,
  DollarSign,
  Download,
  Receipt,
  RefreshCw,
  Smartphone,
  SplitSquareHorizontal,
  TrendingUp,
} from 'lucide-react'

const summary = [
  { method: 'UPI', icon: Smartphone, amount: 42500, txns: 28, color: '#CF455C', bg: '#CF455C18' },
  { method: 'Cash', icon: Banknote, amount: 31200, txns: 22, color: '#10b981', bg: '#10b98118' },
  { method: 'Card', icon: CreditCard, amount: 18800, txns: 12, color: '#0ea5e9', bg: '#0ea5e918' },
]

const transactions = [
  { time: '09:15', client: 'Priya Sharma', service: 'Hair Cut & Color', staff: 'Neha', method: 'UPI', amount: 1888 },
  { time: '10:30', client: 'Riya Patel', service: 'Facial', staff: 'Pooja', method: 'Cash', amount: 944 },
  { time: '11:45', client: 'Anita Verma', service: 'Manicure', staff: 'Sonal', method: 'Card', amount: 472 },
  { time: '13:00', client: 'Meena Joshi', service: 'Hair Spa', staff: 'Neha', method: 'UPI', amount: 1416 },
  { time: '14:30', client: 'Sunita Rao', service: 'Waxing (Full)', staff: 'Pooja', method: 'Cash', amount: 1180 },
  { time: '15:45', client: 'Kavita Singh', service: 'Pedicure', staff: 'Sonal', method: 'UPI', amount: 590 },
]

const splitPayments = [
  { booking: 'BK-0123', client: 'Anjali Sharma', total: 1200, parts: [{ m: 'UPI', a: 500 }, { m: 'Cash', a: 700 }] },
  { booking: 'BK-0145', client: 'Priya Gupta', total: 2400, parts: [{ m: 'Card', a: 1500 }, { m: 'UPI', a: 900 }] },
]

const methodStyle: Record<string, { bg: string; text: string }> = {
  UPI: { bg: '#CF455C18', text: '#CF455C' },
  Cash: { bg: '#10b98118', text: '#10b981' },
  Card: { bg: '#0ea5e918', text: '#0ea5e9' },
}

function useMount() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timeout)
  }, [])

  return mounted
}

function AnimatedNumber({ target }: { target: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / 40
    const interval = setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        clearInterval(interval)
      } else {
        setValue(Math.floor(start))
      }
    }, 20)

    return () => clearInterval(interval)
  }, [target])

  return <>{value.toLocaleString()}</>
}

export default function DailyReconciliationPage() {
  const mounted = useMount()
  const [date, setDate] = useState('2024-01-15')
  const [refreshing, setRefreshing] = useState(false)
  const total = summary.reduce((sum, method) => sum + method.amount, 0)
  const totalTxns = summary.reduce((sum, method) => sum + method.txns, 0)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(10px)',
          transition: 'all .4s ease',
        }}
      >
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: '#CF455C18' }}>
              <DollarSign size={16} style={{ color: '#CF455C' }} />
            </div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Daily Reconciliation
            </h1>
          </div>
          <p className="ml-10 text-xs" style={{ color: 'var(--text-secondary)' }}>
            End-of-day payment breakdown & audit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-transparent text-sm focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            aria-label="Refresh reconciliation"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            style={{ background: '#CF455C', color: '#fff' }}
            onMouseEnter={(event) => { event.currentTarget.style.background = '#971549' }}
            onMouseLeave={(event) => { event.currentTarget.style.background = '#CF455C' }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div
        className="flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center"
        style={{
          background: 'linear-gradient(135deg,#CF455C 0%,#971549 100%)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .45s ease .05s',
        }}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Activity size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="mb-1 text-sm font-semibold text-white/70">Total Collections - {date}</div>
          <div className="text-4xl font-bold text-white">
            Rs <AnimatedNumber target={total} />
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <div className="text-sm text-white/70">{totalTxns} transactions</div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
            <TrendingUp size={13} /> +8.4% vs yesterday
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .45s ease .1s',
        }}
      >
        {[
          { label: 'Subtotal', value: 78136, prefix: 'Rs ', color: '#CF455C', icon: Receipt },
          { label: 'GST Collected', value: 14064, prefix: 'Rs ', color: '#0ea5e9', icon: Receipt },
          { label: 'Discounts', value: 0, prefix: 'Rs ', color: '#f59e0b', icon: Receipt },
          { label: 'Split Payments', value: splitPayments.length, prefix: '', color: '#ec4899', icon: SplitSquareHorizontal },
        ].map(({ label, value, prefix, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {label}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>
              {prefix}
              <AnimatedNumber target={value} />
            </div>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .45s ease .15s',
        }}
      >
        {summary.map(({ method, icon: Icon, amount, txns, color, bg }) => {
          const pct = Math.round((amount / total) * 100)
          return (
            <div key={method} className="group rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {method}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {txns} transactions
                  </div>
                </div>
                <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: bg, color }}>
                  {pct}%
                </span>
              </div>
              <div className="mb-3 text-2xl font-bold" style={{ color }}>
                Rs {amount.toLocaleString()}
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--hover)' }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: mounted ? `${pct}%` : '0%',
                    background: color,
                    transition: 'width 1s ease .3s',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .45s ease .2s',
        }}
      >
        <div className="mb-4 flex items-center gap-2">
          <SplitSquareHorizontal size={15} style={{ color: '#ec4899' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Split Payments
          </h2>
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: '#ec489918', color: '#ec4899' }}>
            {splitPayments.length} entries
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {splitPayments.map((payment) => (
            <div key={payment.booking} className="rounded-xl p-4" style={{ background: 'var(--hover)' }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {payment.client}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {payment.booking}
                  </div>
                </div>
                <div className="text-sm font-bold" style={{ color: '#CF455C' }}>
                  Rs {payment.total.toLocaleString()}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {payment.parts.map((part, index) => (
                  <span
                    key={index}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ background: methodStyle[part.m]?.bg, color: methodStyle[part.m]?.text }}
                  >
                    {part.m}: Rs {part.a.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .45s ease .25s',
        }}
      >
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Activity size={15} style={{ color: '#CF455C' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Today's Transactions
          </h2>
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: '#CF455C18', color: '#CF455C' }}>
            {transactions.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                {['Time', 'Client', 'Service', 'Staff', 'Method', 'Amount'].map((heading) => (
                  <th key={heading} className="px-5 py-3.5 text-left font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => {
                const methodColors = methodStyle[transaction.method]
                return (
                  <tr
                    key={`${transaction.time}-${transaction.client}`}
                    className="transition-colors"
                    style={{
                      borderTop: '1px solid var(--border)',
                      opacity: mounted ? 1 : 0,
                      transition: `opacity .3s ease ${0.3 + index * 0.05}s`,
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = 'var(--hover)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                        {transaction.time}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {transaction.client}
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {transaction.service}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#CF455C' }}>
                          {transaction.staff[0]}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.staff}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: methodColors.bg, color: methodColors.text }}>
                        {transaction.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold" style={{ color: '#CF455C' }}>
                      Rs {transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
