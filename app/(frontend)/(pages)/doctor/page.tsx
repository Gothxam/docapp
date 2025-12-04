'use client'

import { useEffect, useState } from 'react'

import DoctorCard from '../../components/DoctorCard/DoctorCards'
import { mockDoctors } from '../../data/mockDoctors'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    // Start with mock doctors
    let allDoctors = [...mockDoctors]

    // Add registered doctors from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const registeredDoctors = users.filter((user: any) => user.userType === 'doctor').map((user: any, idx: number) => ({
      id: `registered-${idx}`,
      name: user.name,
      specialty: user.specialization || 'Specialist',
      experience: user.experience || 'Not specified',
      image: `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`,
      availability: user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM'],
      rating: user.rating || 4.5,
      reviews: user.reviews || '',
      about: user.bio || 'Experienced healthcare professional'
    }))

    allDoctors = [...allDoctors, ...registeredDoctors]
    setDoctors(allDoctors)
  }, [])

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdated = () => {
      let allDoctors = [...mockDoctors]
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const registeredDoctors = users.filter((user: any) => user.userType === 'doctor').map((user: any, idx: number) => ({
        id: `registered-${idx}`,
        name: user.name,
        specialty: user.specialization || 'Specialist',
        experience: user.experience || 'Not specified',
        image: `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`,
        availability: user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM'],
        rating: user.rating || 4.5,
        reviews: user.reviews || '',
        about: user.bio || 'Experienced healthcare professional'
      }))
      allDoctors = [...allDoctors, ...registeredDoctors]
      setDoctors(allDoctors)
    }

    window.addEventListener('user-updated', handleUserUpdated)
    return () => window.removeEventListener('user-updated', handleUserUpdated)
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Doctors</h1>

      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor: any) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </main>
  )
}
