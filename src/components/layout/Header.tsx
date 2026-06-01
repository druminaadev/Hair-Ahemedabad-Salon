'use client'

import { Bell, Search, Moon, Sun, User, LogOut } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers, bookings..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun size={20} className="text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <button
          className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-salon-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || 'Administrator'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    window.location.href = '/profile'
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/auth/login'
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-red-600 dark:text-red-400"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
