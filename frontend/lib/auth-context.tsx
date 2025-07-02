"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi } from "./api"

interface User {
  id: string
  email: string
  full_name: string
  avatar?: string
  is_active: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (token) {
          const userData = await authApi.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        await logout() // fallback logout if token is bad
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")

      const response = await authApi.login(email, password)
      localStorage.setItem("access_token", response.access_token)
      if (response.refresh_token) {
        localStorage.setItem("refresh_token", response.refresh_token)
      }
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      throw error // important so LoginPage.tsx can show toast
    }
  }

  const register = async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
  }) => {
    try {
      await authApi.register(userData)
      await login(userData.email, userData.password)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }
    try {
      const response = await authApi.refreshToken(refreshToken)
      localStorage.setItem("access_token", response.access_token)
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setUser(null)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}