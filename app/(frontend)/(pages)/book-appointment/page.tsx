import { Suspense } from "react"
import BookAppointmentClient from "../book-appointment/bookAppointment"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <BookAppointmentClient />
    </Suspense>
  )
}
