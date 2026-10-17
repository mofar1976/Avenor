import {
  productCategories,
  type ProductCategory,
} from '@/entities/product/product'
import type { ProductSort } from '@/utils/catalog/query-products'
import {
  productCollections,
  type ProductCollection,
} from '@/data/catalog/product-collections'

export const catalogSorts: ProductSort[] = [
  'featured',
  'price-asc',
  'price-desc',
  'name-asc',
]
export const catalogPageSize = 12
export type CatalogQuery = {
  collection: ProductCollection | 'all'
  search: string
  category: ProductCategory | 'all'
  sort: ProductSort
  page: number
}

export function readCatalogParams(params: URLSearchParams): CatalogQuery {
  const collection = params.get('collection')
  const category = params.get('category')
  const sort = params.get('sort')
  const page = Number(params.get('page'))
  return {
    collection:
      productCollections.find((value) => value === collection) ?? 'all',
    search: (params.get('q') ?? '').trim(),
    category: productCategories.find((value) => value === category) ?? 'all',
    sort: catalogSorts.find((value) => value === sort) ?? 'featured',
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  }
}

// Copy URLSearchParams: mutating the router's instance would bypass navigation.
export function writeCatalogParams(
  params: URLSearchParams,
  patch: Partial<CatalogQuery> = {},
) {
  const next = new URLSearchParams(params)
  const query = { ...readCatalogParams(params), ...patch }
  for (const key of ['q', 'category', 'sort', 'page', 'collection'])
    next.delete(key)
  if (query.collection !== 'all') next.set('collection', query.collection)
  if (query.search.trim()) next.set('q', query.search.trim())
  if (query.category !== 'all') next.set('category', query.category)
  if (query.sort !== 'featured') next.set('sort', query.sort)
  if (query.page > 1) next.set('page', String(query.page))
  return next
}
