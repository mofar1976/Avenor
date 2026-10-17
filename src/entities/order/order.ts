export type OrderItem = {
  productId: number
  variantId: 'default'
  quantity: number
  unitPriceCents: number
  title: { de: string; en: string }
}
export type OrderTotals = {
  subtotalCents: number
  shippingCents: number
  totalCents: number
}
