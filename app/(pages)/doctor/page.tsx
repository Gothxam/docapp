
import DoctorCard from "@/app/components/DoctorCard/DoctorCards"
import { mockDoctors, Doctor } from "@/app/data/mockDoctors"

export default function DoctorsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDoctors.map((doctor: Doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </main>
  )
}
