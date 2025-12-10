"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, Phone, AlertCircle, ArrowRight } from "lucide-react"

export default function DoctorSchedule() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
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

    // Get all appointments for this doctor
    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const doctorAppointments = storedAppointments.filter((appt: any) => appt.doctorName === parsedUser.name)
    setAppointments(doctorAppointments)
    setFilteredAppointments(doctorAppointments)
  }, [router])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 dark:text-yellow-400"
      case "Confirmed":
        return "bg-green-500/20 text-green-600 border-green-500/30 dark:text-green-400"
      case "Completed":
        return "bg-amethyst/20 text-amethyst border-amethyst/30 dark:text-amethyst/80"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, <span className="text-amethyst">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground">Manage your patient appointments and schedule</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Total Appointments</p>
            <p className="text-3xl font-bold text-amethyst">{appointments.length}</p>
          </div>
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {appointments.filter((a) => a.status === "Pending").length}
            </p>
          </div>
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter((a) => a.status === "Confirmed").length}
            </p>
          </div>
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-3xl font-bold text-blue-600">
              {appointments.filter((a) => a.status === "Completed").length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "pending", "confirmed", "completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                selectedFilter === filter
                  ? "bg-gradient-to-r from-amethyst to-french-violet text-white shadow-purple hover:opacity-90"
                  : "bg-card border border-purple-glow text-foreground hover:border-amethyst hover:shadow-purple"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="grid gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt: any) => (
              <div
                key={appt.id}
                className="bg-card border-purple-glow rounded-xl p-6 shadow-purple hover:shadow-purple-lg transition-all"
              >
                <div className="grid md:grid-cols-4 gap-4 items-start md:items-center">
                  {/* Patient Info */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Patient</p>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-amethyst" />
                      {appt.patientName}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amethyst" />
                      {appt.date}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {appt.time}
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contact</p>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amethyst" />
                      {appt.phoneNumber}
                    </p>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col gap-2">
                    <span
                      className={`text-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                        appt.status
                      )}`}
                    >
                      {appt.status}
                    </span>
                    <Link
                      href={`/doctor-dashboard?appointmentId=${appt.id}`}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-amethyst text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Manage <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Additional Info */}
                {appt.reason && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Reason for Visit</p>
                    <p className="text-sm text-foreground">{appt.reason}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-card border-purple-glow rounded-xl p-12 text-center shadow-purple">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground mb-2">No Appointments Found</p>
              <p className="text-muted-foreground">There are no appointments for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
