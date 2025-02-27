import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDd2EpfMu4yBarZZ6QKzPtosvM6csaId9I",
  authDomain: "sahiurl.firebaseapp.com",
  projectId: "sahiurl",
  storageBucket: "sahiurl.firebasestorage.app",
  messagingSenderId: "128835735961",
  appId: "1:128835735961:web:a315482dcea037a279c308",
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Initialize Analytics and export it if supported
let analytics = null
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)))
}

// Export Firebase URLs
export const FIREBASE_URLS = {
  BASE_URL: "https://sahiurl.web.app",
  API_URL: "https://sahiurl.web.app/api",
  STORAGE_URL: "https://sahiurl.firebasestorage.app",
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://sahiurl.in"

export { auth, db }

