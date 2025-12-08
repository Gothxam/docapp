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
    <main className="max-w-3xl mx-auto p-6">
      <div className="details  p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div>
          
        </div>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            sizes="128px"
            priority
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{doctor.name}</h2>
        <p className="text-center text-gray-600 text-lg">{doctor.specialty}</p>
        <p className="text-center text-gray-500 mt-1">
          Experience: {doctor.experience}
        </p>
        
        <div className="flex items-center justify-center mt-2">
          <span className="text-yellow-500 text-xl">★</span>
          <span className="ml-1 text-gray-700">{doctor.rating}</span>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Time Slots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doctor.availability.map((slot: string, idx: number) => (
              <div 
                key={idx}
                className="p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Book Appointment
          </button>
        </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4 text-center">
          Book Appointment with {doctor.name}
        </h3>
        <AppointmentForm onSubmit={handleBook} />
      </Modal>
        <div className="mt-8 text-center">
          <Link
            href="/doctor"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Doctors List
          </Link>
        </div>
      </div>
    </main>
  );
}
