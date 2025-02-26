"use client"

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as FirebaseUser } from "firebase/auth" // Import Firebase User type
import { User } from "@/types/database"
import { auth } from '@/lib/firebase/config'
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// Extend your User type with Firebase auth methods
export interface AuthUser extends User {
  getIdToken: () => Promise<string>;
  // Add other Firebase methods you might need
}

// Define the AuthContext type
interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export the hook to use auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true)
        if (firebaseUser) {
          // Fetch user data or use Firebase user
          const token = await firebaseUser.getIdToken()
          const response = await fetch(`/api/user/${firebaseUser.uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => null) // Handle fetch errors gracefully

          let userData: User;
          
          if (response && response.ok) {
            userData = await response.json()
          } else {
            // Fallback: Use basic user data from Firebase if API fails
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL,
              role: 'user',
              createdAt: new Date(),
              lastLoginAt: new Date(),
            }
          }
          
          // Merge Firebase user methods with our custom user data
          const authUser = {
            ...userData,
            getIdToken: () => firebaseUser.getIdToken(),
            // Add other methods as needed
          }
          
          setUser(authUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(userCredential.user, { displayName: name })
      
      // Create user document in Firestore
      const userData: Omit<User, 'uid'> = {
        email: userCredential.user.email || '',
        name: name,
        photoURL: userCredential.user.photoURL,
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      
      return
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      if (!userDoc.exists()) {
        // Create new user document for Google sign-ins
        const userData: Omit<User, 'uid'> = {
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL,
          role: 'user',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      } else {
        // Update last login time
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: new Date()
        }, { merge: true })
      }
      
      return
    } catch (error: any) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      router.push('/login')
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

