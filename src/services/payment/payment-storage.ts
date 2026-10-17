import type { PendingPayment } from '@/entities/payment/payment'
import { PaymentError } from '@/services/payment/payments'

const prefix = 'avenor.stripe.'
export function createPaymentAttempt(): PendingPayment {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return {
    requestId: crypto.randomUUID(),
    receiptKey: Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join(''),
  }
}
export function savePaymentAttempt(id: string, attempt: PendingPayment) {
  try {
    sessionStorage.setItem(prefix + id, JSON.stringify(attempt))
  } catch {
    throw new PaymentError('storage')
  }
}
export function readPaymentAttempt(id: string): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(prefix + id)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (
      typeof value !== 'object' ||
      !value ||
      !('receiptKey' in value) ||
      !('requestId' in value) ||
      typeof value.receiptKey !== 'string' ||
      !/^[a-f0-9]{64}$/.test(value.receiptKey) ||
      typeof value.requestId !== 'string'
    )
      return null
    return {
      receiptKey: value.receiptKey,
      requestId: value.requestId,
      ...('sessionId' in value &&
      typeof value.sessionId === 'string' &&
      /^cs_test_[a-zA-Z0-9]+$/.test(value.sessionId)
        ? { sessionId: value.sessionId }
        : {}),
    }
  } catch {
    return null
  }
}
