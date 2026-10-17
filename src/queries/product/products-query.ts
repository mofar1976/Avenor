import { queryOptions } from '@tanstack/react-query'
import { getProducts } from '@/services/products/products'

export const productsQueryOptions = queryOptions({
  // Both translations share one dataset; language and local filters are not keys.
  queryKey: ['catalog', 'products'],
  queryFn: ({ signal }) => getProducts(signal),
  staleTime: 60_000,
  gcTime: 10 * 60_000,
})
