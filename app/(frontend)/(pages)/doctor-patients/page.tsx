"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Calendar, Search, AlertCircle } from "lucide-react"
import api from "../../utils/axios"

interface Patient {
  id: string
  patientName: string
  patientEmail: string
  phoneNumber: string
  date: string
  status: string
  reason?: string
  completedCount?: number
  lastDate?: string
}

export default function DoctorPatients() {
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // import api from "@/utils/axios"

  const [completedCount, setCompletedCount] = useState<number>(0)

  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      // 1️⃣ AUTH + ROLE CHECK
      const doctorRes = await api.get("/doctor/profile")
      setUser(doctorRes.data)

      // 2️⃣ FETCH DOCTOR APPOINTMENTS
      const apptRes = await api.get("/appointments")
      console.log("dfghj",apptRes)
      // 3️⃣ KEEP ONLY COMPLETED
      const completedAppointments = apptRes.data.filter((appt: any) => appt.status === "completed")

      // total completed consultations (count every appointment)
      setCompletedCount(completedAppointments.length)

      // 4️⃣ AGGREGATE PER PATIENT (keep patient once but include count and lastDate)
      const byPatient: Record<string, Patient & { completedCount: number; lastDate?: string; reasons: string[] }> = {}

      completedAppointments.forEach((appt: any) => {
        const patient = appt.patient
        if (!patient) return
        const id = patient._id || patient.email || patient.name
        const apptDate = appt.appointmentDate || appt.date

        if (!byPatient[id]) {
          byPatient[id] = {
            id,
            patientName: patient.name || 'Unknown',
            patientEmail: patient.email || 'unknown',
            phoneNumber: patient.phoneNumber || 'N/A',
            date: apptDate,
            lastDate: apptDate,
            status: appt.status,
            reason: appt.reason,
            completedCount: 1,
            reasons: appt.reason ? [appt.reason] : []
          }
        } else {
          byPatient[id].completedCount = (byPatient[id].completedCount || 0) + 1
          // update lastDate if this appointment is more recent
          if (apptDate && (!byPatient[id].lastDate || new Date(apptDate) > new Date(byPatient[id].lastDate!))) {
            byPatient[id].lastDate = apptDate
            byPatient[id].date = apptDate
          }
          if (appt.reason) byPatient[id].reasons.push(appt.reason)
        }
      })

      const list = Object.values(byPatient).map(p => ({
        id: p.id,
        patientName: p.patientName,
        patientEmail: p.patientEmail,
        phoneNumber: p.phoneNumber,
        date: p.date,
        status: p.status,
        reason: p.reasons && p.reasons.length ? p.reasons[p.reasons.length - 1] : p.reason,
        completedCount: p.completedCount,
        lastDate: p.lastDate
      }))

      setPatients(list)
      setFilteredPatients(list)
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login")
      } else if (err.response?.status === 403) {
        router.push("/patient-dashboard")
      } else {
        console.error("Failed to fetch doctor patients", err)
      }
    }
  }

  fetchAppointments()
}, [router])
 useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.patientName.toLowerCase().includes(query) ||
            p.patientEmail.toLowerCase().includes(query) ||
            p.phoneNumber.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, patients])

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Patient History</h1>
          <p className="text-muted-foreground">View all patients you have completed consultations with</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Total Patients</p>
            <p className="text-3xl font-bold text-amethyst">{patients.length}</p>
          </div>
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Completed Consultations</p>
            <p className="text-3xl font-bold text-amethyst">{completedCount}</p>
          </div>
          <div className="bg-card border-purple-glow rounded-xl p-6 shadow-purple">
            <p className="text-sm text-muted-foreground mb-2">Search Results</p>
            <p className="text-3xl font-bold text-amethyst">{filteredPatients.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amethyst"
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-card border-purple-glow rounded-xl p-6 shadow-purple hover:shadow-purple-lg transition-all"
              >
                <div className="grid md:grid-cols-5 gap-4 items-start">
                  {/* Patient Name */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Patient Name</p>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-amethyst flex-shrink-0" />
                      {patient.patientName}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Email</p>
                    <p className="text-sm text-foreground flex items-center gap-2 break-all">
                      <Mail className="w-4 h-4 text-amethyst flex-shrink-0" />
                      {patient.patientEmail}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Phone</p>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amethyst flex-shrink-0" />
                      {patient.phoneNumber}
                    </p>
                  </div>

                  {/* Last Consultation */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Last Consultation</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amethyst flex-shrink-0" />
                      {new Date(patient.lastDate || patient.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Status</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                      {patient.completedCount ? `${patient.completedCount} Completed` : 'Completed'}
                    </span>
                  </div>
                </div>

                {/* Reason for last visit */}
                {patient.reason && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Last Visit Reason</p>
                    <p className="text-sm text-foreground">{patient.reason}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-card border-purple-glow rounded-xl p-12 text-center shadow-purple">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {patients.length === 0 ? "No Patients Yet" : "No Results Found"}
              </p>
              <p className="text-muted-foreground">
                {patients.length === 0
                  ? "You don't have any completed consultations yet."
                  : "Try adjusting your search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
