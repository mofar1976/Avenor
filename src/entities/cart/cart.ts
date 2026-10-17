import type { ProductSelection } from '@/entities/product/product-selection'

export type CartItem = ProductSelection
export type CartState = {
  settledPaymentIds: string[]
  items: CartItem[]
  storageAvailable: boolean
  stockAdjusted: boolean
}

export function cartItemKey(item: Pick<CartItem, 'productId' | 'variantId'>) {
  return `${item.productId}:${item.variantId}`
}
