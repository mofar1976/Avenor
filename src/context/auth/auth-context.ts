import { createContext } from 'react'
import type { AuthSession } from '@/entities/auth/auth'

type AuthContextValue = {
  session: AuthSession | null
  signIn: (session: AuthSession) => void
  signOut: () => void
}
export const AuthContext = createContext<AuthContextValue | null>(null)
