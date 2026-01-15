// app/components/DoctorCard.tsx
"use client"

import Link from "next/link"
// use native img to avoid Next/Image loader issues during debugging
import { useEffect } from 'react'
import { Star, MapPin, Award } from "lucide-react"

export default function DoctorCards({ doctor }: { doctor: any }) {
  useEffect(() => {
    if (typeof window !== 'undefined') console.debug('Doctor image:', doctor?.image)
  }, [doctor?.image])

  // Note: removed programmatic HEAD/GET verification because it triggers CORS/fetch
  // errors when requesting cross-origin avatar services. Rely on the native
  // <img> loading and the `onError` fallback to `ui-avatars` instead.

  const getExperienceColor = (experience: string) => {
    if (experience.includes('10+') || experience.includes('15+') || experience.includes('20+')) return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
    if (experience.includes('5') || experience.includes('7')) return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
    return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400'
  }

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
        <div className="relative w-28 h-28">
          <img
            src={doctor.image || '/doctor-placeholder.png'}
            alt={doctor.name}
            className="rounded-full object-cover border-4 border-card shadow-lg w-full h-full"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement
              t.onerror = null
              t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}`
            }}
          />

        </div>
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 flex items-center gap-1 font-semibold text-sm shadow-lg">
          <Star className="w-4 h-4 fill-current" />
          {doctor.rating}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6">
        {/* Name and Specialty */}
        <h3 className="font-bold text-lg sm:text-xl mb-1 text-foreground">{doctor.name}</h3>
        <p className="text-primary font-semibold text-sm sm:text-base mb-3">{doctor.specialty}</p>

        {/* Experience Badge */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getExperienceColor(doctor.experience)}`}>
            <Award className="w-4 h-4" />
            {doctor.experience}
          </div>
        </div>

        {/* Available Slots */}
        {doctor.availability?.days?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Available Days:
            </p>

            <div className="flex flex-wrap gap-1">
              {doctor.availability.days.slice(0, 2).map((day: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded"
                >
                  {day}
                </span>
              ))}

              {doctor.availability.days.length > 2 && (
                <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
                  +{doctor.availability.days.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}


        {/* Button */}
        <Link
          href={`/doctor/${doctor.id}`}
          className="w-full inline-block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-lg transition-colors duration-300 mt-4"
        >
          View Profile & Book
        </Link>
      </div>
    </div>
  )
}
