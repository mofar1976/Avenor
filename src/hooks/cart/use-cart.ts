import type { PaymentReceipt } from '@/entities/payment/payment'
import { useCallback, useContext } from 'react'
import type { Product } from '@/entities/product/product'
import type { ProductSelection } from '@/entities/product/product-selection'
import {
  CartDispatchContext,
  CartStateContext,
} from '@/context/cart/cart-context'
import { cartMaximum } from '@/utils/cart/cart-rules'

export function useCart() {
  const state = useContext(CartStateContext)
  const dispatch = useContext(CartDispatchContext)
  if (!state || !dispatch) throw new Error('useCart requires CartProvider')
  const addItem = useCallback(
    (product: Product, selection: ProductSelection) => {
      if (
        selection.productId !== product.id ||
        selection.variantId !== 'default'
      )
        return
      dispatch({ type: 'add', item: selection, maximum: cartMaximum(product) })
    },
    [dispatch],
  )
  const setQuantity = useCallback(
    (key: string, quantity: number, product: Product) => {
      dispatch({
        type: 'quantity',
        key,
        quantity,
        maximum: cartMaximum(product),
      })
    },
    [dispatch],
  )
  const removeItem = useCallback(
    (key: string) => dispatch({ type: 'remove', key }),
    [dispatch],
  )
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [dispatch])
  const settlePayment = useCallback(
    (receipt: PaymentReceipt) =>
      dispatch({
        type: 'settle-payment',
        sessionId: receipt.id,
        items: receipt.items,
      }),
    [dispatch],
  )
  const reconcile = useCallback(
    (products: readonly Product[]) => dispatch({ type: 'reconcile', products }),
    [dispatch],
  )
  return {
    ...state,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    reconcile,
    settlePayment,
  }
}
