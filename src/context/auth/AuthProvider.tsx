import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthSession } from '@/entities/auth/auth'
import { AuthContext } from '@/context/auth/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const signIn = useCallback((value: AuthSession) => setSession(value), [])
  const signOut = useCallback(() => setSession(null), [])
  useEffect(() => {
    if (!session) return
    const expire = () => {
      if (session.expiresAt <= Date.now()) setSession(null)
    }
    const timer = window.setTimeout(
      expire,
      Math.max(0, session.expiresAt - Date.now()),
    )
    window.addEventListener('focus', expire)
    document.addEventListener('visibilitychange', expire)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', expire)
      document.removeEventListener('visibilitychange', expire)
    }
  }, [session])
  const value = useMemo(
    () => ({ session, signIn, signOut }),
    [session, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
