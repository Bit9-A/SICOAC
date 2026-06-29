import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSession, getProfile, signOut as authSignOut, onAuthChange } from '@/lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const session = await getSession()
      if (session?.user) {
        setUser(session.user)
        const prof = await getProfile(session.user.id)
        setProfile(prof)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const sub = onAuthChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        getProfile(session.user.id).then(setProfile)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })
    return () => sub?.data?.subscription?.unsubscribe?.()
  }, [])

  const logout = useCallback(async () => {
    await authSignOut()
    setUser(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const prof = await getProfile(user.id)
      setProfile(prof)
    }
  }, [user])

  const isSuperAdmin = profile?.rol === 'super_admin'
  const isAdmin = profile?.rol === 'admin' || profile?.rol === 'super_admin'
  const isOperator = profile?.rol === 'operador'

  return (
    <AuthContext.Provider value={{
      user, profile, loading, logout, refreshProfile,
      rol: profile?.rol || null,
      isSuperAdmin, isAdmin, isOperator,
      institucionId: profile?.institucion_id || null,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return context
}
