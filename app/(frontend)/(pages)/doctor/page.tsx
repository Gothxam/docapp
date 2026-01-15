
'use client'

import { useEffect, useState } from 'react'
import { Search, MapPin, Stethoscope } from 'lucide-react'
import DoctorCard from '../../components/DoctorCard/DoctorCards'
// import { mockDoctors } from '../../data/mockDoctors'
import api from '../../utils/axios'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  // Get all specialties
  const specialties = Array.from(
    new Set([
      ...doctors
        .filter(d => d.specialty)
        .map(d => d.specialty)
    ])
  ).filter(Boolean)

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get('/doctor')
        const users = res.data?.data ?? res.data

        const resolveImage = (profilePicture: any, name: string) => {
          const apiBase = (process.env.NEXT_API_URL || '').replace(/\/$/, '')
          if (!profilePicture) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
          const p = String(profilePicture)
          if (p.startsWith('http')) return p
          // handle protocol-relative urls (e.g. //example.com/..)
          if (p.startsWith('//')) return `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}${p}`

          // At this point prefer relative paths so production (same-origin or proxy)
          // can serve the files. If NEXT_PUBLIC_API_URL is provided, prefix it.
          const prefix = apiBase || ''

          // already an absolute path on the backend e.g. '/uploads/abc.jpg'
          if (p.startsWith('/')) {
            // ensure doctor uploads live under /uploads/doctors/
            if (p.startsWith('/uploads/doctors/')) return prefix ? `${prefix}${p}` : p
            if (p.startsWith('/uploads/')) return prefix ? `${prefix}/uploads/doctors/${p.replace('/uploads/','')}` : `/uploads/doctors/${p.replace('/uploads/','')}`
            return prefix ? `${prefix}${p}` : p
          }

          // sometimes backend returns 'uploads/abc.jpg' or already contains uploads
          if (p.includes('/uploads/')) {
            if (p.includes('/uploads/doctors/')) return prefix ? `${prefix}/${p.replace(/^\//, '')}` : `/${p.replace(/^\//, '')}`
            return prefix ? `${prefix}/${p.replace(/^\//, '').replace('uploads/','uploads/doctors/')}` : `/${p.replace(/^\//, '').replace('uploads/','uploads/doctors/')}`
          }

          // otherwise assume it's a plain filename placed under uploads/doctors
          return prefix ? `${prefix}/uploads/doctors/${p}` : `/uploads/doctors/${p}`
        }

        const registeredDoctors = users
          .filter((user: any) => user.role === 'doctor')
          .map((user: any) => ({
            id: user._id,
            name: user.name,
            specialty: user.specialization || 'Specialist',
            experience: user.experience || 'Not specified',
            image: resolveImage(user.profilePicture, user.name),
            availability: (() => {
              if (!user.availability) return { days: [], timeSlots: [] }
              if (Array.isArray(user.availability.days) && user.availability.days.length > 0) {
                return {
                  days: user.availability.days,
                  timeSlots: user.availability.timeSlots ?? [],
                }
              }
              if (Array.isArray(user.availability.slots) && user.availability.slots.length > 0) {
                const days = user.availability.slots.map((s: any) => s.day)
                const timeSlots = user.availability.slots.map((s: any) => `${s.fromTime} - ${s.toTime}`)
                return { days, timeSlots }
              }
              return { days: [], timeSlots: [] }
            })(),
            rating: user.rating || 4.5,
            reviews: user.reviews || '',
            about: user.bio || 'Experienced healthcare professional'
          }))

        setDoctors(registeredDoctors)
      } catch (error) {
        console.log(error)
      }
    }

    getUsers()

    const onUserUpdated = () => getUsers()
    window.addEventListener('user-updated', onUserUpdated)
    return () => window.removeEventListener('user-updated', onUserUpdated)
  }, [])
    
  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })
    setFilteredDoctors(filtered)
  }, [doctors, searchTerm, selectedSpecialty])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Find Your Doctor</h1>
          </div>
          <p className="text-muted-foreground text-lg">Browse our network of qualified healthcare professionals</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            />
          </div>

          {/* Specialty Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpecialty('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedSpecialty === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All Specialties
            </button>
            {specialties.map(specialty => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedSpecialty === specialty
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-secondary/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No doctors found matching your search.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor: any) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
