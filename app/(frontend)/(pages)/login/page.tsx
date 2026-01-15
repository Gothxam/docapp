"use client"
import api from "../../utils/axios"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"
import { GiHospitalCross } from "react-icons/gi"

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: any) => {
    
    setIsLoading(true)
    setError("")

    try {
      localStorage.clear()
      const response  = await api.post('/auth/login',data)
      console.log(response.data)
      const { user, token } = response.data.data

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      console.log("user",user)
      console.log("tokeeeennnn",token)

      window.dispatchEvent(new Event("user-updated"))

      console.log("LOGIN FOUND USER IN:", user.role);
      console.log("USER EMAIL:", user.email);

    if (user.role === "doctor") {
        router.push("/doctor-schedule")
      } else if (user.role === "patient") {
        router.push("/patient-dashboard")
      } else if (user.role === "admin") {
        router.push("/admin-dashboard")
      }


      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (err:any) {
      setError(err.response?.data?.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")

  if (token && user) {
    const parsedUser = JSON.parse(user)

    if (parsedUser.role === "doctor") {
      router.push("/doctor-schedule")
    } else {
      router.push("/patient-dashboard")
    }
  }
}, [router])
//   useEffect(() => {
//   const token = localStorage.getItem("token")
//   const user = localStorage.getItem("user")

//   if (!token || !user) return

//   const parsedUser = JSON.parse(user)

//   if (parsedUser.role === "doctor") {
//     router.push("/doctor-schedule")
//   }

//   if (parsedUser.role === "patient") {
//     router.push("/patient-dashboard")
//   }

//   if (parsedUser.role === "admin") {
//     router.push("/admin-dashboard")
//   }
// }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GiHospitalCross className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">MedApp</h1>
          </div>
          <p className="text-muted-foreground">Welcome back to your healthcare platform</p> 
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Login Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email"
                    }
                  })}
                  type="email"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.email
                      ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                      : 'border-input bg-background hover:border-input/80'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 1,
                      message: "Password is required"
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.password
                      ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                      : 'border-input bg-background hover:border-input/80'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.password.message as string}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-muted-foreground hover:text-foreground transition">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
            </div>
          </div>

          <p className="text-center text-sm mb-6">
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Create a new account
            </Link>
          </p>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
            <p>👤 Patient: patient@demo.com / password</p>
            <p>👨‍⚕️ Doctor: doctor@demo.com / password</p>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </main>
  )
}
