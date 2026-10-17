import { AuthProvider } from '@/context/auth/AuthProvider'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/app/query-client'
import { router } from '@/app/router'
import { CartProvider } from '@/context/cart/CartProvider'
import { WishlistProvider } from '@/context/wishlist/WishlistProvider'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  )
}
