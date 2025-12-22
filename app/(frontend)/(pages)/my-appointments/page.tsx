"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, MapPin } from "lucide-react"

export default function MyAppointmentsPage() {
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

  const handleCancelAppointment = (index: number) => {
    const updatedAppointments = appointments.filter((_, i) => i !== index)
    setAppointments(updatedAppointments)
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    window.dispatchEvent(new Event('appointments-updated'))
    alert("Appointment cancelled")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (!user) {
    return <div className="p-6 text-center text-lg">Loading...</div>
  }

  return (
    <main className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Appointments</h1>
        <p className="text-muted-foreground">Manage and track your medical appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-4">No appointments scheduled</p>
          <p className="text-muted-foreground mb-6">You haven't booked any appointments yet. Browse our doctors and book your first appointment.</p>
          <Link
            href="/book-appointment"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
          >
            Book Appointment Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">{appt.doctorName || "Doctor"}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    {appt.reason && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Reason:</span> {appt.reason}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(appt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {appt.notes && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Notes:</span> {appt.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status || "Pending")}`}>
                      {appt.status || "Pending"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelAppointment(idx)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex-shrink-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
