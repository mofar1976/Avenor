import { z } from 'zod'
import type { AuthSession, LoginValues } from '@/entities/auth/auth'
import { RequestError } from '@/utils/http'

const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})
const loginSchema = z.object({ accessToken: z.string().min(1) })

async function authRequest(
  path: string,
  init: RequestInit,
  signal: AbortSignal,
) {
  const response = await fetch(`https://dummyjson.com/auth/${path}`, {
    ...init,
    credentials: 'omit',
    signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
  })
  if (!response.ok) throw new RequestError('http', response.status)
  return response.json() as Promise<unknown>
}

export async function authenticate(
  values: LoginValues,
  signal: AbortSignal,
): Promise<AuthSession> {
  const payload = await authRequest(
    'login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, expiresInMins: 30 }),
    },
    signal,
  )
  const login = loginSchema.safeParse(payload)
  if (!login.success) throw new RequestError('invalid-data')
  const { accessToken } = login.data
  const profile = await authRequest(
    'me',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    signal,
  )
  const user = userSchema.safeParse(profile)
  if (!user.success) throw new RequestError('invalid-data')
  // The API verifies the token through /me. Decode only its expiry for local UX.
  let expiresAt: number
  try {
    const segment = accessToken.split('.')[1]!
    const claims: unknown = JSON.parse(
      atob(segment.replace(/-/g, '+').replace(/_/g, '/')),
    )
    const expiry = z.object({ exp: z.number().positive() }).parse(claims)
    expiresAt = expiry.exp * 1000
  } catch {
    throw new RequestError('invalid-data')
  }
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now())
    throw new RequestError('invalid-data')
  return { user: user.data, accessToken, expiresAt }
}
