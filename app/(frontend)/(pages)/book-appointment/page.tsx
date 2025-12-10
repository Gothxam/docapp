"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BookAppointmentPage() {
  const [user, setUser] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    date: "",
    reason: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    
    // Only patients can book appointments
    if (parsedUser.userType !== "patient") {
      router.push("/doctor-dashboard")
      return
    }
    
    setUser(parsedUser)

    // Get all doctors
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const doctorsList = allUsers.filter((u: any) => u.userType === "doctor")
    setDoctors(doctorsList)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Update doctorName when doctorId changes
    if (name === "doctorId") {
      const selectedDoctor = doctors.find(d => d.id === value || d.name === value)
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          doctorName: selectedDoctor.name
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.doctorName || !formData.date || !formData.reason) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      // Get existing appointments
      const existingAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")

      // Create new appointment
      const newAppointment = {
        id: Date.now().toString(),
        patientEmail: user.email,
        patientName: user.name,
        doctorName: formData.doctorName,
        date: formData.date,
        reason: formData.reason,
        notes: formData.notes,
        status: "Pending",
        createdAt: new Date().toISOString(),
      }

      // Add to appointments
      const updatedAppointments = [...existingAppointments, newAppointment]
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

      // Trigger update event
      window.dispatchEvent(new Event('appointments-updated'))

      alert("Appointment booked successfully!")
      router.push("/my-appointments")
    } catch (err) {
      setError("Failed to book appointment. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="p-6 text-center text-lg">Loading...</div>
  }

  return (
    <main className="max-w-2xl ">
      <div className="mb-8">
        <Link href="/my-appointments" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </Link>
        <h1 className="text-4xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-muted-foreground">Schedule a consultation with one of our doctors</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label htmlFor="doctorName" className="block text-sm font-semibold mb-2">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              id="doctorName"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Choose a doctor</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.id || doctor.name} value={doctor.name}>
                    {doctor.name} {doctor.specialization && `(${doctor.specialization})`}
                  </option>
                ))
              ) : (
                <option disabled>No doctors available</option>
              )}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold mb-2">
              Appointment Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold mb-2">
              Reason for Appointment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe your symptoms or reason for the appointment"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional information for the doctor"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Patient Info Display */}
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p><span className="font-medium">Booking as:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
            <Link
              href="/my-appointments"
              className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-muted transition font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-semibold mb-2">Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your appointment will be reviewed and confirmed by the doctor</li>
            <li>You will receive a confirmation notification once approved</li>
            <li>Make sure to arrive 10 minutes before your scheduled time</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
