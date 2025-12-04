"use client"

import { useForm, Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function AppointmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { register, handleSubmit, control } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("reason")}
        placeholder="Reason for visit"
        className="w-full p-2 border rounded"
      />
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select Date and Time"
            className="w-full p-2 border rounded"
          />
        )}
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Confirm Appointment
      </button>
    </form>
  )
}
