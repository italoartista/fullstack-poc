import { LoginForm } from "@/components/login-form"
import { AuthProvider } from "@/context/auth-context"

export default function Page() {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full items-center justify-center px-4">
        <LoginForm />
      </div>
    </AuthProvider>
  )
}