import definitions from '@/data/catalog/curated-products.json'
import type { WishlistState } from '@/entities/wishlist/wishlist'

export const wishlistStorageKey = 'avenor.wishlist'
const knownIds = new Set(definitions.map((product) => product.id))
export function isWishlistProductId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    knownIds.has(value)
  )
}

function parseWishlist(raw: string | null): number[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (
      typeof value !== 'object' ||
      value === null ||
      !('version' in value) ||
      value.version !== 1 ||
      !('productIds' in value) ||
      !Array.isArray(value.productIds)
    )
      return []
    return [...new Set(value.productIds.filter(isWishlistProductId))]
  } catch {
    return []
  }
}

export function readWishlist(): WishlistState {
  try {
    return {
      productIds: parseWishlist(localStorage.getItem(wishlistStorageKey)),
      storageAvailable: true,
    }
  } catch {
    return { productIds: [], storageAvailable: false }
  }
}

export function persistWishlist(productIds: number[]) {
  try {
    localStorage.setItem(
      wishlistStorageKey,
      JSON.stringify({ version: 1, productIds }),
    )
    return true
  } catch {
    return false
  }
}
