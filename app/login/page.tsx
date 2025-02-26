import { LoginForm } from "@/components/auth/login-form"
import { AuthBackground } from "@/components/auth/auth-background"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthBackground />
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

