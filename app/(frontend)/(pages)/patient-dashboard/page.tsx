"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    // Get appointments for this patient
    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    const patientAppointments = storedAppointments.filter((appt: any) => appt.patientEmail === parsedUser.email)
    setAppointments(patientAppointments)
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

  const handleCancelAppointment = (index: number) => {
    const updatedAppointments = appointments.filter((_, i) => i !== index)
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    window.dispatchEvent(new Event('appointments-updated'))
    alert("Appointment cancelled")
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Patient Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500  text-white p-6 rounded-xl shadow-lg mb-8">
        <p className="text-lg">Welcome back, <strong>{user.name}</strong>!</p>
        <p className="text-sm opacity-90 mt-1">Email: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Appointments */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't booked any appointments yet.</p>
                <Link
                  href="/doctor"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Doctors
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{appt.doctorName || "Doctor"}</p>
                        <p className="text-sm text-gray-600">{appt.reason}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {new Date(appt.date).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Status: <span className={`font-semibold ${appt.status === "Confirmed" ? "text-green-600" : "text-yellow-600"}`}>{appt.status || "Pending"}</span></p>
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(idx)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Cancel
                      </button>
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
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p className="font-semibold capitalize">{user.userType}</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/doctor"
                className="block text-center py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Browse Doctors
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
