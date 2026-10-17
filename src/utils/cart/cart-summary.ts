import type { Product } from '@/entities/product/product'
import type { CartItem } from '@/entities/cart/cart'
import {
  cartMaximum,
  freeShippingThresholdCents,
  shippingFeeCents,
} from '@/utils/cart/cart-rules'

export type ResolvedCartItem = {
  item: CartItem
  product: Product | null
  maximum: number
  quantity: number
  available: boolean
  totalCents: number
}

export function resolveCartItems(
  items: CartItem[],
  products: Product[],
): ResolvedCartItem[] {
  const byId = new Map(products.map((product) => [product.id, product]))
  return items.map((item) => {
    const product = byId.get(item.productId) ?? null
    const maximum = product ? cartMaximum(product) : 0
    const quantity = Math.min(item.quantity, maximum)
    return {
      item,
      product,
      maximum,
      quantity,
      available: quantity > 0,
      totalCents: product ? product.price.amountCents * quantity : 0,
    }
  })
}

export function summarizeCart(items: ResolvedCartItem[]) {
  const available = items.filter((item) => item.available)
  const subtotalCents = available.reduce(
    (sum, item) => sum + item.totalCents,
    0,
  )
  const shippingCents =
    available.length === 0 || subtotalCents >= freeShippingThresholdCents
      ? 0
      : shippingFeeCents
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    availableCount: available.reduce((sum, item) => sum + item.quantity, 0),
    unavailableCount: items.length - available.length,
  }
}
