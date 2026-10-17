import Stripe from 'stripe'
import { ApiError } from './http.ts'

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key?.startsWith('sk_test_')) throw new ApiError(503, 'not-configured')
  return new Stripe(key, { maxNetworkRetries: 1, timeout: 15_000 })
}
