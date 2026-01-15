'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3,
  Calendar, 
  Home, 
  Settings,
  User,
  Users,
  HelpCircle,
  Stethoscope,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
}

const commonItems: MenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
]

const patientItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/patient-dashboard",
    icon: BarChart3,
  },
  {
    title: "Doctors",
    url: "/doctor",
    icon: Stethoscope,
  },
  {
    title: "My Appointments",
    url: "/my-appointments",
    icon: Calendar,
  },
  {
    title: "Book Appointment",
    url: "/book-appointment",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/profile/patient",
    icon: User,
  },
  {
    title: "Settings",
    url: "/profile/patient",
    icon: Settings,
  },
]

const doctorItems: MenuItem[] = [
  {
    title: "Schedule",
    url: "/doctor-schedule",
    icon: Calendar,
  },
  {
    title: "Manage Appointments",
    url: "/doctor-dashboard",
    icon: BarChart3,
  },
  {
    title: "Patients",
    url: "/doctor-patients",
    icon: Users,
  },
  {
    title: "Profile",
    url: "/profile/doctor",
    icon: User,
  },
  {
    title: "Settings",
    url: "/profile/doctor/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user")
      setUser(storedUser ? JSON.parse(storedUser) : null)
      setIsLoading(false)
    }

    updateUser()

    window.addEventListener("storage", updateUser)
    window.addEventListener("user-updated", updateUser)

    return () => {
      window.removeEventListener("storage", updateUser)
      window.removeEventListener("user-updated", updateUser)
    }
  }, [])

  const isDoctor = user?.role === "doctor"
  
  // Combine items based on user type
  let allItems = [...commonItems]
  if (user) {
    allItems = [...commonItems, ...(isDoctor ? doctorItems : patientItems)]
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r h-screen bg-card ">
      <SidebarContent className="flex flex-col gap-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wide text-amethyst mb-4">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2 space-y-0">
              {allItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      className={`w-full h-10 px-3 rounded-md transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-amethyst to-french-violet text-white font-semibold shadow-purple' 
                          : 'hover:bg-muted hover:border hover:border-purple-glow text-foreground'
                      }`}
                    >
                      <Link 
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup className="mt-auto pt-4 border-t border-border">
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wide text-amethyst mb-3">Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-3 bg-gradient-to-r from-amethyst/10 to-french-violet/10 border border-purple-glow rounded-lg">
                <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize mt-1.5">{user.role}</p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
