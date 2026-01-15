"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, AlertCircle, ZapOff, Users, Calendar } from "lucide-react"
import api from "../../utils/axios"
import toast from "react-hot-toast"

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 })
  const router = useRouter()
const normalizeAppointments = (list: any[]) => {
  return list.map((a) => ({
    id: a._id,
    status: (a.status || "").toLowerCase(),
    appointmentDate: a.appointmentDate,
    reason: a.reason,
    notes: a.notes,

    patient: typeof a.patient === "object" ? a.patient : null,

    // 🔥 FIX HERE
    doctorId:
      typeof a.doctor === "string"
        ? a.doctor
        : a.doctor?._id?.toString(),
  }))
}


const statusToast = (status: string) => {
  switch (status) {
    case "approved":
      toast("Appointment approved", {
        style: {
          background: "#16a34a", // green
          color: "white",
        },
      })
      break

    case "completed":
      toast("Appointment completed", {
        style: {
          background: "#9d4edd", // blue
          color: "white",
        },
      })
      break

    case "rejected":
      toast("Appointment rejected", {
        style: {
          background: "#dc2626", // red
          color: "white",
        },
      })
      break

    case "pending":
      toast("Appointment pending", {
        style: {
          background: "#ca8a04", // yellow
          color: "black",
        },
      })
      break
  }
}

const calculateStats = (list: any[]) => ({
  total: list.length,
  pending: list.filter(a => a.status === "pending").length,
  confirmed: list.filter(a => a.status === "approved").length,
  completed: list.filter(a => a.status === "completed").length,
})
  useEffect(() => {
    const fetchAppointments = async () => {
  const token = localStorage.getItem("token")
  if (!token) {
    router.push("/login")
    return
  }

      const profile = await api.get('/doctor/profile')
      const doctor = profile.data?.data ?? profile.data
  setUser(doctor)

  const res = await api.get("/appointments", {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log(res)
  

  const rawList = res.data?.data ?? res.data
  const normalized = normalizeAppointments(rawList)

  const doctorAppointments = normalized.filter(
    (a) => a.doctorId === doctor._id
  )
 

  console.log("dapp",doctorAppointments)
  setAppointments(doctorAppointments)
  setFilteredAppointments(doctorAppointments) 
}
    fetchAppointments()
  }, [router])

  useEffect(() => {
  setStats(calculateStats(appointments))
}, [appointments])

  // Filter appointments when selectedFilter changes
  useEffect(() => {
    const filteredAppointments = appointments.filter((a) => {
  if (selectedFilter === "pending") return a.status === "pending"
  if (selectedFilter === "confirmed") return a.status === "approved"
  if (selectedFilter === "completed") return a.status === "completed"
  return true
})
    setFilteredAppointments(filteredAppointments)
  }, [selectedFilter,appointments])



  if (!user) {
    return <div className="p-6 text-center text-lg">Loading...</div>
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
  const token = localStorage.getItem("token")

  // optimistic UI update
  setAppointments(prev =>
    prev.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    )
  )

  statusToast(newStatus)

  try {
    await api.patch(
      `/appointments/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (err) {
    toast.error("Failed to update appointment")

    // rollback if API fails
    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: "pending" } : a
      )
    )
  }
}



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "rejected":
        return <ZapOff className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "approved":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "completed":
        return "bg-amethyst/20 text-amethyst dark:text-amethyst/80"
      case "rejected":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <main className="w-full min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, Dr. <span className="text-amethyst">{user?.name}</span> 👨‍⚕️</h1>
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
                          <p className="font-semibold text-lg text-foreground">Patient: {appt.patient?.name || "Unknown"}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">Email: {appt.patient?.email || "N/A"}
                        </p>
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
                        <p className="text-sm text-foreground">{new Date(appt.appointmentDate).toLocaleDateString()} {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "approved")}
                            className="flex-1 min-w-[120px] px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-semibold shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "rejected")}
                            className="flex-1 min-w-[120px] px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-semibold shadow-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {appt.status === "approved" && (
                        <button
                          onClick={() => handleUpdateStatus(appt.id, "completed")}
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
                <p className="text-zinc/80 text-sm">Name</p>
                <p className="font-semibold">Dr. {user.name}</p>
              </div>
              <div>
                <p className="text-zinc/80 text-sm">Email</p>
                <p className="font-semibold break-all text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-zinc/80 text-sm">Specialty</p>
                <p className="font-semibold">{user.specialization || "General Practitioner"}</p>
              </div>
              <div>
                <p className="text-zinc/80 text-sm">Experience</p>
                <p className="font-semibold">{user.experience || "Not specified"}</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-zinc/80 text-sm mb-2">Role</p>
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
            <button className="w-full px-4 py-2 bg-gradient-to-r from-amethyst to-french-violet text-white rounded-lg hover:opacity-90 transition font-semibold shadow-purple" >
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
