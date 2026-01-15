"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, ArrowRight } from "lucide-react"
import api from "../../utils/axios"

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const router = useRouter()
  
   // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const res = await api.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        })
        // normalize response: some endpoints return { data: [...] } or [...] directly
        const payload = res.data?.data ?? res.data
        const list = Array.isArray(payload) ? payload : (payload?.appointments ?? [])
        const normalized = list.map((a: any) => ({
          ...a,
          // normalize date field names
          appointmentDate: a.appointmentDate ?? a.date ?? a.appointment_at ?? a.dateTime,
          // normalize status to lowercase for consistent comparisons
          status: (a.status ?? '').toString().toLowerCase()
        }))
        setAppointments(normalized) // backend returns populated appointments with doctor info
      } catch (err) {
        console.error(err)
        alert("Failed to fetch appointments.")
      }
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    fetchAppointments()
  }, [router])

  // Listen for appointment updates from other windows/tabs
  useEffect(() => {
    const handleAppointmentsUpdated = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
        const patientAppointments = storedAppointments.filter((appt: any) => appt.patientEmail === parsedUser.email)
        setAppointments(patientAppointments)
      }
    }

    window.addEventListener('appointments-updated', handleAppointmentsUpdated)
    return () => window.removeEventListener('appointments-updated', handleAppointmentsUpdated)
  }, [])

  if (!user) {
    return <div className="p-6 text-center text-lg">Loading...</div>
  }

  // Get upcoming and past appointments
  // const upcomingAppointments = appointments.filter((appt: any) => new Date(appt.date) > new Date()).slice(0, 2)
  // const totalAppointments = appointments.length
  // const pendingAppointments = appointments.filter((appt: any) => appt.status === "Pending").length
  // const confirmedAppointments = appointments.filter((appt: any) => appt.status === "Confirmed").length
  const totalAppointments = appointments.length
  const upcomingAppointments = appointments.filter(
    appt =>
      ["completed"].includes(appt.status) &&
      new Date(appt.appointmentDate) > new Date()
  )
  

  const confirmedAppointments = appointments.filter(
    appt => appt.status === "approved"
  ).length

  const pendingAppointments=appointments.filter(
    appt=> appt.status==="pending"
  ).length

  return (
    <main className="w-full min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-muted-foreground">Manage your health and appointments in one place</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Total Appointments */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-200/30 rounded-lg p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Appointments</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalAppointments}</p>
          <p className="text-xs text-muted-foreground mt-2">All time</p>
        </div>

        {/* Upcoming */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/30 rounded-lg p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{upcomingAppointments.length}</p>
          <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-200/30 rounded-lg p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Pending</span>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{pendingAppointments}</p>
          <p className="text-xs text-muted-foreground mt-2">Awaiting confirmation</p>
        </div>

        {/* Confirmed */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/30 rounded-lg p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Confirmed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{confirmedAppointments}</p>
          <p className="text-xs text-muted-foreground mt-2">Ready to go</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Upcoming Appointments</h2>
                <p className="text-sm text-muted-foreground mt-1">Your next scheduled visits</p>
              </div>
              <Link href="/my-appointments" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  <Plus className="w-4 h-4" />
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appt, idx) => (
                  <div key={idx} className="bg-muted/50 hover:bg-muted rounded-lg p-4 transition border border-border/50 shadow-xs dark:shadow-none">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{appt.doctor?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{appt.reason}</p>
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(appt.appointmentDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          appt.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Profile & Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-4">Your Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-purple-100 text-sm">Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-purple-100 text-sm">Email</p>
                <p className="font-semibold break-all text-sm">{user.email}</p>
              </div>
              <div className="pt-4 border-t border-purple-500">
                <p className="text-purple-100 text-sm mb-2">Role</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  Patient
                </span>
              </div>
            </div>
            <Link
              href="/profile/patient"
              className="block w-full mt-6 text-center bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg transition"
            >
              View Full Profile
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/book-appointment"
                className="flex items-center gap-3 w-full p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition font-medium shadow-xs dark:shadow-none"
              >
                <Plus className="w-5 h-5" />
                <span>Book New Appointment</span>
              </Link>
              <Link
                href="/doctor"
                className="flex items-center gap-3 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-lg transition font-medium shadow-xs dark:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Browse Doctors</span>
              </Link>
              <Link
                href="/my-appointments"
                className="flex items-center gap-3 w-full p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:text-purple-400 rounded-lg transition font-medium shadow-xs dark:shadow-none"
              >
                <Calendar className="w-5 h-5" />
                <span>My Appointments</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
