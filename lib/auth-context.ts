import { User as FirebaseUser } from "firebase/auth"

// Update your context type
interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
} 