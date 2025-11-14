'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PatientProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  if (loading) return <div className="p-6 text-center">Loading...</div>

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <Link href="/login" className="text-purple-600 hover:text-purple-700">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <Image
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff`}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">{user.name}</h2>
            <p className="text-gray-600 text-center text-sm mb-4">Patient</p>
            <div className="border-t pt-4 space-y-3">
              <div className="text-sm">
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">{user.phone || 'N/A'}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-semibold">{user.dob || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Blood Type</label>
                <p className="font-semibold">{user.bloodType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Allergies</label>
                <p className="font-semibold">{user.allergies || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Your Appointments</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Upcoming Appointments</p>
                    <p className="text-sm text-gray-600">No upcoming appointments</p>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/doctor" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Book Appointment
            </Link>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Medical History</h3>
            <div className="text-center text-gray-600 py-8">
              <p>No medical records available</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            Edit Profile
          </button>
        </div>
      </div>
    </main>
  )
}
