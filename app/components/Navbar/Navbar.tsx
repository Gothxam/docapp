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

  const isDoctor = user?.userType === "doctor"
  const dashboardLink = isDoctor ? "/doctor-dashboard" : "/patient-dashboard"

  return (
    <nav className=" shadow-sm sticky top-0 z-40 backdrop-blur-md bg-zinc-600/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">MedApp</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {/* Only show Doctors link to patients */}
          {!isDoctor && user && (
            <Link href="/doctor" className="text-white hover:text-purple-300 transition">Doctors</Link>
          )}
          
          {/* Show Dashboard link to all logged-in users */}
          {user && (
            <Link href={dashboardLink} className="text-white hover:text-purple-300 transition">
              {isDoctor ? "My Appointments" : "Dashboard"}
            </Link>
          )}
          
          {/* Show Profile link to all logged-in users */}
          {user && (
            <Link href={isDoctor ? "/profile/doctor" : "/profile/patient"} className="text-white hover:text-purple-300 transition">Profile</Link>
          )}
          {user ? (
            <>
              <span className="text-sm opacity-80 text-white">Hi, {user.name.split(" ")[0]} {isDoctor && "🩺"}</span>
              <button
                onClick={handleLogout}
                className="border border-white/30 px-3 py-1 rounded-md text-white hover:bg-white/10 transition"
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
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden shadow-sm sticky top-0 z-40 backdrop-blur-md bg-zinc-950/30">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            {!isDoctor && user && (
              <Link href="/doctor" className="text-white hover:text-purple-300 transition block py-2">Doctors</Link>
            )}
            {user && (
              <Link href={dashboardLink} className="text-white hover:text-purple-300 transition block py-2">
                {isDoctor ? "My Appointments" : "Dashboard"}
              </Link>
            )}
            {user && (
              <Link href={isDoctor ? "/profile/doctor" : "/profile/patient"} className="text-white hover:text-purple-300 transition block py-2">Profile</Link>
            )}
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
