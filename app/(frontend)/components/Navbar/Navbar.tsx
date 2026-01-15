// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { GiHospitalCross } from 'react-icons/gi'
import { Button } from "@/components/ui/button"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSidebar } from "@/components/ui/sidebar"

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
  const pathname = usePathname()
  const { open, openMobile } = useSidebar()

  // Don't render navbar when sidebar is open (except on home page)
  const isHomePage = pathname === "/" || pathname === ""
  const shouldHideNavbar = !isHomePage && (open || openMobile)

  if (shouldHideNavbar) {
    return null
  }

  useEffect(() => {
  const updateUser = () => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser || storedUser === "undefined") {
      setUser(null)
      console.log("there is no user in storage ")
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch {
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  updateUser()
  window.addEventListener("user-updated", updateUser)
  window.addEventListener("storage", updateUser)

  return () => {
    window.removeEventListener("user-updated", updateUser)
    window.removeEventListener("storage", updateUser)
  }
}, [])


  // useEffect(() => {
  //   const updateUser = () => {
  //     const storedUser = localStorage.getItem("user")
  //     let parsedUser = null
  //     try {
  //       parsedUser = storedUser ? JSON.parse(storedUser) : null
  //       console.log("parsduser",parsedUser)
  //     } catch (err) {
  //       console.error("Failed to parse stored user:", err)
  //       localStorage.removeItem("user") // clean invalid data
  //     }
  //   }

  //   updateUser()
  //   window.addEventListener("storage", updateUser)
  //   window.addEventListener("user-updated", updateUser)

  //   return () => {
  //     window.removeEventListener("storage", updateUser)
  //     window.removeEventListener("user-updated", updateUser)
  //   }
  // }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
  localStorage.removeItem("token")
  setUser(null)
  window.dispatchEvent(new Event("user-updated"))
  router.push("/login")
  }

  const isDoctor = user?.role === "doctor"
  const dashboardLink = isDoctor ? "/doctor-dashboard" : "/patient-dashboard"

  return (
    <nav className="sticky top-0 z-40 border-b border-primary/20 bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex gap-2 items-center hover:opacity-80 transition">
          <GiHospitalCross className="text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">MedApp</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-1 items-center">
          {!isDoctor && user && (
            <Link href="/doctor" className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition">
              Doctors
            </Link>
          )}

          {user && isDoctor && (
            <Link href="/doctor-schedule" className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition">
              Schedule
            </Link>
          )}

          {user && (
            <Link href={dashboardLink} className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition">
              {isDoctor ? "Manage" : "Dashboard"}
            </Link>
          )}

          {user && (
            <Link href={isDoctor ? "/profile/doctor" : "/profile/patient"} className="px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition">
              Profile
            </Link>
          )}

          {user ? (
            <>
              <span className="text-sm text-muted-foreground px-3">Hi, {user.name.split(" ")[0]} {isDoctor && "🩺"}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-foreground border border-primary/30 rounded-lg hover:bg-primary/10 hover:border-primary/60 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-2 text-foreground border border-primary/30 rounded-lg hover:bg-primary/10 hover:border-primary/60 transition"
            >
              Login
            </Link>
          )}
          <div className="pl-2 border-l border-primary/20">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-foreground transition-all"></div>
          <div className="w-6 h-0.5 bg-foreground transition-all"></div>
          <div className="w-6 h-0.5 bg-foreground transition-all"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary/20 bg-gradient-to-b from-background to-primary/5">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            {!isDoctor && user && (
              <Link href="/doctor" className="text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition block py-2 px-3">
                Doctors
              </Link>
            )}
            {user && isDoctor && (
              <Link href="/doctor-schedule" className="text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition block py-2 px-3">
                Schedule
              </Link>
            )}
            {user && (
              <Link href={dashboardLink} className="text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition block py-2 px-3">
                {isDoctor ? "Manage" : "Dashboard"}
              </Link>
            )}
            {user && (
              <Link href={isDoctor ? "/profile/doctor" : "/profile/patient"} className="text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition block py-2 px-3">
                Profile
              </Link>
            )}
            {user ? (
              <>
                <span className="text-sm text-muted-foreground block py-2 px-3">Hi, {user.name.split(" ")[0]}</span>
                <div className='flex px-3 py-2'>
                  <ModeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-foreground border border-primary/30 px-3 py-2 rounded-lg hover:bg-primary/10 hover:border-primary/60 transition w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-foreground border border-primary/30 px-3 py-2 rounded-lg hover:bg-primary/10 hover:border-primary/60 transition block"
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
