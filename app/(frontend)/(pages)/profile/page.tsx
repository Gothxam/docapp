'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileRedirect() {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      router.push('/login')
      return
    }

    const user = JSON.parse(storedUser)
    console.log('User data:', user)
    console.log('User type:', user.role)
    
    // Route based on user type
    if (user.role === 'doctor') {
      console.log('Routing to doctor profile')
      router.push('/profile/doctor')
    } else if (user.role === 'patient') {
      console.log('Routing to patient profile')
      router.push('/profile/patient')
    } else {
      console.log('User type not set, defaulting to patient')
      router.push('/profile/patient')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Loading your profile...</p>
    </div>
  )
}
