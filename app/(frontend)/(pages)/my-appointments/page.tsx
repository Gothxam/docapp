"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, MapPin } from "lucide-react"
import api from "../../utils/axios"

export default function MyAppointmentsPage() {
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
        console.log(res)
        const activeAppointments = res.data.filter(
          (appt: any) => appt.status !== "cancelled"||"completed"
        );

        setAppointments(activeAppointments);// backend returns populated appointments with doctor info
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

  // Listen for appointment updates from other tabs/windows
  useEffect(() => {
    const handleAppointmentsUpdated = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await api.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const activeAppointments = res.data.filter(
          (appt: any) => appt.status !== "cancelled"
        );

        setAppointments(activeAppointments);
      } catch (err) {
        console.error("Failed to fetch updated appointments:", err)
      }
    }

    window.addEventListener("appointments-updated", handleAppointmentsUpdated)
    return () => window.removeEventListener("appointments-updated", handleAppointmentsUpdated)
  }, [])

  // Cancel appointment
  const handleCancelAppointment = async (id: string) => {
  const confirmCancel = confirm("Are you sure you want to cancel this appointment?");
  if (!confirmCancel) return;

  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    await api.patch(
      `/appointments/${id}/status`,
      { status: "cancelled" },
      { headers: { Authorization: `Bearer ${token}` } }
    );


    // Update local state
    setAppointments(prev => prev.filter(appt => appt._id !== id));


    alert("Appointment cancelled successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to cancel appointment. Please try again.");
  }
};


  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-orange-100 text-orange-800"
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
                    <h3 className="text-xl font-semibold">{appt.doctor?.name || "Doctor"}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    {appt.reason && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Reason:</span> {appt.reason}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                       {new Date(appt.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                       {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {appt.notes && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Notes:</span> {appt.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status || "Pending")}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelAppointment(appt._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex-shrink-0"
                  disabled={appt.status !== "pending" && appt.status !== "approved"}
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
