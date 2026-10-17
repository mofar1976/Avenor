import { useEffect, useReducer, type ReactNode } from 'react'
import { wishlistReducer } from '@/context/wishlist/wishlist.reducer'
import {
  persistWishlist,
  readWishlist,
} from '@/services/wishlist/wishlist-storage'
import {
  WishlistDispatchContext,
  WishlistStateContext,
} from '@/context/wishlist/wishlist-context'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, undefined, readWishlist)
  useEffect(() => {
    dispatch({ type: 'storage', available: persistWishlist(state.productIds) })
  }, [state.productIds])
  return (
    <WishlistStateContext.Provider value={state}>
      <WishlistDispatchContext.Provider value={dispatch}>
        {children}
      </WishlistDispatchContext.Provider>
    </WishlistStateContext.Provider>
  )
}
