const stats = [
  { label: "Today's Bookings", value: '24', color: 'bg-purple-100 text-purple-700' },
  { label: 'Total Customers', value: '1,284', color: 'bg-blue-100 text-blue-700' },
  { label: "Today's Revenue", value: '₹18,500', color: 'bg-green-100 text-green-700' },
  { label: 'Pending Payments', value: '₹3,200', color: 'bg-red-100 text-red-700' },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
            <p className="text-sm font-medium opacity-75">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-lg mb-4">Recent Bookings</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b dark:border-gray-700">
              <th className="pb-2">Customer</th>
              <th className="pb-2">Service</th>
              <th className="pb-2">Time</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { name: 'Priya Shah', service: 'Haircut', time: '10:00 AM', status: 'Confirmed' },
              { name: 'Riya Patel', service: 'Facial', time: '11:30 AM', status: 'Pending' },
              { name: 'Meera Joshi', service: 'Manicure', time: '1:00 PM', status: 'Completed' },
            ].map((b) => (
              <tr key={b.name} className="py-2">
                <td className="py-2">{b.name}</td>
                <td>{b.service}</td>
                <td>{b.time}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    b.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                    b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
