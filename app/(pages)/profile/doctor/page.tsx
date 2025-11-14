'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function DoctorProfile() {
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
          <div className="bg-white/20 rounded-xl shadow p-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <Image
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">{user.name}</h2>
            <p className="text-zinc-300 text-center text-sm mb-4">{user.specialization || 'Specialist'}</p>
            <div className=" pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
              <div className="text-sm">
                <p className="text-zinc-300">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 text-sm p-3 bg-purple-50 rounded-lg text-sm ">
                <p className="text-zinc-300">Bio</p>
                <p className="font-semibold">{user.email}</p>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Professional Info */}
          <div className="bg-russian-violet-2 rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Specialization</label>
                <p className="font-semibold">{user.specialization || 'Cardiology'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">License Number</label>
                <p className="font-semibold">{user.licenseNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Experience</label>
                <p className="font-semibold">{user.experience || '10 years'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Rating</label>
                <p className="font-semibold">⭐ {user.rating || '4.8'}</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-russian-violet-2 rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Availability</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM']).map((slot: string, idx: number) => (
                <div key={idx} className="p-3 bg-purple-50 rounded-lg text-sm">
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-russian-violet-2 rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Recent Appointments</h3>
            <div className="text-center text-gray-600 py-8">
              <p>No appointments yet</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
            Edit Profile
          </button>
        </div>
      </div>
    </main>
  )
}
