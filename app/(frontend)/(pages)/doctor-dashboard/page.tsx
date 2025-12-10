"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle, ZapOff, Users, Calendar } from "lucide-react"

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 })
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.userType !== "doctor") {
      router.push("/patient-dashboard")
      return
    }

    setUser(parsedUser)

    // Get appointments for this doctor
    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const doctorAppointments = storedAppointments.filter((appt: any) => appt.doctorName === parsedUser.name)
    setAppointments(doctorAppointments)
    setFilteredAppointments(doctorAppointments)

    // Calculate stats
    setStats({
      total: doctorAppointments.length,
      pending: doctorAppointments.filter((a: any) => a.status === "Pending").length,
      confirmed: doctorAppointments.filter((a: any) => a.status === "Confirmed").length,
      completed: doctorAppointments.filter((a: any) => a.status === "Completed").length,
    })
  }, [router])

  // Filter appointments when selectedFilter changes
  useEffect(() => {
    let filtered = appointments
    if (selectedFilter === "pending") {
      filtered = appointments.filter((a) => a.status === "Pending")
    } else if (selectedFilter === "confirmed") {
      filtered = appointments.filter((a) => a.status === "Confirmed")
    } else if (selectedFilter === "completed") {
      filtered = appointments.filter((a) => a.status === "Completed")
    }
    setFilteredAppointments(filtered)
  }, [selectedFilter, appointments])

  // Listen for appointment updates
  useEffect(() => {
    const handleAppointmentsUpdated = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
        const doctorAppointments = storedAppointments.filter((appt: any) => appt.doctorName === parsedUser.name)
        setAppointments(doctorAppointments)

        // Apply current filter
        let filtered = doctorAppointments
        if (selectedFilter === "pending") {
          filtered = doctorAppointments.filter((a:any) => a.status === "Pending")
        } else if (selectedFilter === "confirmed") {
          filtered = doctorAppointments.filter((a: any) => a.status === "Confirmed")
        } else if (selectedFilter === "completed") {
          filtered = doctorAppointments.filter((a:any) => a.status === "Completed")
        }
        setFilteredAppointments(filtered)

        setStats({
          total: doctorAppointments.length,
          pending: doctorAppointments.filter((a: any) => a.status === "Pending").length,
          confirmed: doctorAppointments.filter((a: any) => a.status === "Confirmed").length,
          completed: doctorAppointments.filter((a: any) => a.status === "Completed").length,
        })
      }
    }

    window.addEventListener('appointments-updated', handleAppointmentsUpdated)
    return () => window.removeEventListener('appointments-updated', handleAppointmentsUpdated)
  }, [selectedFilter])

  if (!user) {
    return <div className="p-6 text-center text-lg">Loading...</div>
  }

  const handleUpdateStatus = (index: number, newStatus: string) => {
    const updatedAppointments = [...appointments]
    updatedAppointments[index].status = newStatus
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    window.dispatchEvent(new Event('appointments-updated'))

    // Update stats
    setStats({
      total: updatedAppointments.length,
      pending: updatedAppointments.filter((a) => a.status === "Pending").length,
      confirmed: updatedAppointments.filter((a) => a.status === "Confirmed").length,
      completed: updatedAppointments.filter((a) => a.status === "Completed").length,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "Confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "Rejected":
        return <ZapOff className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "Confirmed":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "Completed":
        return "bg-amethyst/20 text-amethyst dark:text-amethyst/80"
      case "Rejected":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <main className="w-full min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, Dr. {user.name}! 👨‍⚕️</h1>
        <p className="text-muted-foreground">Manage your appointments and patient consultations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Total Appointments */}
        <button
          onClick={() => setSelectedFilter("all")}
          className={`bg-card border-purple-glow rounded-xl p-6 shadow-purple transition-all cursor-pointer ${
            selectedFilter === "all" ? "ring-2 ring-amethyst ring-offset-2" : "hover:shadow-purple-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Appointments</span>
            <Users className="w-5 h-5 text-amethyst" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-2">All bookings</p>
        </button>

        {/* Pending */}
        <button
          onClick={() => setSelectedFilter("pending")}
          className={`bg-card border-purple-glow rounded-xl p-6 shadow-purple transition-all cursor-pointer ${
            selectedFilter === "pending" ? "ring-2 ring-yellow-500 ring-offset-2" : "hover:shadow-purple-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Pending</span>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-xs text-muted-foreground mt-2">Needs action</p>
        </button>

        {/* Confirmed */}
        <button
          onClick={() => setSelectedFilter("confirmed")}
          className={`bg-card border-purple-glow rounded-xl p-6 shadow-purple transition-all cursor-pointer ${
            selectedFilter === "confirmed" ? "ring-2 ring-green-500 ring-offset-2" : "hover:shadow-purple-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Confirmed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.confirmed}</p>
          <p className="text-xs text-muted-foreground mt-2">Scheduled</p>
        </button>

        {/* Completed */}
        <button
          onClick={() => setSelectedFilter("completed")}
          className={`bg-card border-purple-glow rounded-xl p-6 shadow-purple transition-all cursor-pointer ${
            selectedFilter === "completed" ? "ring-2 ring-amethyst ring-offset-2" : "hover:shadow-purple-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
            <CheckCircle className="w-5 h-5 text-amethyst" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-2">Finished</p>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-card border-purple-glow rounded-xl p-6 md:p-8 shadow-purple">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Appointments Booked With You</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage and update appointment statuses</p>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  {selectedFilter === "all" ? "No appointments scheduled yet" : "No appointments in this category"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFilter === "all" ? "Patients will start booking appointments soon!" : "Try selecting a different status"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appt, idx) => {
                  const originalIdx = appointments.findIndex((a) => a.id === appt.id)
                  return (
                  <div key={idx} className="bg-card border border-purple-glow rounded-lg p-4 md:p-6 hover:shadow-purple transition shadow-purple">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(appt.status || "Pending")}
                          <p className="font-semibold text-lg text-foreground">Patient: {appt.patientName || "Unknown"}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">Email: {appt.patientEmail}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusBadgeColor(appt.status || "Pending")}`}>
                        {appt.status || "Pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Reason</p>
                        <p className="text-sm text-foreground">{appt.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Scheduled</p>
                        <p className="text-sm text-foreground">{new Date(appt.date).toLocaleDateString()} {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    {appt.notes && (
                      <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Notes</p>
                        <p className="text-sm text-foreground">{appt.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {appt.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(originalIdx, "Confirmed")}
                            className="flex-1 min-w-[120px] px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-semibold shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(originalIdx, "Rejected")}
                            className="flex-1 min-w-[120px] px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-semibold shadow-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {appt.status === "Confirmed" && (
                        <button
                          onClick={() => handleUpdateStatus(originalIdx, "Completed")}
                          className="flex-1 min-w-[120px] px-3 py-2 bg-gradient-to-r from-amethyst to-french-violet text-white rounded-lg transition text-sm font-semibold shadow-purple hover:opacity-90"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-amethyst to-french-violet text-white rounded-xl p-6 md:p-8 shadow-purple">
            <h3 className="text-lg font-bold mb-4">Your Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-amethyst/80 text-sm">Name</p>
                <p className="font-semibold">Dr. {user.name}</p>
              </div>
              <div>
                <p className="text-amethyst/80 text-sm">Email</p>
                <p className="font-semibold break-all text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-amethyst/80 text-sm">Specialty</p>
                <p className="font-semibold">{user.specialization || "General Practitioner"}</p>
              </div>
              <div>
                <p className="text-amethyst/80 text-sm">Experience</p>
                <p className="font-semibold">{user.experience || "Not specified"}</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-amethyst/80 text-sm mb-2">Role</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  Doctor
                </span>
              </div>
            </div>
            <Link
              href="/profile/doctor"
              className="block w-full mt-6 text-center bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg transition"
            >
              Edit Profile
            </Link>
          </div>

          {/* Availability Card */}
          <div className="bg-card border-purple-glow rounded-xl p-6 md:p-8 shadow-purple">
            <h3 className="text-lg font-bold text-foreground mb-4">Availability</h3>
            <p className="text-sm text-muted-foreground mb-4">Set your working hours and availability for patients</p>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-amethyst to-french-violet text-white rounded-lg hover:opacity-90 transition font-semibold shadow-purple">
              Manage Availability
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border-purple-glow rounded-xl p-6 md:p-8 shadow-purple">
            <h3 className="text-lg font-bold text-foreground mb-4">This Week</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">New Requests</span>
                <span className="font-bold text-foreground">{stats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confirmed</span>
                <span className="font-bold text-foreground">{stats.confirmed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-bold text-foreground">{stats.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
