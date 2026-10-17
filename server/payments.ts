import { createHash, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import Stripe from 'stripe'
import {
  ApiError,
  appOrigin,
  bodyJson,
  json,
  readBody,
  requireOrigin,
} from './http.ts'
import { productTitle, quote, requestedItemSchema } from './catalog.ts'
import { stripeClient } from './stripe.ts'

const receiptKeySchema = z.string().regex(/^[a-f0-9]{64}$/)
const createSchema = z
  .object({
    language: z.enum(['de', 'en']),
    items: z.array(requestedItemSchema).min(1).max(24),
    expectedTotalCents: z.number().int().positive().safe(),
    requestId: z.uuid(),
    receiptKey: receiptKeySchema,
  })
  .strict()
const statusSchema = z
  .object({
    sessionId: z.string().regex(/^cs_test_[a-zA-Z0-9]+$/),
    receiptKey: receiptKeySchema,
  })
  .strict()
const digest = (key: string) => createHash('sha256').update(key).digest('hex')

async function requireUser(request: Request) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.match(/^Bearer [a-zA-Z0-9._-]{20,4096}$/))
    throw new ApiError(401, 'unauthorized')
  const response = await fetch('https://dummyjson.com/auth/me', {
    headers: { Authorization: authorization },
    signal: AbortSignal.timeout(15_000),
  })
  if (response.status === 401 || response.status === 403)
    throw new ApiError(401, 'unauthorized')
  if (!response.ok) throw new ApiError(502, 'auth-unavailable')
  const result = z
    .object({ id: z.number().int().positive() })
    .safeParse(await response.json())
  if (!result.success) throw new ApiError(502, 'auth-unavailable')
  return result.data.id
}

async function createSession(request: Request) {
  requireOrigin(request)
  const stripe = stripeClient()
  const userId = await requireUser(request)
  const parsed = createSchema.safeParse(await bodyJson(request))
  if (!parsed.success) throw new ApiError(400, 'invalid-request')
  const body = parsed.data
  const order = await quote(body.items)
  if (body.expectedTotalCents !== order.totalCents)
    throw new ApiError(409, 'quote-changed')
  const origin = appOrigin()
  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      adaptive_pricing: { enabled: false },
      allowed_payment_method_types: ['card'],
      locale: body.language,
      client_reference_id: String(userId),
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: item.unitPriceCents,
          product_data: {
            name: item.title[body.language],
            metadata: {
              product_id: String(item.productId),
              variant_id: item.variantId,
            },
          },
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: order.shippingCents, currency: 'eur' },
            display_name:
              body.language === 'de' ? 'Demo-Versand' : 'Demo shipping',
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ['DE', 'AT'] },
      billing_address_collection: 'required',
      success_url: `${origin}/${body.language}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${body.language}/checkout/return?request_id=${body.requestId}&canceled=1`,
      metadata: { app: 'avenor-test', receipt_hash: digest(body.receiptKey) },
    },
    { idempotencyKey: `avenor:${userId}:${body.requestId}` },
  )
  if (session.livemode || !session.url)
    throw new ApiError(502, 'stripe-unavailable')
  return json({ sessionId: session.id, url: session.url })
}

function ensureSession(session: Stripe.Checkout.Session) {
  if (
    session.livemode ||
    session.mode !== 'payment' ||
    session.metadata?.app !== 'avenor-test'
  )
    throw new ApiError(404, 'not-found')
}

// Stripe itself is the durable payment record for this demo. This marker is
// idempotent; it does not dispatch goods, reserve inventory or send emails.
async function recordPayment(stripe: Stripe, session: Stripe.Checkout.Session) {
  ensureSession(session)
  if (session.status !== 'complete' || session.payment_status !== 'paid')
    return false
  if (session.metadata?.avenor_verified !== 'paid')
    await stripe.checkout.sessions.update(session.id, {
      metadata: { avenor_verified: 'paid' },
    })
  return true
}

async function sessionStatus(request: Request) {
  requireOrigin(request)
  const parsed = statusSchema.safeParse(await bodyJson(request))
  if (!parsed.success) throw new ApiError(400, 'invalid-request')
  const stripe = stripeClient()
  const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId)
  ensureSession(session)
  const hash = session.metadata?.receipt_hash
  if (
    !hash ||
    hash.length !== 64 ||
    !timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(digest(parsed.data.receiptKey)),
    )
  )
    throw new ApiError(403, 'forbidden')
  if (!(await recordPayment(stripe, session)))
    return json({
      status: session.status === 'expired' ? 'expired' : 'pending',
    })
  const lines = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  })
  if (lines.has_more || lines.data.length === 0 || session.currency !== 'eur')
    throw new ApiError(502, 'invalid-payment')
  const items = lines.data.map((line) => {
    const product = line.price?.product
    if (
      !product ||
      typeof product === 'string' ||
      product.deleted ||
      line.currency !== 'eur' ||
      line.price?.unit_amount == null ||
      !line.quantity
    )
      throw new ApiError(502, 'invalid-payment')
    const id = Number(product.metadata.product_id)
    return {
      productId: id,
      variantId: 'default' as const,
      quantity: line.quantity,
      unitPriceCents: line.price.unit_amount,
      title: productTitle(id),
    }
  })
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0,
  )
  const shippingCents = session.total_details?.amount_shipping ?? 0
  if (session.amount_total !== subtotalCents + shippingCents)
    throw new ApiError(502, 'invalid-payment')
  return json({
    status: 'paid',
    receipt: {
      id: session.id,
      createdAt: new Date(session.created * 1000).toISOString(),
      items,
      subtotalCents,
      shippingCents,
      totalCents: session.amount_total,
    },
  })
}

async function webhook(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!secret?.startsWith('whsec_')) throw new ApiError(503, 'not-configured')
  if (!signature) throw new ApiError(400, 'invalid-signature')
  const stripe = stripeClient()
  let event: Stripe.Event
  const raw = await readBody(request, 262_144)
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret)
  } catch {
    throw new ApiError(400, 'invalid-signature')
  }
  if (event.livemode) throw new ApiError(400, 'test-mode-only')
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const supplied = event.data.object
    if (supplied.metadata?.app === 'avenor-test') {
      const canonical = await stripe.checkout.sessions.retrieve(supplied.id)
      await recordPayment(stripe, canonical)
    }
  }
  return json({ received: true })
}

export async function handlePayment(request: Request): Promise<Response> {
  try {
    if (request.method !== 'POST')
      return new Response(null, {
        status: 405,
        headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
      })
    const url = new URL(request.url)
    const action =
      url.searchParams.get('action') ?? url.pathname.split('/').pop()
    if (action === 'create') return await createSession(request)
    if (action === 'status') return await sessionStatus(request)
    if (action === 'webhook') return await webhook(request)
    throw new ApiError(404, 'not-found')
  } catch (error) {
    if (error instanceof ApiError)
      return json({ code: error.code }, error.status)
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === 'resource_missing'
    )
      return json({ code: 'not-found' }, 404)
    // Never return SDK errors or log bodies, tokens, addresses or secret keys.
    return json({ code: 'payment-unavailable' }, 502)
  }
}
