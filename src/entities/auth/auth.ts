export type AuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  expiresAt: number
}

export type LoginValues = { username: string; password: string }
