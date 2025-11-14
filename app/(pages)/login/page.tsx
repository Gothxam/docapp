"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()

  const onSubmit = (data: any) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const foundUser = users.find(
      (u: any) => u.email === data.email && u.password === data.password
    )

    if (!foundUser) {
      alert("Invalid credentials!")
      return
    }

    localStorage.setItem("user", JSON.stringify(foundUser))
    window.dispatchEvent(new Event("user-updated")) // 🔥 instantly notify navbar
    alert(`Welcome back ${foundUser.name}!`)
    router.push("/dashboard")
  }

  useEffect(() => {
    const currentUser = localStorage.getItem("user")
    if (currentUser) router.push("/dashboard")
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center  ">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 p-2 rounded-md font-semibold bg-purple-500 hover:bg-purple-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-purple-300 underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </main>
  )
}
