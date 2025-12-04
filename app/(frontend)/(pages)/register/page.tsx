"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { register, handleSubmit, reset } = useForm()
  const router = useRouter()

  const onSubmit = (data: any) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // check if email already exists
    const exists = users.some((u: any) => u.email === data.email)
    if (exists) {
      alert("User already exists. Please login.")
      return
    }

    // add new user
    const newUser = { ...data }
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    alert("Registration successful!")
    reset()
    router.push("/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your name"
            />
          </div>

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

          <div>
            <label className="block mb-1 text-sm">Role</label>
            <select
              {...register("userType", { required: true })}
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="patient" className="text-black">Patient</option>
              <option value="doctor" className="text-black">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-3 p-2 rounded-md font-semibold bg-purple-500 hover:bg-purple-600 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-300 underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </main>
  )
}
