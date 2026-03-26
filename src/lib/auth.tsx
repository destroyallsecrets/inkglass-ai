'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from './api'

interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  bio?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isDemoMode: boolean
  login: (token: string, user: User) => void
  loginDemo: (email: string, name?: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const savedDemoMode = localStorage.getItem('demoMode') === 'true'
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(safeJsonParse<User | null>(savedUser, null))
      setIsDemoMode(savedDemoMode)
      
      if (!savedDemoMode) {
        api.auth.getMe(savedToken).then((userData) => {
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        }).catch(() => {
          setIsDemoMode(true)
          localStorage.setItem('demoMode', 'true')
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    setIsDemoMode(false)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('demoMode', 'false')
  }

  const loginDemo = async (email: string, name?: string) => {
    // Generate a demo user
    const demoUser: User = {
      id: 'demo-' + Date.now(),
      email: email,
      name: name || email.split('@')[0] || 'Demo User',
      created_at: new Date().toISOString(),
    }
    const demoToken = 'demo-token-' + Date.now()
    
    setToken(demoToken)
    setUser(demoUser)
    setIsDemoMode(true)
    localStorage.setItem('token', demoToken)
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('demoMode', 'true')
  }

  const register = async (email: string, password: string, name?: string) => {
    const response = await api.auth.register({ email, password, name })
    setToken(response.token)
    setUser(response.user)
    setIsDemoMode(false)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    localStorage.setItem('demoMode', 'false')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsDemoMode(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('demoMode')
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) return
    const updatedUser: User = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    if (token && !isDemoMode) {
      try {
        await api.auth.updateProfile(token, data)
      } catch (error) {
        console.error('Failed to update profile on server:', error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        isDemoMode,
        login,
        loginDemo,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
