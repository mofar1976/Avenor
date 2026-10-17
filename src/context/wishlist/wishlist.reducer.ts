import type { WishlistState } from '@/entities/wishlist/wishlist'
import { isWishlistProductId } from '@/services/wishlist/wishlist-storage'

export type WishlistAction =
  | { type: 'toggle'; productId: number }
  | { type: 'remove'; productId: number }
  | { type: 'clear' }
  | { type: 'storage'; available: boolean }

export function wishlistReducer(
  state: WishlistState,
  action: WishlistAction,
): WishlistState {
  switch (action.type) {
    case 'toggle':
      if (!isWishlistProductId(action.productId)) return state
      return {
        ...state,
        productIds: state.productIds.includes(action.productId)
          ? state.productIds.filter((id) => id !== action.productId)
          : [...state.productIds, action.productId],
      }
    case 'remove':
      return state.productIds.includes(action.productId)
        ? {
            ...state,
            productIds: state.productIds.filter(
              (id) => id !== action.productId,
            ),
          }
        : state
    case 'clear':
      return { ...state, productIds: [] }
    case 'storage':
      return state.storageAvailable === action.available
        ? state
        : { ...state, storageAvailable: action.available }
  }
}
