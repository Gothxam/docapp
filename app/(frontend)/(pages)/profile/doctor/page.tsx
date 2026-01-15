'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Edit2, Save, X, Mail, MapPin, Phone, Award, Clock, Star, Users, CheckCircle, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/app/(frontend)/utils/axios'

export default function DoctorProfile() {


  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({
    availability: {
      isAvailable: true,
      slots: [],
    }
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalConsultations, setTotalConsultations] = useState(0)

  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const res = await api.get('/doctor/profile')
        console.log("data", res)
        setUser(res.data)
        setFormData({
          ...res.data,
          availability: {
            isAvailable: res.data.availability?.isAvailable ?? true,
            slots: (res.data.availability?.slots || []).map((s: any) => ({
              day: s.day,
              fromTime: s.fromTime,
              toTime: s.toTime,
            })),
          },
        })
        const normalize = (p?: string) => {
      if (!p) return null
      if (p.startsWith('http')) return p

      return `${process.env.NEXT_PUBLIC_API_URL}ds/doctors/${p}`}
        setProfilePicture(normalize(res.data.profilePicture) )
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])
  
  useEffect(() => {
  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // 1️⃣ get doctor profile
      const profileRes = await api.get("/doctor/profile")
      const doctor = profileRes.data?.data ?? profileRes.data

      // 2️⃣ get appointments
      const apptRes = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const list = apptRes.data?.data ?? apptRes.data

      // 3️⃣ filter appointments for this doctor
      const doctorAppointments = list.filter(
        (a: any) =>
          (typeof a.doctor === "string" ? a.doctor : a.doctor?._id) === doctor._id
      )

      // 4️⃣ total consultations
      setTotalConsultations(doctorAppointments.length)

      // 5️⃣ unique patients count
      const uniquePatientIds = new Set(
        doctorAppointments
          .map((a: any) => a.patient?._id)
          .filter(Boolean)
      )

      setTotalPatients(uniquePatientIds.size)

    } catch (err) {
      console.error("Failed to fetch counts", err)
    }
  }

  fetchCounts()
}, [])


  // const buildUpdatePayload = () => {
  //   const allowedFields = [
  //     'name',
  //     'specialization',
  //     'phoneNumber',
  //     'address',
  //     'licenseNumber',
  //     'experience',
  //     'bio',
  //     'availability',
  //     'fee',
  //   ]

  //   const payload: any = {}

  //   allowedFields.forEach((key) => {
  //     if (formData[key] !== undefined) {
  //       payload[key] = formData[key]
  //     }
  //   })

  //   return payload
  // }


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setProfilePicture(previewUrl)
    setSelectedImage(file) // store file for later upload
  }

  const handleUploadImage = async () => {
    if (!selectedImage) return; // ❌ skip if null

    const formData = new FormData();
    formData.append('file', selectedImage);

    await api.post('/doctor/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // important
      },
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amethyst"></div>
        <p className="text-muted-foreground mt-4">Loading profile...</p>
      </div>
    </div>
  )

  if (!user) return null

  const handleSave = async () => {
    try {
      setSaving(true);

      // 1️⃣ Upload image if changed
      if (selectedImage) {
        await handleUploadImage();
      }

      // 2️⃣ Build STRICT payload (DTO-safe)
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience,
        bio: formData.bio,
        fee: formData.fee,
        availability: {
          isAvailable: formData.availability.isAvailable,
          slots: formData.availability.slots.map((s: any) => ({
            day: s.day,
            fromTime: s.fromTime,
            toTime: s.toTime,
          })),
        },
      };

      // 🔥 3️⃣ ACTUAL UPDATE CALL (you were missing this)
      await api.patch('/doctor/profile', payload);

      // 4️⃣ Refresh profile
      const refreshed = await api.get('/doctor/profile');
      setUser(refreshed.data);
      setFormData({
        ...refreshed.data,
        availability: {
          isAvailable: refreshed.data.availability?.isAvailable ?? true,
          slots: refreshed.data.availability?.slots ?? [],
        },
      });
      const normalize = (p?: string) => {
        if (!p) return null
        if (p.startsWith('http')) return p

        return `${process.env.NEXT_PUBLIC_API_URL}/uploads/doctors/${p}`}
      setProfilePicture(normalize(refreshed.data.profilePicture));
      // notify other parts of the app (doctor list, navbar, etc.) to refresh
      window.dispatchEvent(new Event('user-updated'))
      setIsEditing(false);
      setSelectedImage(null);
    } catch (err: any) {
      console.error('Update failed', err);
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  const stats = [
    { icon: Users, label: 'Total Patients', value: totalPatients, color: 'text-blue-500' },
    { icon: CheckCircle, label: 'Consultations', value: totalConsultations, color: 'text-green-500' },
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
                        src={profilePicture || `https://ui-avatars.com/api/?name=${isEditing ? formData.name : user.name}&background=9d4edd&color=fff&bold=true`}
                        alt={isEditing ? formData.name : user.name}
                        width={128}
                        height={128}
                        unoptimized
                        loading="eager"                        
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
                        <p className="text-sm text-foreground">{user.phoneNumber || '+1 (555) 000-0000'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-amethyst flex-shrink-0" />
                        <p className="text-sm text-foreground">{user.address || 'New York, USA'}</p>
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
                          value={formData.phoneNumber || ''}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amethyst"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Location/Address</label>
                        <input
                          type="text"
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  {user.bio || 'Experienced healthcare professional dedicated to providing comprehensive patient care with a focus on preventive medicine and patient education.'}
                </p>
              ) : (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
                  rows={4}
                  placeholder="Tell patients about yourself..."
                />
              )}
            </div>

            {/* Availability Section */}
            {/* Availability Section */}
            <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
              <h2 className="text-xl font-bold text-foreground mb-4">Availability</h2>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(formData.availability?.slots || []).map((slot: any, idx: any) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-amethyst/10 to-french-violet/10 border border-purple-glow rounded-lg p-4 flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4 text-amethyst" />
                      <p className="text-sm font-medium text-foreground">
                        {slot.day} {slot.fromTime} - {slot.toTime}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.availability?.slots || []).map((slot: any, idx: any) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={slot.day}
                        onChange={(e) => {
                          const updated = [...formData.availability.slots]
                          updated[idx] = { ...updated[idx], day: e.target.value }
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, slots: updated },
                          })
                        }}
                        className="flex-1 p-3 border rounded-lg"
                        placeholder="Day"
                      />

                      <input
                        type="text"
                        value={slot.fromTime}
                        onChange={(e) => {
                          const updated = [...formData.availability.slots]
                          updated[idx] = { ...updated[idx], fromTime: e.target.value }
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, slots: updated },
                          })
                        }}
                        className="w-28 p-3 border rounded-lg"
                        placeholder="From"
                      />

                      <input
                        type="text"
                        value={slot.toTime}
                        onChange={(e) => {
                          const updated = [...formData.availability.slots]
                          updated[idx] = { ...updated[idx], toTime: e.target.value }
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, slots: updated },
                          })
                        }}
                        className="w-28 p-3 border rounded-lg"
                        placeholder="To"
                      />

                      <button
                        onClick={() => {
                          const updated = [...formData.availability.slots]
                          updated.splice(idx, 1)
                          setFormData({
                            ...formData,
                            availability: { ...formData.availability, slots: updated },
                          })
                        }}
                        className="text-red-500 font-semibold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          slots: [
                            ...(formData.availability?.slots || []),
                            { day: "", fromTime: "9:00 AM", toTime: "5:00 PM" },
                          ],
                        },
                      })
                    }
                    className="text-sm text-amethyst font-semibold"
                  >
                    + Add Day
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
                <p className="text-3xl font-bold text-green-500">${user.fee || '99.99'}</p>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Per Consultation</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fee || ''}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
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
