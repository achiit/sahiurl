"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useUser, User } from './firebase/auth'
import { useRouter } from 'next/navigation'

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string, name: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null)

// Export the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useUser()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Export a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

