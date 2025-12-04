"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
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

    // Calculate stats
    setStats({
      total: doctorAppointments.length,
      pending: doctorAppointments.filter((a: any) => a.status === "Pending").length,
      confirmed: doctorAppointments.filter((a: any) => a.status === "Confirmed").length,
      completed: doctorAppointments.filter((a: any) => a.status === "Completed").length,
    })
  }, [router])

  // Listen for appointment updates
  useEffect(() => {
    const handleAppointmentsUpdated = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
        const doctorAppointments = storedAppointments.filter((appt: any) => appt.doctorName === parsedUser.name)
        setAppointments(doctorAppointments)

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
  }, [])

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

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Doctor Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg mb-8">
        <p className="text-lg">Welcome, <strong>Dr. {user.name}</strong>!</p>
        <p className="text-sm opacity-90 mt-1">Specialty: {user.specialization || "General"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Appointments</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-3xl font-bold">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* My Appointments */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Appointments Booked With Me</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>No appointments yet. Patients will book appointments soon!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">Patient Details</p>
                        <p className="text-sm text-gray-600 mt-1">Email: {appt.patientEmail}</p>
                        <p className="text-sm text-gray-600">Reason: {appt.reason}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          📅 {new Date(appt.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Status</p>
                        <p className={`font-bold px-3 py-1 rounded text-white text-sm ${
                          appt.status === "Pending" ? "bg-yellow-500" :
                          appt.status === "Confirmed" ? "bg-green-500" :
                          appt.status === "Completed" ? "bg-blue-500" :
                          "bg-red-500"
                        }`}>
                          {appt.status || "Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {appt.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(idx, "Confirmed")}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(idx, "Rejected")}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {appt.status === "Confirmed" && (
                        <button
                          onClick={() => handleUpdateStatus(idx, "Completed")}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <section className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Profile</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">Dr. {user.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold text-xs break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Specialty</p>
                <p className="font-semibold">{user.specialization || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Experience</p>
                <p className="font-semibold">{user.experience || "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Availability Card (Optional) */}
          <section className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Availability</h3>
            <p className="text-sm text-gray-600 mb-3">Manage your available time slots</p>
            <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm font-semibold">
              Set Availability
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
