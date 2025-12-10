"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff, Users, ChevronDown } from "lucide-react"
import { GiHospitalCross } from "react-icons/gi"

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError("")

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // check if email already exists
      const exists = users.some((u: any) => u.email === data.email)
      if (exists) {
        setError("An account with this email already exists. Please login instead.")
        setIsLoading(false)
        return
      }

      // add new user
      const newUser = { ...data }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      await new Promise(resolve => setTimeout(resolve, 500))

      router.push("/login")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GiHospitalCross className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">MedApp</h1>
          </div>
          <p className="text-muted-foreground">Join our healthcare platform</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Registration Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.name
                      ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                      : 'border-input bg-background hover:border-input/80'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.name.message as string}</p>
              )}
            </div>

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
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.password
                      ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                      : 'border-input bg-background hover:border-input/80'
                  }`}
                  placeholder="Create a password"
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

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Account Type</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("userType", { required: "Please select an account type" })}
                  type="hidden"
                  value={selectedRole}
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 text-left ${
                    errors.userType
                      ? 'border-red-300 bg-red-50 dark:bg-red-500/10'
                      : 'border-input bg-background hover:border-input/80'
                  }`}
                >
                  <span className={selectedRole ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedRole === 'patient' ? '👤 Patient' :
                     selectedRole === 'doctor' ? '👨‍⚕️ Doctor' :
                     'Select account type'}
                  </span>
                </button>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('patient')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg"
                    >
                      👤 Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('doctor')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors last:rounded-b-lg"
                    >
                      👨‍⚕️ Doctor
                    </button>
                  </div>
                )}
              </div>
              {errors.userType && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{errors.userType.message as string}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          <p className="text-center text-sm mb-6">
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign in instead
            </Link>
          </p>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Demo Registration:</p>
            <p>👤 Patient: patient@demo.com / password</p>
            <p>👨‍⚕️ Doctor: doctor@demo.com / password</p>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </main>
  )
}
