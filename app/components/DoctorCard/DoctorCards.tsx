// app/components/DoctorCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import "@/app/components/DoctorCard/docCard.css"
export default function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <div className="card rounded-xl p-4 sm:p-5 shadow hover:shadow-lg hover:shadow-purple-500/50 backdrop-blur-md transition">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            sizes="96px"
            className="rounded-full object-cover"
            priority
          />
        </div>
        <h3 className="font-semibold text-base sm:text-lg">{doctor.name}</h3>
        <p className="text-zinc-300 text-xs sm:text-sm">{doctor.specialty}</p>
        <p className="text-zinc-300 text-xs sm:text-sm">{doctor.experience}</p>
        <p className="text-yellow-500 text-xs sm:text-sm mt-1">⭐ {doctor.rating}</p>

        <Link
          href={`/doctor/${doctor.id}`}
          className="mt-4 inline-block border border-white/30 bg-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
