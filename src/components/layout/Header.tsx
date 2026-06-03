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
    <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-40"
      style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)' }}>

      {/* Search */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16}
          style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search clients, bookings…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            '--tw-ring-color': '#CF455C',
          } as React.CSSProperties}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Bell */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          aria-label="Notifications">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{ background: '#CF455C', borderColor: 'var(--header-bg)' }} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors"
            style={{ background: 'var(--accent-light)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #CF455C, #971549)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'Admin'}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {user?.role || 'Administrator'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-44 rounded-2xl shadow-lg py-1.5 z-50"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <button
                  onClick={() => { setShowUserMenu(false); window.location.href = '/profile' }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <User size={14} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { logout(); window.location.href = '/auth/login' }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-colors"
                  style={{ color: '#CF455C' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <LogOut size={14} />
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
