import type { Language } from '@/utils/language'
import type { Product, ProductCategory } from '@/entities/product/product'
import {
  collectionProductIds,
  type ProductCollection,
} from '@/data/catalog/product-collections'

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'name-asc'
export type ProductQuery = {
  collection?: ProductCollection | 'all'
  search?: string
  category?: ProductCategory | 'all'
  sort?: ProductSort
  page?: number
  pageSize?: number
}
const normalize = (value: string, language: Language) =>
  value
    .toLocaleLowerCase(language)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')

export function queryProducts(
  products: readonly Product[],
  query: ProductQuery,
  language: Language,
) {
  const terms = normalize(query.search?.trim() ?? '', language)
    .split(/\s+/)
    .filter(Boolean)
  const filtered = products.filter((product) => {
    if (
      query.collection &&
      query.collection !== 'all' &&
      !collectionProductIds[query.collection].includes(product.id)
    )
      return false
    if (
      query.category &&
      query.category !== 'all' &&
      product.category !== query.category
    )
      return false
    const copy = product.content[language]
    const text = normalize(
      `${copy.title} ${copy.description} ${product.brand ?? ''}`,
      language,
    )
    return terms.every((term) => text.includes(term))
  })
  if (query.sort === 'price-asc')
    filtered.sort(
      (a, b) => a.price.amountCents - b.price.amountCents || a.id - b.id,
    )
  if (query.sort === 'price-desc')
    filtered.sort(
      (a, b) => b.price.amountCents - a.price.amountCents || a.id - b.id,
    )
  if (query.sort === 'name-asc')
    filtered.sort(
      (a, b) =>
        a.content[language].title.localeCompare(
          b.content[language].title,
          language,
        ) || a.id - b.id,
    )
  const pageSize = Number.isFinite(query.pageSize)
    ? Math.max(1, Math.min(48, Math.trunc(query.pageSize!)))
    : 12
  const pageCount = Math.ceil(filtered.length / pageSize)
  const page = Number.isFinite(query.page)
    ? Math.max(1, Math.min(Math.max(1, pageCount), Math.trunc(query.page!)))
    : 1
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
    pageCount,
  }
}
