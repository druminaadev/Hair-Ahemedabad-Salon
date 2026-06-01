'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Calendar, Users, Download } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/helpers'
import api from '@/lib/api'
import type { DailyReport, StylistReport } from '@/types'

type Tab = 'daily' | 'transactions' | 'trends' | 'stylist'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('daily')
  const [loading, setLoading] = useState(true)
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null)
  const [stylistReports, setStylistReports] = useState<StylistReport[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { fetchReportData() }, [activeTab, dateFrom, dateTo])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const params = `?dateFrom=${dateFrom}&dateTo=${dateTo}`
      if (activeTab === 'daily') {
        const res = await api.get(`/reports/daily-reconciliation${params}`)
        setDailyReport(res.data)
      } else if (activeTab === 'transactions') {
        const res = await api.get(`/reports/transactions${params}`)
        setTransactions(res.data.data || res.data || [])
      } else if (activeTab === 'stylist') {
        const res = await api.get(`/reports/stylist-progress${params}`)
        setStylistReports(res.data.data || res.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch report:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'daily', label: 'Daily Reconciliation' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'trends', label: 'Business Trends' },
    { id: 'stylist', label: 'Stylist Progress' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Business insights and performance metrics</p>
        </div>
        <Button variant="secondary">
          <Download size={20} className="mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            <span className="text-gray-500">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>
      ) : (
        <>
          {activeTab === 'daily' && dailyReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: formatCurrency(dailyReport.totalRevenue), color: 'text-violet-600', icon: DollarSign },
                  { label: 'Total Bookings', value: dailyReport.totalBookings, color: 'text-blue-600', icon: Calendar },
                  { label: 'Completed', value: dailyReport.completedBookings, color: 'text-emerald-600', icon: TrendingUp },
                  { label: 'Net Revenue', value: formatCurrency(dailyReport.netRevenue), color: 'text-emerald-600', icon: DollarSign },
                ].map(stat => (
                  <Card key={stat.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Cash', value: dailyReport.cashPayments },
                      { label: 'Card', value: dailyReport.cardPayments },
                      { label: 'UPI', value: dailyReport.upiPayments },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between font-bold">
                      <span className="text-gray-900 dark:text-white">Total Expenses</span>
                      <span className="text-red-600">{formatCurrency(dailyReport.expenses)}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Bookings', value: dailyReport.totalBookings, color: 'text-gray-900 dark:text-white' },
                      { label: 'Completed', value: dailyReport.completedBookings, color: 'text-emerald-600' },
                      { label: 'Cancelled', value: dailyReport.cancelledBookings, color: 'text-red-600' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className={`font-semibold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      {['Date', 'Customer', 'Services', 'Amount', 'Payment', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No transactions found</td></tr>
                    ) : transactions.map((t: any) => (
                      <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(t.date || t.createdAt)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{t.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{t.services?.map((s: any) => s.serviceName).join(', ')}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(t.totalAmount)}</td>
                        <td className="px-6 py-4"><Badge status="active">{t.paymentMethod || 'N/A'}</Badge></td>
                        <td className="px-6 py-4"><Badge status={t.paymentStatus}>{t.paymentStatus}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'trends' && (
            <Card>
              <div className="text-center py-16">
                <TrendingUp size={64} className="mx-auto text-violet-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Business Trends</h3>
                <p className="text-gray-500 dark:text-gray-400">Charts and trend analysis coming soon</p>
              </div>
            </Card>
          )}

          {activeTab === 'stylist' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      {['Stylist', 'Bookings', 'Completed', 'Revenue', 'Commission'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stylistReports.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No data available</td></tr>
                    ) : stylistReports.map(s => (
                      <tr key={s.staffId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                              <span className="text-violet-600 font-semibold">{s.staffName.charAt(0)}</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{s.staffName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{s.totalBookings}</td>
                        <td className="px-6 py-4 text-sm text-emerald-600 font-semibold">{s.completedBookings}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(s.totalRevenue)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-violet-600">{formatCurrency(s.commission)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
