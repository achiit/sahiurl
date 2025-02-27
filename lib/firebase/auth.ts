import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
  AuthErrorCodes,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "./config"
import type { User } from "@/types/database"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Helper function to format Firebase auth errors
function formatAuthError(error: any): Error {
  console.error("Firebase Auth Error:", error)

  if (error.code) {
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
        return new Error("No account found with this email address")
      case AuthErrorCodes.INVALID_PASSWORD:
        return new Error("Incorrect password")
      case AuthErrorCodes.EMAIL_EXISTS:
        return new Error("Email already in use")
      case AuthErrorCodes.WEAK_PASSWORD:
        return new Error("Password is too weak")
      case AuthErrorCodes.INVALID_EMAIL:
        return new Error("Invalid email address")
      default:
        return new Error(`Authentication error: ${error.message || error.code}`)
    }
  }

  return new Error(error.message || "An unknown error occurred")
}

// Helper function to create initial user data
async function createInitialUserData(firebaseUser: FirebaseUser, name?: string): Promise<User> {
  const isAdmin = firebaseUser.email === "admin@sahiurl.in"
  const isSuperAdmin = firebaseUser.email === "superadmin@sahiurl.in"

  const userData: Omit<User, "uid"> = {
    email: firebaseUser.email || "",
    name: name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    photoURL: firebaseUser.photoURL,
    role: isSuperAdmin ? "superadmin" : isAdmin ? "admin" : "user",
    createdAt: new Date(),
    lastLoginAt: new Date(),
    status: 'active',
    metadata: {
      authCreatedAt: new Date().toISOString(),
      authLastLoginAt: new Date().toISOString()
    },
    settings: {
      emailNotifications: true,
      paymentThreshold: 1000,
      defaultRedirectDelay: 10,
      defaultAdSettings: {
        enabled: false,
        preferredAdTypes: [],
        blogTemplateId: ""
      },
      twoFactorEnabled: false,
      ipWhitelisting: false
    },
    stats: {
      totalLinks: 0,
      totalClicks: 0,
      totalEarnings: 0,
      balance: 0
    },
  }

  // Create user document in Firestore
  await setDoc(doc(db, "users", firebaseUser.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    uid: firebaseUser.uid,
    ...userData,
  }
}

export async function signUp(email: string, password: string, name: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user document in Firestore
    const userData: Omit<User, "uid"> = {
      email: user.email || "",
      name,
      photoURL: user.photoURL || null,
      role: "user", // Default role
      createdAt: new Date(),
      lastLoginAt: new Date(),
      status: 'active',
      metadata: {
        authCreatedAt: new Date().toISOString(),
        authLastLoginAt: new Date().toISOString()
      },
      settings: {
        emailNotifications: true,
        paymentThreshold: 1000,
        defaultRedirectDelay: 10,
        defaultAdSettings: {
          enabled: false,
          preferredAdTypes: [],
          blogTemplateId: ""
        },
        twoFactorEnabled: false,
        ipWhitelisting: false
      },
      stats: {
        totalLinks: 0,
        totalClicks: 0,
        totalEarnings: 0,
        balance: 0
      },
    }

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      uid: user.uid,
      ...userData,
    }
  } catch (error: any) {
    throw formatAuthError(error)
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Try to get existing user data
    let userData = await getUserData(user)

    // If user document doesn't exist in Firestore, create it
    if (!userData) {
      console.log("Creating new user document for:", email)
      userData = await createInitialUserData(user)
    }

    return userData
  } catch (error: any) {
    console.error("Sign in error:", error)
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      throw new Error("Invalid email or password")
    }
    throw new Error(error.message || "An error occurred during sign in")
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user exists
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      // Create new user document
      const userData: Omit<User, "uid"> = {
        email: user.email || "",
        name: user.displayName || "User",
        photoURL: user.photoURL || null,
        role: "user",
        createdAt: new Date(),
        lastLoginAt: new Date(),
        status: 'active',
        metadata: {
          authCreatedAt: new Date().toISOString(),
          authLastLoginAt: new Date().toISOString()
        },
        settings: {
          emailNotifications: true,
          paymentThreshold: 1000,
          defaultRedirectDelay: 10,
          defaultAdSettings: {
            enabled: false,
            preferredAdTypes: [],
            blogTemplateId: ""
          },
          twoFactorEnabled: false,
          ipWhitelisting: false
        },
        stats: {
          totalLinks: 0,
          totalClicks: 0,
          totalEarnings: 0,
          balance: 0
        },
      }

      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return {
        uid: user.uid,
        ...userData,
      }
    }

    const userData = await getUserData(user)
    if (!userData) throw new Error("User data not found")
    return userData
  } catch (error: any) {
    console.error("Google sign in error:", error)
    // Improve error message handling
    if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized for sign-in. Please contact support.")
    }
    throw new Error(error.message || "Failed to sign in with Google")
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw formatAuthError(error)
  }
}

export async function getUserData(user: FirebaseUser): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      console.log("User document not found for:", user.email)
      return null
    }

    const data = userDoc.data()

    // Handle date conversion safely
    const createdAt = data.createdAt
      ? typeof data.createdAt.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt)
      : new Date()

    const updatedAt = data.updatedAt
      ? typeof data.updatedAt.toDate === "function"
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt)
      : new Date()

    return {
      uid: user.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt,
      lastLoginAt: new Date(),
      status: data.status || 'active',
      settings: data.settings,
      stats: {
        totalLinks: data.stats?.totalLinks || 0,
        totalClicks: data.stats?.totalClicks || 0,
        totalEarnings: data.stats?.totalEarnings || 0,
        balance: data.stats?.balance || 0
      },
      metadata: {
        authCreatedAt: data.metadata?.authCreatedAt || new Date().toISOString(),
        authLastLoginAt: data.metadata?.authLastLoginAt || new Date().toISOString()
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw formatAuthError(error)
  }
}

// Auth hook to get the current user
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userData = await getUserData(firebaseUser)
          setUser(userData)
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
  }, [auth])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await getUserData(userCredential.user)
      return userData
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
        email: userCredential.user.email || "",
        name: name,
        photoURL: userCredential.user.photoURL || null,
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        status: 'active',
        metadata: {
          authCreatedAt: new Date().toISOString(),
          authLastLoginAt: new Date().toISOString()
        },
        settings: {
          emailNotifications: true,
          paymentThreshold: 1000,
          defaultRedirectDelay: 10,
          defaultAdSettings: {
            enabled: false,
            preferredAdTypes: [],
            blogTemplateId: ""
          },
          twoFactorEnabled: false,
          ipWhitelisting: false
        },
        stats: {
          totalLinks: 0,
          totalClicks: 0,
          totalEarnings: 0,
          balance: 0
        }
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      
      return {
        uid: userCredential.user.uid,
        ...userData,
      }
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
          email: userCredential.user.email || "",
          name: userCredential.user.displayName || "User",
          photoURL: userCredential.user.photoURL || null,
          role: 'user',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          status: 'active',
          metadata: {
            authCreatedAt: new Date().toISOString(),
            authLastLoginAt: new Date().toISOString()
          },
          settings: {
            emailNotifications: true,
            paymentThreshold: 1000,
            defaultRedirectDelay: 10,
            defaultAdSettings: {
              enabled: false,
              preferredAdTypes: [],
              blogTemplateId: ""
            },
            twoFactorEnabled: false,
            ipWhitelisting: false
          },
          stats: {
            totalLinks: 0,
            totalClicks: 0,
            totalEarnings: 0,
            balance: 0
          }
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userData)
      } else {
        // Update last login time
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: new Date()
        }, { merge: true })
      }
      
      const userData = await getUserData(userCredential.user)
      return userData
    } catch (error: any) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  }
}

