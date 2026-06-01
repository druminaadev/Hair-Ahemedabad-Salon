import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import type { User, LoginCredentials, AuthResponse } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials)
          const { user, token } = response.data
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token)
          }
          
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          })
          throw error
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.put<User>('/auth/profile', data)
          set({ user: response.data, isLoading: false })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Update failed', 
            isLoading: false 
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
