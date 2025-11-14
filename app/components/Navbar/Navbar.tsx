// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {

    const [user, setUser] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

useEffect(() => {
  const updateUser = () => {
    const storedUser = localStorage.getItem("user")
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }

  // Run immediately when Navbar mounts
  updateUser()

  // Listen for storage updates (works across tabs)
  window.addEventListener("storage", updateUser)

  // Listen for custom event (triggered manually from login/logout)
  window.addEventListener("user-updated", updateUser)

  // Cleanup
  return () => {
    window.removeEventListener("storage", updateUser)
    window.removeEventListener("user-updated", updateUser)
  }
}, [])

  const handleLogout = () => {
  localStorage.removeItem("user")
  setUser(null)
  window.dispatchEvent(new Event("user-updated")) // 🔥 notify navbar instantly
  router.push("/login")
}

  return (
    <nav className=" shadow-sm sticky top-0 z-40 backdrop-blur-md bg-zinc-600/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">MedApp</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link href="/doctor" className="text-white hover:text-purple-300 transition">Doctors</Link>
          <Link href="/appointments" className="text-white hover:text-purple-300 transition">Appointments</Link>
          <Link href="/profile" className="text-white hover:text-purple-300 transition">Profile</Link>
          <Link href="/dashboard"  className="text-white hover:text-purple-300 transition">Dashboard</Link>
          {user ? (
            <>
              <span className="text-sm opacity-80">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="border border-white/30 px-3 py-1 rounded-md hover:bg-white/10 transition"
              >
                Logout
              </button>
            </>
            ) : (
            <Link
              href="/login"
              className="border border-white/30 px-3 py-1 rounded-md hover:bg-white/10 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur border-t">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            <Link href="/doctor" className="text-black hover:text-purple-300 transition block py-2">Doctors</Link>
            <Link href="/appointments" className="text-black hover:text-purple-300 transition block py-2">Appointments</Link>
            <Link href="/dashboard" className="text-black hover:text-purple-300 transition block py-2">Dashboard</Link>
            {user ? (
              <>
                <span className="text-sm opacity-80 block py-2">Hi, {user.name.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="border border-white/30 px-3 py-1 rounded-md hover:bg-white/10 transition w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-white/30 px-3 py-1 rounded-md hover:bg-white/10 transition block py-2"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
