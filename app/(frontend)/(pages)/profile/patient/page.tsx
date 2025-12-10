'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MapPin, Calendar, Droplet, AlertCircle, User, Edit2, X, Check } from 'lucide-react'

export default function PatientProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    setFormData(userData)
    setLoading(false)
  }, [router])

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-muted-foreground">Loading profile...</p>
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <Link href="/login" className="text-primary hover:underline">
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
    localStorage.setItem('user', JSON.stringify(formData))
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) =>
      u.email === user.email ? { ...u, ...formData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    setUser(formData)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  return (
    <main className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-6 md:p-8 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-purple-100">Patient Account</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-purple-100 text-sm mb-1">Email</p>
                <p className="font-semibold break-all text-sm">{user.email}</p>
              </div>
              {formData.phone && (
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Phone</p>
                  <p className="font-semibold">{formData.phone}</p>
                </div>
              )}
              {formData.bloodType && (
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">Blood Type</p>
                  <p className="font-semibold">{formData.bloodType}</p>
                </div>
              )}
            </div>

            <Link
              href="/patient-dashboard"
              className="block w-full text-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition font-semibold text-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Personal Information</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    </div>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                    </div>
                    <p className="font-semibold break-all text-sm">{user.email}</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    </div>
                    <p className="text-lg font-semibold">{user.phone || 'Not provided'}</p>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    </div>
                    <p className="text-lg font-semibold">{user.dob || 'Not provided'}</p>
                  </div>

                  {/* Blood Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                    </div>
                    <p className="text-lg font-semibold">{user.bloodType || 'Not provided'}</p>
                  </div>

                  {/* Allergies */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                    </div>
                    <p className="text-lg font-semibold">{user.allergies || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold">Address</h3>
                </div>
                <p className="text-lg">{user.address || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            // Edit Form
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-8">Edit Profile</h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email (Read-only)</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="e.g., +1 (555) 123-4567"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Blood Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Blood Type</label>
                    <input
                      type="text"
                      name="bloodType"
                      value={formData.bloodType || ''}
                      onChange={handleChange}
                      placeholder="e.g., O+, A-, B+, AB"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies || ''}
                      onChange={handleChange}
                      placeholder="e.g., Penicillin, Peanuts"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3 sm:gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-auto px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition font-semibold flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
