'use client'
import { mockDoctors, Doctor } from "@/app/data/mockDoctors";
import Image from "next/image";
import Link from "next/link";
import "./id.css"
import { useParams } from "next/navigation"
import { useState } from "react"
import Modal from "@/app/components/Modal/Modal"
import AppointmentForm from "@/app/components/AppointmentForm/AppointmentForm"

export default function DoctorDetail() {
  const params = useParams()
  const id = params.id as string
  // console.log('Looking for doctor with ID:',id);
  // console.log('Available doctors:', mockDoctors);
  const doctor = mockDoctors.find((d) => d.id === id);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleBook = (data: any) => {
      console.log("Appointment submitted:", data)
      alert(`Appointment booked with ${doctor?.name} on ${data.date}`)
      setIsModalOpen(false)
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
            {doctor.availability.map((slot, idx) => (
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
