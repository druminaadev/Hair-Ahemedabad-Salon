'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  ShoppingBag,
  CalendarDays,
  ChevronDown,
  Users,
  UserPlus,
  UserCog,
  Scissors,
  Package,
  Receipt,
  TrendingUp,
  BarChart2,
  CreditCard,
  Tag,
  Bell,
  Settings,
  List,
  LayoutGrid,
  FileText,
  UserCircle,
  Gift,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/utils/helpers'

type SubItem = { name: string; href: string; icon: LucideIcon }
type NavItem = { name: string; icon: LucideIcon; prefix: string; items: SubItem[] }

const navItems: NavItem[] = [
  {
    name: 'Bookings', icon: Calendar, prefix: '/booking',
    items: [
      { name: 'Schedule Booking', href: '/booking/new',      icon: CalendarCheck },
      { name: 'Walk-in / POS',    href: '/booking/pos',      icon: ShoppingBag   },
      { name: 'Calendar View',    href: '/booking/calendar', icon: CalendarDays  },
    ],
  },
  {
    name: 'Invoice', icon: Receipt, prefix: '/invoices',
    items: [
      { name: 'All Invoices', href: '/invoices',        icon: FileText },
    ],
  },
  {
    name: 'Service', icon: Scissors, prefix: '/services',
    items: [
      { name: 'All Services', href: '/services',            icon: List       },
      { name: 'Categories',   href: '/services/categories', icon: LayoutGrid },
    ],
  },
  {
    name: 'Staff', icon: UserCog, prefix: '/staff',
    items: [
      { name: 'Staff List', href: '/staff',     icon: UserCog    },
      { name: 'Add Staff',  href: '/staff/add', icon: UserCircle },
    ],
  },
  {
    name: 'Client', icon: Users, prefix: '/customers',
    items: [
      { name: 'Client List', href: '/customers',     icon: Users    },
      { name: 'Add Client',  href: '/customers/add', icon: UserPlus },
    ],
  },
  {
    name: 'Membership', icon: CreditCard, prefix: '/membership',
    items: [
      { name: 'Plans',    href: '/membership/plans',    icon: CreditCard },
      { name: 'Packages', href: '/membership/packages', icon: Gift       },
      { name: 'Loyalty',  href: '/membership/loyalty',  icon: Star       },
    ],
  },
  {
    name: 'Discount', icon: Tag, prefix: '/discounts',
    items: [
      { name: 'All Discounts', href: '/discounts', icon: Tag },
    ],
  },
  {
    name: 'Inventory', icon: Package, prefix: '/inventory',
    items: [
      { name: 'Stock',   href: '/inventory',        icon: Package  },
      { name: 'Reorder', href: '/inventory/reorder', icon: List    },
    ],
  },
  {
    name: 'Report', icon: TrendingUp, prefix: '/reports',
    items: [
      { name: 'Daily Reconciliation', href: '/reports',                    icon: TrendingUp },
      { name: 'Transactions',         href: '/reports/transactions',        icon: FileText   },
      { name: 'Business Trend',       href: '/reports/business-trend',      icon: BarChart2  },
      { name: 'Stylist Progress',     href: '/reports/stylist-progress',    icon: UserCog    },
    ],
  },
  {
    name: 'Analytics', icon: BarChart2, prefix: '/analytics',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    ],
  },
  {
    name: 'Notification', icon: Bell, prefix: '/notifications',
    items: [
      { name: 'All Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    name: 'Setting', icon: Settings, prefix: '/settings',
    items: [
      { name: 'General',       href: '/settings',               icon: Settings },
      { name: 'Notifications', href: '/settings/notifications', icon: Bell     },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navItems.map((n) => [n.name, pathname.startsWith(n.prefix)]))
  )

  const toggle = (name: string) =>
    setOpenMap((prev) => ({ ...prev, [name]: !prev[name] }))

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-salon-400 to-salon-600 flex items-center justify-center">
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

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all',
              pathname === '/dashboard'
                ? 'bg-salon-100/20 dark:bg-salon-900/20 text-salon-600 dark:text-salon-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* All dropdowns */}
          {navItems.map((nav) => {
            const isActive = pathname.startsWith(nav.prefix)
            const isOpen = openMap[nav.name]
            return (
              <div key={nav.name}>
                <button
                  type="button"
                  onClick={() => toggle(nav.name)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all',
                    isActive
                      ? 'bg-salon-100/20 dark:bg-salon-900/20 text-salon-600 dark:text-salon-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <nav.icon size={20} />
                  <span className="flex-1 text-left">{nav.name}</span>
                  <ChevronDown
                    size={16}
                    className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                </button>

                {isOpen && (
                  <div className="mt-1 ml-4 pl-3 border-l-2 border-salon-100 dark:border-salon-900/40 space-y-1">
                    {nav.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                          pathname === item.href
                            ? 'bg-salon-100/20 dark:bg-salon-900/20 text-salon-600 dark:text-salon-100'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </nav>
    </aside>
  )
}
