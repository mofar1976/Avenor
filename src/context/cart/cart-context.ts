import { createContext, type Dispatch } from 'react'
import type { CartState } from '@/entities/cart/cart'
import type { CartAction } from '@/context/cart/cart.reducer'

export const CartStateContext = createContext<CartState | null>(null)
export const CartDispatchContext = createContext<Dispatch<CartAction> | null>(
  null,
)
