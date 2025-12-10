// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GiHospitalCross } from 'react-icons/gi'
import { Button } from "@/components/ui/button"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

// import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className='bg-transparent h-8 border '>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


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
    <nav className=" shadow-xl shadow-white/10 sticky top-0 z-40 backdrop-blur-md bg-zinc-600/30 rounded-3xl max-w-4xl mx-auto px-4">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center" >
        <Link href="/" className="font-bold text-xl flex gap-2 items-center">
        <GiHospitalCross />
        MedApp</Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
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
         <ModeToggle/> 
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
        <div className="md:hidden shadow-sm sticky top-0 z-40 ">
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
            <div className='flex'>
              <ModeToggle/>
            </div>
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
                  className="border border-white/30 px-3 rounded-md hover:bg-white/10 transition block py-2"
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
