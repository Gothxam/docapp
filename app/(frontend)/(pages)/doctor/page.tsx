
'use client'

import { useEffect, useState } from 'react'
import { Search, MapPin, Stethoscope } from 'lucide-react'
import DoctorCard from '../../components/DoctorCard/DoctorCards'
import { mockDoctors } from '../../data/mockDoctors'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')

  // Get all specialties
  const specialties = Array.from(
    new Set([
      ...mockDoctors.map(d => d.specialty),
      ...doctors
        .filter(d => d.specialty)
        .map(d => d.specialty)
    ])
  ).filter(Boolean)

  useEffect(() => {
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
  }, [])

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

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
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
