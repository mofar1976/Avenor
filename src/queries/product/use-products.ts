import { useQuery } from '@tanstack/react-query'
import { productsQueryOptions } from '@/queries/product/products-query'
import type { Product } from '@/entities/product/product'

const emptyProducts: Product[] = []

export function useProducts() {
  const query = useQuery(productsQueryOptions)
  // Background refreshes keep previously loaded products visible.
  const status =
    query.data !== undefined ? 'success' : query.isError ? 'error' : 'loading'

  return {
    status,
    products: query.data ?? emptyProducts,
    reload: () => {
      void query.refetch()
    },
  }
}
