import {
  maximumCartQuantity,
  shippingFeeCents,
  freeShippingThresholdCents,
  maximumTestSubtotalCents,
} from '../src/entities/order/pricing.ts'
import { z } from 'zod'
import curated from '../src/data/catalog/curated-products.json' with { type: 'json' }
import de from '../src/locales/de/products.json' with { type: 'json' }
import en from '../src/locales/en/products.json' with { type: 'json' }
import { ApiError } from './http.ts'

export const requestedItemSchema = z
  .object({
    productId: z.number().int().positive(),
    variantId: z.literal('default'),
    quantity: z.number().int().min(1).max(maximumCartQuantity),
    expectedUnitPriceCents: z.number().int().nonnegative().safe(),
  })
  .strict()
const sourceSchema = z.object({
  products: z.array(
    z.object({
      id: z.number().int(),
      title: z.string(),
      category: z.string(),
      stock: z.number().int().nonnegative(),
      price: z.number().nonnegative().finite(),
    }),
  ),
  total: z.number().int(),
})

export async function quote(items: z.infer<typeof requestedItemSchema>[]) {
  if (new Set(items.map((item) => item.productId)).size !== items.length)
    throw new ApiError(400, 'invalid-request')
  const response = await fetch(
    'https://dummyjson.com/products?limit=0&select=id,title,category,stock,price',
    { signal: AbortSignal.timeout(15_000) },
  )
  if (!response.ok) throw new ApiError(502, 'catalog-unavailable')
  const source = sourceSchema.safeParse(await response.json())
  if (!source.success || source.data.products.length !== source.data.total)
    throw new ApiError(502, 'catalog-unavailable')
  const lines = items.map((item) => {
    const definition = curated.find((entry) => entry.id === item.productId)
    const product = source.data.products.find(
      (entry) => entry.id === item.productId,
    )
    if (
      !definition ||
      !product ||
      definition.sourceTitle !== product.title ||
      definition.sourceCategory !== product.category ||
      item.quantity > product.stock
    )
      throw new ApiError(409, 'quote-changed')
    const unitPriceCents = Math.round(product.price * 100)
    if (
      !Number.isSafeInteger(unitPriceCents) ||
      unitPriceCents < 50 ||
      unitPriceCents !== item.expectedUnitPriceCents
    )
      throw new ApiError(409, 'quote-changed')
    const title = productTitle(item.productId)
    return {
      productId: item.productId,
      variantId: 'default' as const,
      quantity: item.quantity,
      unitPriceCents,
      title,
    }
  })
  const subtotalCents = lines.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  )
  // Test-mode maximum; no arbitrary high-value sessions from public demo accounts.
  if (
    !Number.isSafeInteger(subtotalCents) ||
    subtotalCents > maximumTestSubtotalCents
  )
    throw new ApiError(400, 'order-limit')
  const shippingCents =
    subtotalCents >= freeShippingThresholdCents ? 0 : shippingFeeCents
  return {
    items: lines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  }
}

export function productTitle(id: number) {
  const deTitle = (de as Record<string, { title: string }>)[String(id)]?.title
  const enTitle = (en as Record<string, { title: string }>)[String(id)]?.title
  if (!deTitle || !enTitle) throw new ApiError(400, 'invalid-request')
  return { de: deTitle, en: enTitle }
}
