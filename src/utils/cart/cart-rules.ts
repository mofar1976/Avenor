import type { Product } from '@/entities/product/product'

import { maximumCartQuantity } from '@/entities/order/pricing'
export {
  maximumCartQuantity,
  shippingFeeCents,
  freeShippingThresholdCents,
} from '@/entities/order/pricing'

export function cartMaximum(product: Pick<Product, 'stock'>) {
  return Math.max(0, Math.min(maximumCartQuantity, Math.trunc(product.stock)))
}

export function clampCartQuantity(quantity: number, maximum: number) {
  return Math.max(
    1,
    Math.min(maximum, Number.isFinite(quantity) ? Math.trunc(quantity) : 1),
  )
}
