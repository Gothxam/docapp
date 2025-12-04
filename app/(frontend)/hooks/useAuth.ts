import { useState, useEffect } from 'react'
export function useAuth(){
  const [user, setUser] = useState(null)
  useEffect(()=> {
    const raw = localStorage.getItem('med_user')
    if(raw) setUser(JSON.parse(raw))
  },[])
  const login = (u:any)=> { localStorage.setItem('med_user', JSON.stringify(u)); setUser(u) }
  const logout = ()=> { localStorage.removeItem('med_user'); setUser(null) }
  return {user, login, logout}
}
