'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Inline edit (no separate settings page) - similar UX as patient profile

export default function DoctorProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      setFormData(parsed)
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
            <p className="text-zinc-300 text-center text-sm mb-4">Doctor</p>
            <div className=" pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
              <div className="text-sm">
                <p className="text-zinc-300">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 text-sm p-3 bg-french-violet rounded-lg text-sm ">
                <p className="text-zinc-300">Bio</p>
                <p className="font-semibold">{user.about}</p>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Inline edit form or view */}
          {!isEditing ? (
            <>
              {/* Professional Info (view) */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Professional Information</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-semibold"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-100">Specialization</label>
                    <p className="font-semibold">{user.specialization || 'Cardiology'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-100">License Number</label>
                    <p className="font-semibold">{user.licenseNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-100">Experience</label>
                    <p className="font-semibold">{user.experience || '10 years'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-100">Rating</label>
                    <p className="font-semibold">⭐ {user.rating || '4.8'}</p>
                  </div>
                </div>
              </div>

              {/* Availability (view) */}
              <div className="bg-russian-violet-2 rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM']).map((slot: string, idx: number) => (
                    <div key={idx} className="p-3 bg-mauve rounded-lg text-sm text-zinc-800">
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
            </>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                      name="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email (read-only)</label>
                    <input
                      name="email"
                      value={formData.email || ''}
                      disabled
                      className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Specialization</label>
                    <input
                      name="specialization"
                      value={formData.specialization || ''}
                      onChange={(e) => setFormData((p: any) => ({ ...p, specialization: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Experience</label>
                    <input
                      name="experience"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData((p: any) => ({ ...p, experience: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600">Bio</label>
                    <textarea
                      name="about"
                      value={formData.about || ''}
                      onChange={(e) => setFormData((p: any) => ({ ...p, about: e.target.value }))}
                      className="w-full p-3 border rounded-lg"
                      rows={4}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600">Availability (comma separated)</label>
                    <input
                      name="availability"
                      value={(formData.availability && formData.availability.join) ? formData.availability.join(', ') : (formData.availability || '')}
                      onChange={(e) => setFormData((p: any) => ({ ...p, availability: e.target.value.split(',').map((s: string) => s.trim()) }))}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      const updatedUser = { ...user, ...formData }
                      localStorage.setItem('user', JSON.stringify(updatedUser))
                      const users = JSON.parse(localStorage.getItem('users') || '[]')
                      const updatedUsers = users.map((u: any) => (u.email === user.email ? updatedUser : u))
                      localStorage.setItem('users', JSON.stringify(updatedUsers))
                      window.dispatchEvent(new Event('user-updated'))
                      setUser(updatedUser)
                      setIsEditing(false)
                      alert('Profile updated successfully!')
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => { setFormData(user); setIsEditing(false) }}
                    className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
