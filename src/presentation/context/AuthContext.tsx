import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User } from '@/domain/entities'
import { container } from '@/di/container'

const TOKEN_KEY = 'auth_token'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }
    container.authRepository
      .getMe()
      .then(setUser)
      .catch(clearAuth)
      .finally(() => setIsLoading(false))
  }, [clearAuth])

  useEffect(() => {
    window.addEventListener('auth:logout', clearAuth)
    return () => window.removeEventListener('auth:logout', clearAuth)
  }, [clearAuth])

  const login = async (email: string, password: string) => {
    const res = await container.loginUseCase.execute({ email, password })
    localStorage.setItem(TOKEN_KEY, res.token)
    setUser(res.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await container.registerUseCase.execute({ name, email, password })
    localStorage.setItem(TOKEN_KEY, res.token)
    setUser(res.user)
  }

  const logout = async () => {
    try {
      await container.logoutUseCase.execute()
    } finally {
      clearAuth()
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
