import { SignUpForm } from "@/components/auth/signup-form"
import { AuthBackground } from "@/components/auth/auth-background"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthBackground />
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}

