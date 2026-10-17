import type { Product } from '@/entities/product/product'
import type { CartItem, CartState } from '@/entities/cart/cart'
import { cartItemKey } from '@/entities/cart/cart'
import { cartMaximum, clampCartQuantity } from '@/utils/cart/cart-rules'

export type CartAction =
  | { type: 'add'; item: CartItem; maximum: number }
  | { type: 'quantity'; key: string; quantity: number; maximum: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'settle-payment'; sessionId: string; items: CartItem[] }
  | { type: 'reconcile'; products: readonly Product[] }
  | { type: 'storage'; available: boolean }

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      if (
        action.maximum < 1 ||
        !Number.isSafeInteger(action.item.quantity) ||
        action.item.quantity < 1
      )
        return state
      const key = cartItemKey(action.item)
      const existing = state.items.find((item) => cartItemKey(item) === key)
      const quantity = clampCartQuantity(
        (existing?.quantity ?? 0) + action.item.quantity,
        action.maximum,
      )
      const item = { ...action.item, quantity }
      return {
        ...state,
        items: existing
          ? state.items.map((entry) =>
              cartItemKey(entry) === key ? item : entry,
            )
          : [...state.items, item],
      }
    }
    case 'quantity': {
      if (action.maximum < 1) return state
      const quantity = clampCartQuantity(action.quantity, action.maximum)
      return {
        ...state,
        items: state.items.map((item) =>
          cartItemKey(item) === action.key ? { ...item, quantity } : item,
        ),
      }
    }
    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => cartItemKey(item) !== action.key),
      }
    case 'settle-payment': {
      if (state.settledPaymentIds.includes(action.sessionId)) return state
      const paid = new Map(
        action.items.map((item) => [cartItemKey(item), item.quantity]),
      )
      return {
        ...state,
        settledPaymentIds: [...state.settledPaymentIds, action.sessionId],
        items: state.items.flatMap((item) => {
          const quantity = item.quantity - (paid.get(cartItemKey(item)) ?? 0)
          return quantity > 0 ? [{ ...item, quantity }] : []
        }),
      }
    }
    case 'clear':
      return { ...state, items: [], stockAdjusted: false }
    case 'storage':
      return state.storageAvailable === action.available
        ? state
        : { ...state, storageAvailable: action.available }
    case 'reconcile': {
      const byId = new Map(
        action.products.map((product) => [product.id, product]),
      )
      let changed = false
      const items = state.items.map((item) => {
        const product = byId.get(item.productId)
        // Keep unavailable products visible so the user can remove them explicitly.
        if (!product || cartMaximum(product) < 1) return item
        const quantity = clampCartQuantity(item.quantity, cartMaximum(product))
        if (quantity === item.quantity) return item
        changed = true
        return { ...item, quantity }
      })
      return changed ? { ...state, items, stockAdjusted: true } : state
    }
  }
}
