'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PatientProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData(userData)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Update localStorage user
    localStorage.setItem('user', JSON.stringify(formData))

    // Update users array in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) =>
      u.email === user.email ? { ...u, ...formData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    setUser(formData)
    setIsEditing(false)

    // Show success feedback
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
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
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=3B82F6&color=fff`}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1 ">{user.name}</h2>
            <p className="text-zinc-200 text-center text-sm mb-4">Patient</p>
            <div className=" pt-4 space-y-3">
              <div className="text-sm pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
                <p className="text-zinc-200">Email</p>
                <p className="ffont-semibold">{user.email}</p>
              </div>
              <div className="text-sm pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
                <p className="text-zinc-200">Phone</p>
                <p className="font-semibold">{formData.phone || 'N/A'}</p>
              </div>
              <div className="text-sm pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
                <p className="text-zinc-200">Blood Type</p>
                <p className="font-semibold">{formData.bloodType || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4">
            <Link
              href="/patient-dashboard"
              className="block text-center py-2 bg-gray-600/20 border text-white-800 rounded-full hover:bg-gray-300/20 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {!isEditing ? (
            <>
              {/* Personal Info - View Mode */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500  rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Personal Information</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-semibold"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-200">Full Name</label>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-200">Email</label>
                    <p className="font-semibold text-sm break-all">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-200">Phone</label>
                    <p className="font-semibold">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-200">Date of Birth</label>
                    <p className="font-semibold">{user.dob || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-200">Blood Type</label>
                    <p className="font-semibold">{user.bloodType || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-200">Allergies</label>
                    <p className="font-semibold">{user.allergies || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-persian-indigo rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Address</h3>
                <div>
                  <label className="text-sm text-zinc-200">Address</label>
                  <p className="font-semibold">{user.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Appointments */}
              <div className="bg-persian-indigo rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Your Appointments</h3>
                <div className="space-y-3">
                  <div className="p-4  rounded-lg bg-french-violet">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white-800">Upcoming Appointments</p>
                        <p className="text-sm text-white-600">No upcoming appointments</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/doctor" className="inline-block mt-4 px-4 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition text-sm font-semibold">
                  Book Appointment
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Edit Form */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-6">Edit Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Email (Read-only)</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Blood Type</label>
                      <input
                        type="text"
                        name="bloodType"
                        value={formData.bloodType || ''}
                        onChange={handleChange}
                        placeholder="e.g., O+"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Allergies</label>
                      <input
                        type="text"
                        name="allergies"
                        value={formData.allergies || ''}
                        onChange={handleChange}
                        placeholder="e.g., Penicillin"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
