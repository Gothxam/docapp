import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_API_URL || 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  try {
    const raw = localStorage.getItem('token')
    if (!raw) return config

    console.log('Token (raw):', raw)

    let token: string | null = raw
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        token = (parsed.token as string) || (parsed.accessToken as string) || (parsed.jwt as string) || token
      }
    } catch (e) {
      // raw is not JSON; use as-is
    }

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (err) {
    console.error('Error attaching auth token to request', err)
  }
  return config
})

export default api