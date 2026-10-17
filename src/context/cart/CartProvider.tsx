import { useEffect, useReducer, type ReactNode } from 'react'
import { cartReducer } from '@/context/cart/cart.reducer'
import { persistCart, readCart } from '@/services/cart/cart-storage'
import {
  CartDispatchContext,
  CartStateContext,
} from '@/context/cart/cart-context'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, readCart)
  useEffect(() => {
    dispatch({
      type: 'storage',
      available: persistCart(state.items, state.settledPaymentIds),
    })
  }, [state.items, state.settledPaymentIds])
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}
