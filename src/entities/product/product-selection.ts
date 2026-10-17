import type { Product } from '@/entities/product/product'

// The current assortment has one default variant per product, no invented options.
export type ProductSelection = {
  productId: number
  variantId: 'default'
  quantity: number
}

export function createProductSelection(
  product: Product,
  requestedQuantity: number,
): ProductSelection | null {
  if (product.stock < 1) return null
  const quantity = Number.isFinite(requestedQuantity)
    ? Math.trunc(requestedQuantity)
    : 1
  return {
    productId: product.id,
    variantId: 'default',
    quantity: Math.max(1, Math.min(product.stock, quantity)),
  }
}
