import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { queryProducts } from '@/utils/catalog/query-products'
import type { Product } from '@/entities/product/product'
import {
  catalogPageSize,
  readCatalogParams,
  writeCatalogParams,
  type CatalogQuery,
} from '@/utils/catalog/catalog-params'

export function useCatalogQuery(products: readonly Product[], ready: boolean) {
  const language = useLanguage()
  const [params, setParams] = useSearchParams()
  const query = readCatalogParams(params)
  const result = queryProducts(
    products,
    { ...query, pageSize: catalogPageSize },
    language,
  )
  const resolvedPage = ready ? result.page : undefined
  useEffect(() => {
    const next = writeCatalogParams(
      params,
      resolvedPage === undefined ? {} : { page: resolvedPage },
    )
    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true, preventScrollReset: true })
    }
  }, [params, resolvedPage, setParams])

  function update(patch: Partial<Omit<CatalogQuery, 'page'>>) {
    const next = writeCatalogParams(params, { ...patch, page: 1 })
    if (next.toString() !== params.toString())
      setParams(next, { preventScrollReset: true })
  }

  return {
    query,
    result,
    update,
    reset: () =>
      update({
        collection: 'all',
        search: '',
        category: 'all',
        sort: 'featured',
      }),
  }
}
