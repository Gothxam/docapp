'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit2, Save, X, Mail, MapPin, Phone, Award, Clock, Star, Users, CheckCircle, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DoctorProfile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    const parsed = JSON.parse(storedUser)
    if (parsed.userType !== 'doctor') {
      router.push('/patient-dashboard')
      return
    }
    
    setUser(parsed)
    setFormData(parsed)
    setProfileImage(parsed.profileImage || null)
    setLoading(false)
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImage(base64String)
        setFormData({ ...formData, profileImage: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amethyst"></div>
        <p className="text-muted-foreground mt-4">Loading profile...</p>
      </div>
    </div>
  )

  if (!user) return null

  const handleSave = () => {
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => (u.email === user.email ? updatedUser : u))
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    window.dispatchEvent(new Event('user-updated'))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  const stats = [
    { icon: Users, label: 'Total Patients', value: '450+', color: 'text-blue-500' },
    { icon: CheckCircle, label: 'Consultations', value: '1,200+', color: 'text-green-500' },
    { icon: Star, label: 'Rating', value: user.rating || '4.8', color: 'text-yellow-500' },
    { icon: Clock, label: 'Experience', value: user.experience || '10 years', color: 'text-purple-500' },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header Background */}
      <div className="h-32 bg-gradient-to-r from-amethyst/20 via-french-violet/20 to-tekhelet/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-amethyst to-french-violet blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card - Overlapping Header */}
        <div className="-mt-16 mb-8 relative z-10">
          <div className="bg-card border-purple-glow rounded-2xl p-6 md:p-8 shadow-purple-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">
              {/* Profile Avatar */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amethyst to-french-violet p-1 shadow-purple">
                    <div className="w-full h-full rounded-full overflow-hidden bg-card">
                      <Image
                        src={profileImage || `https://ui-avatars.com/api/?name=${isEditing ? formData.name : user.name}&background=9d4edd&color=fff&bold=true`}
                        alt={isEditing ? formData.name : user.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-card"></div>
                  
                  {/* Upload Button - Only in Edit Mode */}
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-semibold">Change</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {!isEditing ? (
                  <>
                    <h1 className="text-2xl font-bold text-foreground text-center">Dr. {user.name}</h1>
                    <p className="text-amethyst font-semibold text-sm mt-1">{user.specialization || 'General Practitioner'}</p>
                  </>
                ) : (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-amethyst text-sm"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      value={formData.specialization || ''}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-amethyst text-sm"
                      placeholder="Specialization"
                    />
                  </div>
                )}
              </div>

              {/* Main Info */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contact Information</h3>
                  {!isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-amethyst flex-shrink-0" />
                        <p className="text-sm text-foreground break-all">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-amethyst flex-shrink-0" />
                        <p className="text-sm text-foreground">{user.phone || '+1 (555) 000-0000'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-amethyst flex-shrink-0" />
                        <p className="text-sm text-foreground">{user.location || 'New York, USA'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Email (read-only)</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          disabled
                          className="w-full p-2 border border-border rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amethyst"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Location/Address</label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amethyst"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Professional Details</h3>
                  {!isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-amethyst flex-shrink-0" />
                        <p className="text-sm text-foreground">{user.licenseNumber || 'License: MD-12345'}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amethyst flex-shrink-0 mt-1" />
                        <p className="text-sm text-foreground">{user.experience || '10 years'} of experience</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">License Number</label>
                        <input
                          type="text"
                          value={formData.licenseNumber || ''}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amethyst"
                          placeholder="MD-12345"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Experience</label>
                        <input
                          type="text"
                          value={formData.experience || ''}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amethyst"
                          placeholder="e.g., 10 years"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-card border-purple-glow rounded-xl p-6 shadow-purple hover:shadow-purple-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Bio & Availability */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h2 className="text-xl font-bold text-foreground mb-4">Professional Bio</h2>
              {!isEditing ? (
                <p className="text-muted-foreground leading-relaxed">
                  {user.about || 'Experienced healthcare professional dedicated to providing comprehensive patient care with a focus on preventive medicine and patient education.'}
                </p>
              ) : (
                <textarea
                  value={formData.about || ''}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                  rows={4}
                  placeholder="Tell patients about yourself..."
                />
              )}
            </div>

            {/* Availability Section */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h2 className="text-xl font-bold text-foreground mb-4">Availability</h2>
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(formData.availability || ['Monday 9:00 AM - 5:00 PM', 'Wednesday 9:00 AM - 5:00 PM', 'Friday 9:00 AM - 5:00 PM']).map((slot: string, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-amethyst/10 to-french-violet/10 border border-purple-glow rounded-lg p-4 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amethyst flex-shrink-0" />
                      <p className="text-sm font-medium text-foreground">{slot}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.availability || []).map((slot: string, idx: number) => (
                    <input
                      key={idx}
                      type="text"
                      value={slot}
                      onChange={(e) => {
                        const updated = [...formData.availability]
                        updated[idx] = e.target.value
                        setFormData({ ...formData, availability: updated })
                      }}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                      placeholder="e.g., Monday 9:00 AM - 5:00 PM"
                    />
                  ))}
                  <button
                    onClick={() => setFormData({ ...formData, availability: [...(formData.availability || []), ''] })}
                    className="text-sm text-amethyst font-semibold hover:opacity-80 transition"
                  >
                    + Add Time Slot
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Specializations & Edit Button */}
          <div className="space-y-6">
            {/* Specialization */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h3 className="text-lg font-bold text-foreground mb-4">Specialization</h3>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amethyst/20 to-french-violet/20 border border-purple-glow rounded-full text-sm font-semibold text-amethyst">
                    <CheckCircle className="w-4 h-4" />
                    {user.specialization || 'General Practitioner'}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  value={formData.specialization || ''}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                  placeholder="Your specialization..."
                />
              )}
            </div>

            {/* Experience */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h3 className="text-lg font-bold text-foreground mb-4">Experience</h3>
              {!isEditing ? (
                <p className="text-2xl font-bold text-amethyst">{user.experience || '10 years'}</p>
              ) : (
                <input
                  type="text"
                  value={formData.experience || ''}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                  placeholder="e.g., 10 years"
                />
              )}
            </div>

            {/* License Number */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h3 className="text-lg font-bold text-foreground mb-4">License Number</h3>
              {!isEditing ? (
                <p className="text-foreground font-mono">{user.licenseNumber || 'MD-12345'}</p>
              ) : (
                <input
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                  placeholder="Your license number..."
                />
              )}
            </div>

            {/* Consultation Fee */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h3 className="text-lg font-bold text-foreground mb-4">Consultation Fee</h3>
              {!isEditing ? (
                <p className="text-3xl font-bold text-green-500">${user.consultationFee || '99.99'}</p>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Per Consultation</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.consultationFee || ''}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="flex-1 p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                      placeholder="99.99"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Save Button */}
        <div className="flex justify-center mb-12">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amethyst to-french-violet text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-purple"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-8 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Sidebar */}
//         <div className="md:col-span-1">
//           <div className="bg-white/20 rounded-xl shadow p-6">
//             <div className="flex justify-center mb-4">
//               <div className="relative w-24 h-24">
//                 <Image
//                   src={`https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
//                   alt={user.name}
//                   fill
//                   className="rounded-full object-cover"
//                 />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-center mb-1">{user.name}</h2>
//             <p className="text-zinc-300 text-center text-sm mb-4">Doctor</p>
//             <div className=" pt-4 p-3 bg-french-violet rounded-lg text-sm backdrop-blur-md">
//               <div className="text-sm">
//                 <p className="text-zinc-300">Email</p>
//                 <p className="font-semibold">{user.email}</p>
//               </div>
//             </div>
//             <div className="mt-6 text-sm p-3 bg-french-violet rounded-lg text-sm ">
//                 <p className="text-zinc-300">Bio</p>
//                 <p className="font-semibold">{user.about}</p>
//               </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Inline edit form or view */}
//           {!isEditing ? (
//             <>
//               {/* Professional Info (view) */}
//               <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold">Professional Information</h3>
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-semibold"
//                   >
//                     Edit Profile
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm text-zinc-100">Specialization</label>
//                     <p className="font-semibold">{user.specialization || 'Cardiology'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm text-zinc-100">License Number</label>
//                     <p className="font-semibold">{user.licenseNumber || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm text-zinc-100">Experience</label>
//                     <p className="font-semibold">{user.experience || '10 years'}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm text-zinc-100">Rating</label>
//                     <p className="font-semibold">⭐ {user.rating || '4.8'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Availability (view) */}
//               <div className="bg-russian-violet-2 rounded-xl shadow p-6">
//                 <h3 className="text-xl font-bold mb-4">Availability</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {(user.availability || ['Mon 9-11 AM', 'Wed 2-4 PM', 'Fri 10-12 AM']).map((slot: string, idx: number) => (
//                     <div key={idx} className="p-3 bg-mauve rounded-lg text-sm text-zinc-800">
//                       {slot}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Appointments */}
//               <div className="bg-russian-violet-2 rounded-xl shadow p-6">
//                 <h3 className="text-xl font-bold mb-4">Recent Appointments</h3>
//                 <div className="text-center text-gray-600 py-8">
//                   <p>No appointments yet</p>
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* Edit Mode */
//             <div className="space-y-6">
//               <div className="bg-white rounded-xl shadow p-6">
//                 <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm text-gray-600">Full Name</label>
//                     <input
//                       name="name"
//                       value={formData.name || ''}
//                       onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm text-gray-600">Email (read-only)</label>
//                     <input
//                       name="email"
//                       value={formData.email || ''}
//                       disabled
//                       className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm text-gray-600">Specialization</label>
//                     <input
//                       name="specialization"
//                       value={formData.specialization || ''}
//                       onChange={(e) => setFormData((p: any) => ({ ...p, specialization: e.target.value }))}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm text-gray-600">Experience</label>
//                     <input
//                       name="experience"
//                       value={formData.experience || ''}
//                       onChange={(e) => setFormData((p: any) => ({ ...p, experience: e.target.value }))}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="text-sm text-gray-600">Bio</label>
//                     <textarea
//                       name="about"
//                       value={formData.about || ''}
//                       onChange={(e) => setFormData((p: any) => ({ ...p, about: e.target.value }))}
//                       className="w-full p-3 border rounded-lg"
//                       rows={4}
//                     />
//                   </div>
//                   <div className="sm:col-span-2">
//                     <label className="text-sm text-gray-600">Availability (comma separated)</label>
//                     <input
//                       name="availability"
//                       value={(formData.availability && formData.availability.join) ? formData.availability.join(', ') : (formData.availability || '')}
//                       onChange={(e) => setFormData((p: any) => ({ ...p, availability: e.target.value.split(',').map((s: string) => s.trim()) }))}
//                       className="w-full p-3 border rounded-lg"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-4 mt-6">
//                   <button
//                     onClick={() => {
//                       const updatedUser = { ...user, ...formData }
//                       localStorage.setItem('user', JSON.stringify(updatedUser))
//                       const users = JSON.parse(localStorage.getItem('users') || '[]')
//                       const updatedUsers = users.map((u: any) => (u.email === user.email ? updatedUser : u))
//                       localStorage.setItem('users', JSON.stringify(updatedUsers))
//                       window.dispatchEvent(new Event('user-updated'))
//                       setUser(updatedUser)
//                       setIsEditing(false)
//                       alert('Profile updated successfully!')
//                     }}
//                     className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => { setFormData(user); setIsEditing(false) }}
//                     className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }
