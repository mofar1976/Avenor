import { z } from 'zod'
import type { CheckoutRequest, PaymentStatus } from '@/entities/payment/payment'

export class PaymentError extends Error {
  readonly code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}
async function post(
  action: string,
  body: unknown,
  signal: AbortSignal,
  token?: string,
) {
  const response = await fetch(`/api/payments/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.any([signal, AbortSignal.timeout(60_000)]),
  })
  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new PaymentError('network')
  }
  if (!response.ok) {
    const error = z.object({ code: z.string() }).safeParse(payload)
    throw new PaymentError(error.success ? error.data.code : 'network')
  }
  return payload
}

export async function createPayment(
  body: CheckoutRequest,
  token: string,
  signal: AbortSignal,
) {
  const result = z
    .object({
      sessionId: z.string().regex(/^cs_test_[a-zA-Z0-9]+$/),
      url: z.url(),
    })
    .parse(await post('create', body, signal, token))
  const url = new URL(result.url)
  if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com')
    throw new PaymentError('network')
  return result
}

const cents = z.number().int().nonnegative().safe()
const receiptSchema = z
  .object({
    id: z.string().regex(/^cs_test_[a-zA-Z0-9]+$/),
    createdAt: z.iso.datetime(),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          variantId: z.literal('default'),
          quantity: z.number().int().min(1).max(99),
          unitPriceCents: cents,
          title: z.object({ de: z.string(), en: z.string() }),
        }),
      )
      .min(1)
      .max(24),
    subtotalCents: cents,
    shippingCents: cents,
    totalCents: cents,
  })
  .refine(
    (receipt) =>
      receipt.subtotalCents ===
        receipt.items.reduce(
          (sum, item) => sum + item.quantity * item.unitPriceCents,
          0,
        ) &&
      receipt.totalCents === receipt.subtotalCents + receipt.shippingCents,
  )
const statusSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('pending') }),
  z.object({ status: z.literal('expired') }),
  z.object({ status: z.literal('paid'), receipt: receiptSchema }),
])
export async function getPaymentStatus(
  sessionId: string,
  receiptKey: string,
  signal: AbortSignal,
): Promise<PaymentStatus> {
  const result = statusSchema.parse(
    await post('status', { sessionId, receiptKey }, signal),
  )
  if (result.status === 'paid' && result.receipt.id !== sessionId)
    throw new PaymentError('network')
  return result
}
