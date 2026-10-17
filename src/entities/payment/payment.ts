import type { OrderItem, OrderTotals } from '@/entities/order/order'

export type PaymentReceipt = OrderTotals & {
  id: string
  createdAt: string
  items: OrderItem[]
}
export type CheckoutRequest = {
  language: 'de' | 'en'
  items: {
    productId: number
    variantId: 'default'
    quantity: number
    expectedUnitPriceCents: number
  }[]
  expectedTotalCents: number
  requestId: string
  receiptKey: string
}
export type PendingPayment = {
  sessionId?: string
  requestId: string
  receiptKey: string
}
export type PaymentStatus =
  | { status: 'pending' | 'expired' }
  | { status: 'paid'; receipt: PaymentReceipt }
