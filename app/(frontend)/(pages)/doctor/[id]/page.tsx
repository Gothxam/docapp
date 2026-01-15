'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, Save, X, Mail, MapPin, Phone, Award, Clock, Star, Users, CheckCircle, Upload } from 'lucide-react'
import api from '@/app/(frontend)/utils/axios'
import { useRouter } from 'next/navigation'

// import { mockDoctors } from '@/app/(frontend)/data/mockDoctors'

type Review = {
  id: string
  patientName: string
  email: string
  rating: number
  comment: string
  date: string
}

export default function DoctorDetail() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalConsultations, setTotalConsultations] = useState(0)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const router = useRouter()

  useEffect(() => {

    if (!id) return

    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctor/${id}`)
        console.log(data)
        setDoctor(data)

      } catch (err) {
        console.error(err)
        setDoctor(null)
      }
    }

    fetchDoctor()

    const stored = JSON.parse(
      localStorage.getItem(`reviews-${id}`) || '[]'
    )
    setReviews(stored)

  }, [id])

   useEffect(() => {
  if (!doctor?._id) return

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const apptRes = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      })

      const list = apptRes.data?.data ?? apptRes.data

      const doctorAppointments = list.filter(
        (a: any) =>
          (typeof a.doctor === "string"
            ? a.doctor
            : a.doctor?._id) === doctor._id
      )
      console.log(doctorAppointments)

      setTotalConsultations(doctorAppointments.length)

      const uniquePatientIds = new Set(
        doctorAppointments
          .map((a: any) => a.patient)
          .filter(Boolean)
      )

      setTotalPatients(uniquePatientIds.size)
    } catch (err) {
      console.error("Failed to fetch counts", err)
    }
  }

  fetchCounts()
}, [doctor])


  const submitReview = () => {
    if (!rating || !comment.trim()) {
      alert('Please give rating and comment')
      return
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      patientName: user?.name || 'Anonymous',
      email: user?.email || '',
      rating,
      comment,
      date: new Date().toISOString()
    }

    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated))

    setRating(0)
    setComment('')
  }
  const handleBook = () => {
    router.push(
      `/book-appointment?doctorId=${doctor._id}&doctorName=${encodeURIComponent(doctor.name)}`
    )
  }
  const stats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: totalPatients ,
      color: 'text-blue-500',
    },
    {
      icon: CheckCircle,
      label: 'Consultations',
      value: totalConsultations ,
      color: 'text-green-500',
    },
    {
      icon: Star,
      label: 'Rating',
      value: doctor?.rating || '4.8',
      color: 'text-yellow-500',
    },
    {
      icon: Clock,
      label: 'Experience',
      value: doctor?.experience || '10 years',
      color: 'text-purple-500',
    },
  ]


  if (!doctor) return <p className="py-20 text-center">Doctor not found</p>

  return (
    <main className="min-h-screen bg-background">

      <Link href="/doctor" className="text-purple-600 font-medium">
        ← Back to doctors
      </Link>

      {/* ================= PROFILE ================= */}

      <div className="h-32 bg-gradient-to-r from-amethyst/20 via-french-violet/20 to-tekhelet/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-amethyst to-french-violet blur-3xl"></div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="-mt-16 mb-8 relative z-10">
          <div className="bg-card border-purple-glow rounded-2xl p-6 md:p-8 shadow-purple-lg">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">

              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amethyst to-french-violet p-1 shadow-purple">
                    <div className="w-full h-full rounded-full overflow-hidden bg-card">
                      <Image
                        src={doctor.profilePicture || '/doctor-placeholder.png'}
                        alt={doctor.name}
                        width={128}
                        height={128}
                        unoptimized
                      />

                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-card"></div>
                </div>
                <h1 className="text-2xl font-bold text-foreground text-center">Dr. {doctor.name}</h1>
                <p className="text-amethyst font-semibold text-sm mt-1">{doctor.specialization || 'General Practitioner'}</p>
              </div>

              {/* Main Info */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-amethyst flex-shrink-0" />
                      <p className="text-sm text-foreground break-all">{doctor.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-amethyst flex-shrink-0" />
                      <p className="text-sm text-foreground">{doctor.phoneNumber || '+1 (555) 000-0000'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-amethyst flex-shrink-0" />
                      <p className="text-sm text-foreground">{doctor.address || 'New York, USA'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Professional Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-amethyst flex-shrink-0" />
                      <p className="text-sm text-foreground">{doctor.licenseNumber || 'License: MD-12345'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amethyst flex-shrink-0 mt-1" />
                      <p className="text-sm text-foreground">{doctor.experience || '10 years'} of experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
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

        {/* ================= BIO ================= */}
        <section className="border rounded-2xl p-10 shadow-sm mb-8 border-purple-glow shadow-purple hover:shadow-purple-lg transition-all">
          <h2 className="text-2xl font-semibold mb-6">
            Professional Bio
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {doctor.bio}
          </p>
        </section>

        {/* ================= AVAILABILITY ================= */}
        <section className=''>
          <h2 className="text-2xl font-semibold mb-6 ">
            Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
            {doctor.availability?.slots?.length > 0 ? (
              doctor.availability.slots.map((slot: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-xl px-6 py-4 flex items-center gap-3"
                >
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="capitalize">{slot.day}</span> :
                  {slot.fromTime} – {slot.toTime}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No availability provided</p>
            )}
          </div>
        </section>

        {/* ================= BOOK ================= */}
        <div className="pt-6 text-center">
          <button
            onClick={handleBook}
            className="px-10 py-4 rounded-xl bg-purple-600 text-white font-medium shadow-md hover:opacity-90 transition-all shadow-purple"
          >
            Book Appointment
          </button>
        </div>

        {/* ================= ADD REVIEW ================= */}
        <section className="border rounded-2xl p-10 shadow-sm mt-8 mb-8  border-purple-glow shadow-purple hover:shadow-purple-lg transition-all">
          <h2 className="text-2xl font-semibold mb-6">
            Write a Review
          </h2>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(n => (
              <Star
                key={n}
                onClick={() => setRating(n)}
                className={`w-6 h-6 cursor-pointer ${n <= rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
                  }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full border rounded-xl p-4 mb-4"
          />

          <button
            onClick={submitReview}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl shadow-md"
          >
            Submit Review
          </button>
        </section>

        {/* ================= REVIEWS ================= */}
        <section className="border rounded-2xl p-10 shadow-sm  border-purple-glow shadow-purple hover:shadow-purple-lg transition-all">
          <h2 className="text-2xl font-semibold mb-8">
            Patient Reviews
          </h2>

          {reviews.length === 0 && (
            <p className="text-muted-foreground">No reviews yet</p>
          )}

          <div className="space-y-6">
            {reviews.map(r => (
              <div key={r.id} className="border rounded-xl p-6 shadow-sm bg-gradient-to-r from-amethyst/10 to-french-violet/10  border-purple-glow  gap-3">
                <div className="flex justify-between">
                  <p className="font-medium">{r.patientName}</p>
                  <div className="flex gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AppointmentForm />
          </Modal> */}
      </div>
    </main>
  )
}

/* ================= REUSABLE ================= */



function Stat({ title, value }: any) {
  return (
    <div className="border rounded-xl p-8 shadow-sm hover:shadow-md transition">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  )
}
