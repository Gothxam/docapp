"use client"

import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    // get user data from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))

    // get appointments
    const storedAppointments = localStorage.getItem("appointments")
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments))
  }, [])

  if (!user) return <p className="text-center mt-10">No user logged in</p>

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-8 text-center">
        <p className="text-xl font-semibold">{user.name}</p>
        <p className="text-gray-600 text-sm capitalize">{user.role}</p>
      </div>

      {user.role === "patient" ? (
        <PatientDashboard appointments={appointments} />
      ) : (
        <DoctorDashboard appointments={appointments} doctorName={user.name} />
      )}
    </main>
  )
}

// 🧍 PATIENT VIEW
function PatientDashboard({ appointments }: { appointments: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No appointments booked yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {appointments.map((appt, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow">
              <p className="font-semibold text-lg">{appt.doctorName}</p>
              <p className="text-gray-600 text-sm">{appt.specialty}</p>
              <p className="text-sm mt-1"><strong>Reason:</strong> {appt.reason}</p>
              <p className="text-sm">
                <strong>Date:</strong> {new Date(appt.date).toLocaleString()}
              </p>
              <p className="text-sm text-indigo-600 font-medium">Status: {appt.status}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// 🩺 DOCTOR VIEW
function DoctorDashboard({
  appointments,
  doctorName,
}: {
  appointments: any[]
  doctorName: string
}) {
  const doctorAppointments = appointments.filter(
    (appt) => appt.doctorName === doctorName
  )

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Appointments Booked With Me</h2>

      {doctorAppointments.length === 0 ? (
        <p className="text-gray-500 text-center">No patients booked yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {doctorAppointments.map((appt, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow">
              <p className="font-semibold text-lg">{appt.reason}</p>
              <p className="text-sm"><strong>Patient:</strong> Unknown (demo mode)</p>
              <p className="text-sm">
                <strong>Date:</strong> {new Date(appt.date).toLocaleString()}
              </p>
              <p className="text-sm text-indigo-600 font-medium">
                Status: {appt.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
