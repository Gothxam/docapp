"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import api from "../../utils/axios"
import { useSearchParams } from "next/navigation"


export default function BookAppointmentPage() {
  const [user, setUser] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const searchParams = useSearchParams()

  const doctorIdFromUrl = searchParams.get("doctorId")
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    reason: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  useEffect(() => {
    if (doctorIdFromUrl) {
      setFormData(prev => ({
        ...prev,
        doctorId: doctorIdFromUrl,
      }))
    }
  }, [doctorIdFromUrl])

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const res = await api('/doctor');
        const data = await res.data;
        console.log(data)
        setDoctors(data);
      } catch (error) {
        console.log(error)
      }
    }
    getDoctors()
  }, [])
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)

    // Only patients can book appointments
    if (parsedUser.role !== "patient") {
      router.push("/doctor-dashboard")
      return
    }

    setUser(parsedUser)

    // Get all doctors

  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  // If doctorId changes, also update doctorName for display
  //   if (name === 'doctorId') {
  //     const selectedDoctor = doctors.find(d => d.id === value);
  //     if (selectedDoctor) {
  //       setFormData(prev => ({
  //         ...prev,
  //         doctorName: selectedDoctor.name
  //       }));
  //     }
  //   }
  // };
  const selectedDoctor = doctors.find(
    d => d._id === formData.doctorId
  );


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const payload = {
      doctorId: formData.doctorId, // THIS is mandatory
      appointmentDate: formData.date,
      reason: formData.reason,
      notes: formData.notes,
    };

    try {
      const token = localStorage.getItem("token") // JWT you got on login


      const res = await api.post('/appointments', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res) {
        throw new Error("Failed to book appointment")
      }

      alert("Appointment booked successfully!")
      router.push("/my-appointments")

    } catch (err) {
      console.log(err)
      console.log('Payload:', payload)

      setError("Failed to book appointment. Please try again.")
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

            <label htmlFor="doctorId" className="block text-sm font-semibold mb-2">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              required
              disabled={!!doctorIdFromUrl} // OPTIONAL: lock doctor if redirected
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Choose a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} {doctor.specialization && `(${doctor.specialization})`}
                </option>
              ))}
            </select>
            {selectedDoctor && (
              <div className="text-sm text-green-600 ">
                Booking appointment with <strong>{selectedDoctor.name}</strong>
              </div>
            )}
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