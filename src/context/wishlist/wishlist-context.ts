import { createContext, type Dispatch } from 'react'
import type { WishlistState } from '@/entities/wishlist/wishlist'
import type { WishlistAction } from '@/context/wishlist/wishlist.reducer'

export const WishlistStateContext = createContext<WishlistState | null>(null)
export const WishlistDispatchContext =
  createContext<Dispatch<WishlistAction> | null>(null)
