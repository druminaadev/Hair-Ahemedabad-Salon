'use client'

import { FileText, CheckCircle2, Clock } from 'lucide-react'

const transactions = [
  { id: 'TXN-001', client: 'Priya Sharma',  date: '2025-06-02', method: 'UPI',  amount: 1800, status: 'Paid'    },
  { id: 'TXN-002', client: 'Riya Patel',    date: '2025-06-02', method: 'Cash', amount: 800,  status: 'Paid'    },
  { id: 'TXN-003', client: 'Anita Verma',   date: '2025-06-01', method: 'Card', amount: 400,  status: 'Pending' },
  { id: 'TXN-004', client: 'Meena Joshi',   date: '2025-05-31', method: 'UPI',  amount: 1200, status: 'Paid'    },
  { id: 'TXN-005', client: 'Sunita Rao',    date: '2025-05-30', method: 'Cash', amount: 1000, status: 'Paid'    },
  { id: 'TXN-006', client: 'Kavita Singh',  date: '2025-05-29', method: 'Card', amount: 5000, status: 'Pending' },
]

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-salon-600 dark:text-salon-100" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-xs font-semibold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">{transactions.length}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {['Txn ID', 'Client', 'Date', 'Method', 'Amount', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-5 py-3.5 font-bold text-salon-600 dark:text-salon-100">{t.id}</td>
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{t.client}</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{t.date}</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{t.method}</td>
                <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">₹{t.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {t.status === 'Paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}{t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
