'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Scissors,
  Package,
  Receipt,
  TrendingUp,
  CreditCard,
  Gift,
  Tag,
  Bell,
  Settings,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import Image from 'next/image'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/booking', icon: Calendar },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Services', href: '/services', icon: Scissors },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Membership', href: '/membership', icon: CreditCard },
  { name: 'Loyalty', href: '/loyalty', icon: Gift },
  { name: 'Discounts', href: '/discounts', icon: Tag },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <Scissors className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">SalonPro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">CRM System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all',
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 text-white">
          <h3 className="font-semibold mb-1">Need Help?</h3>
          <p className="text-xs opacity-90 mb-3">Contact support team</p>
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 text-sm font-medium transition-colors">
            Get Support
          </button>
        </div>
      </div>
    </aside>
  )
}
