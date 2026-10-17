import { useCallback, useContext } from 'react'
import {
  WishlistDispatchContext,
  WishlistStateContext,
} from '@/context/wishlist/wishlist-context'

export function useWishlist() {
  const state = useContext(WishlistStateContext)
  const dispatch = useContext(WishlistDispatchContext)
  if (!state || !dispatch)
    throw new Error('useWishlist requires WishlistProvider')
  const toggle = useCallback(
    (productId: number) => dispatch({ type: 'toggle', productId }),
    [dispatch],
  )
  const remove = useCallback(
    (productId: number) => dispatch({ type: 'remove', productId }),
    [dispatch],
  )
  const clear = useCallback(() => dispatch({ type: 'clear' }), [dispatch])
  return { ...state, count: state.productIds.length, toggle, remove, clear }
}
