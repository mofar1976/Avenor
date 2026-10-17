import definitions from '@/data/catalog/curated-products.json'
import type { CartItem, CartState } from '@/entities/cart/cart'
import { cartItemKey } from '@/entities/cart/cart'
import { maximumCartQuantity } from '@/utils/cart/cart-rules'

export const cartStorageKey = 'avenor.cart'
const knownIds = new Set(definitions.map((product) => product.id))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return []
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return []
  }
  if (
    !isRecord(value) ||
    (value.version !== 1 && value.version !== 2) ||
    !Array.isArray(value.items)
  )
    return []
  const items = new Map<string, CartItem>()
  for (const item of value.items) {
    if (
      !isRecord(item) ||
      typeof item.productId !== 'number' ||
      !knownIds.has(item.productId) ||
      item.variantId !== 'default' ||
      typeof item.quantity !== 'number' ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    )
      continue
    const candidate: CartItem = {
      productId: item.productId,
      variantId: 'default',
      quantity: Math.min(maximumCartQuantity, item.quantity),
    }
    const key = cartItemKey(candidate)
    const existing = items.get(key)
    items.set(key, {
      ...candidate,
      quantity: Math.min(
        maximumCartQuantity,
        (existing?.quantity ?? 0) + candidate.quantity,
      ),
    })
  }
  return [...items.values()]
}

function settledIds(raw: string | null): string[] {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null
    if (
      !isRecord(value) ||
      value.version !== 2 ||
      !Array.isArray(value.settledPaymentIds)
    )
      return []
    return [
      ...new Set(
        value.settledPaymentIds.filter(
          (id): id is string =>
            typeof id === 'string' && /^cs_test_[a-zA-Z0-9]+$/.test(id),
        ),
      ),
    ]
  } catch {
    return []
  }
}

export function readCart(): CartState {
  try {
    const raw = localStorage.getItem(cartStorageKey)
    return {
      settledPaymentIds: settledIds(raw),
      items: parseCart(raw),
      storageAvailable: true,
      stockAdjusted: false,
    }
  } catch {
    return {
      items: [],
      settledPaymentIds: [],
      storageAvailable: false,
      stockAdjusted: false,
    }
  }
}

export function persistCart(items: CartItem[], settledPaymentIds: string[]) {
  try {
    localStorage.setItem(
      cartStorageKey,
      JSON.stringify({ version: 2, items, settledPaymentIds }),
    )
    return true
  } catch {
    return false
  }
}
