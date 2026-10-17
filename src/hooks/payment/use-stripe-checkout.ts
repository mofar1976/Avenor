import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/entities/product/product'
import { useAuth } from '@/hooks/auth/use-auth'
import { useCart } from '@/hooks/cart/use-cart'
import { useLanguage } from '@/hooks/use-language'
import { createPayment, PaymentError } from '@/services/payment/payments'
import {
  createPaymentAttempt,
  savePaymentAttempt,
} from '@/services/payment/payment-storage'
import { resolveCartItems, summarizeCart } from '@/utils/cart/cart-summary'
import type { PendingPayment } from '@/entities/payment/payment'

export function useStripeCheckout(products: Product[]) {
  const { session, signOut } = useAuth()
  const { items } = useCart()
  const language = useLanguage()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const request = useRef<AbortController | null>(null)
  const attempt = useRef<{ fingerprint: string; value: PendingPayment } | null>(
    null,
  )
  const lock = useRef(false)
  useEffect(
    () => () => {
      request.current?.abort()
    },
    [items, language, session],
  )

  async function start() {
    if (lock.current || !session) return
    lock.current = true
    setPending(true)
    setError(null)
    const controller = new AbortController()
    request.current = controller
    const expiry = window.setTimeout(
      () => {
        controller.abort()
        signOut()
      },
      Math.max(0, session.expiresAt - Date.now()),
    )
    try {
      const lines = resolveCartItems(items, products)
      const totals = summarizeCart(lines)
      if (
        totals.unavailableCount ||
        !totals.availableCount ||
        lines.some((line) => line.quantity !== line.item.quantity)
      )
        throw new PaymentError('quote-changed')
      const requested = lines.map((line) => ({
        productId: line.item.productId,
        variantId: line.item.variantId,
        quantity: line.quantity,
        expectedUnitPriceCents: line.product!.price.amountCents,
      }))
      const fingerprint = JSON.stringify([
        session.user.id,
        language,
        requested,
        totals.totalCents,
      ])
      if (attempt.current?.fingerprint !== fingerprint)
        attempt.current = { fingerprint, value: createPaymentAttempt() }
      const current = attempt.current.value
      // Fail before contacting Stripe if the return capability cannot be retained.
      savePaymentAttempt(current.requestId, current)
      const checkout = await createPayment(
        {
          language,
          items: requested,
          expectedTotalCents: totals.totalCents,
          ...current,
        },
        session.accessToken,
        controller.signal,
      )
      if (controller.signal.aborted) return
      savePaymentAttempt(current.requestId, {
        ...current,
        sessionId: checkout.sessionId,
      })
      savePaymentAttempt(checkout.sessionId, current)
      window.location.assign(checkout.url)
    } catch (failure) {
      if (!controller.signal.aborted) {
        const code = failure instanceof PaymentError ? failure.code : 'network'
        if (code === 'unauthorized') signOut()
        else setError(code)
      }
    } finally {
      window.clearTimeout(expiry)
      lock.current = false
      setPending(false)
    }
  }
  return { start, pending, error }
}
