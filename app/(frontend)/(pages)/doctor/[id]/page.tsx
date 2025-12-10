'use client'
import Image from "next/image";
import Link from "next/link";
import "./id.css"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import AppointmentForm from "@/app/(frontend)/components/AppointmentForm/AppointmentForm";
import Modal from "@/app/(frontend)/components/Modal/Modal";
import { mockDoctors } from "@/app/(frontend)/data/mockDoctors";

export default function DoctorDetail() {
  const params = useParams()
  const id = params.id as string
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // First check in mock doctors
    let foundDoctor = mockDoctors.find((d) => d.id === id)

    // If not found, check in registered doctors
    if (!foundDoctor && id.startsWith('registered-')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const registeredDoctors = users.filter((user: any) => user.userType === 'doctor')
      const registeredIdx = parseInt(id.split('-')[1])
      
      if (registeredDoctors[registeredIdx]) {
        const user = registeredDoctors[registeredIdx]
        foundDoctor = {
          id: id,
          name: user.name,
          specialty: user.specialization || 'Specialist',
          experience: user.experience || 'Not specified',
          image: `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`,
          availability: user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM'],
          rating: user.rating || 4.5,
          reviews: user.reviews || '',
          about: user.bio || 'Experienced healthcare professional'
        }
      }
    }

    setDoctor(foundDoctor)
    setLoading(false)
  }, [id])

  const handleBook = (data: any) => {
      // Get current user
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        alert('Please log in first')
        return
      }

      const user = JSON.parse(userStr)
      
      // Create appointment object
      const newAppointment = {
        doctorName: doctor?.name,
        patientEmail: user.email,
        reason: data.reason,
        date: data.date,
        status: 'Pending'
      }

      // Save to localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
      appointments.push(newAppointment)
      localStorage.setItem('appointments', JSON.stringify(appointments))
      window.dispatchEvent(new Event('appointments-updated'))
      alert(`Appointment booked with ${doctor?.name} on ${data.date?.toLocaleString()}`)
      setIsModalOpen(false)
    }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-xl text-gray-600 mb-4">Doctor not found</div>
        <Link 
          href="/doctor" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/doctor"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
          >
            ← Back to Doctors List
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Doctor Profile Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg mb-8">
          {/* Top Gradient Section */}
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>

          {/* Profile Section */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-8">
              {/* Profile Image */}
              <div className="relative w-40 h-40 mx-auto sm:mx-0">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="160px"
                  priority
                  className="rounded-2xl object-cover border-4 border-card shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">{doctor.name}</h2>
                <p className="text-primary text-lg sm:text-xl font-semibold mb-2">{doctor.specialty}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100/50 dark:bg-yellow-500/20 rounded-full">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-semibold">{doctor.rating}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/50 dark:bg-green-500/20 rounded-full text-sm">
                    <span>📚</span>
                    <span className="font-semibold">{doctor.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {doctor.about && (
              <div className="mb-8 pt-8 border-t border-border">
                <h3 className="text-xl font-bold mb-4">About</h3>
                <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
              </div>
            )}

            {/* Available Time Slots */}
            <div className="mb-8 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-6">Available Time Slots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.availability.map((slot: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-secondary/50 hover:bg-secondary border border-border rounded-lg text-foreground font-medium transition-colors cursor-pointer"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors duration-300"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center">Book Appointment</h3>
          <p className="text-center text-muted-foreground">Schedule your visit with {doctor.name}</p>
          <AppointmentForm onSubmit={handleBook} />
        </div>
      </Modal>
    </main>
  );
}
