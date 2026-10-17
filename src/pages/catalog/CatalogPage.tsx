import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/utils/format'
import { useLanguage } from '@/hooks/use-language'
import { ProductGrid } from '@/components/product/ProductGrid'
import { CatalogSearch } from '@/components/catalog/CatalogSearch'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { CatalogSort } from '@/components/catalog/CatalogSort'
import { ActiveCatalogFilters } from '@/components/catalog/ActiveCatalogFilters'
import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { useProducts } from '@/queries/product/use-products'
import { collectionProductIds } from '@/data/catalog/product-collections'
import { useCatalogQuery } from '@/hooks/catalog/use-catalog-query'
import {
  productCategories,
  type ProductCategory,
} from '@/entities/product/product'

export function CatalogPage() {
  const { t } = useTranslation('catalog')
  const language = useLanguage()
  const { status, products, reload } = useProducts()
  const { query, result, update, reset } = useCatalogQuery(
    products,
    status === 'success',
  )
  const collectionIds =
    query.collection === 'all' ? null : collectionProductIds[query.collection]
  const collectionProducts = collectionIds
    ? products.filter((product) => collectionIds.includes(product.id))
    : products
  const counts = Object.fromEntries([
    ['all', collectionProducts.length],
    ...productCategories.map((category) => [
      category,
      collectionProducts.filter((product) => product.category === category)
        .length,
    ]),
  ]) as Record<ProductCategory | 'all', number>
  const format = (value: number) => formatNumber(value, language)

  return (
    <section
      className="content-page catalog-page"
      aria-labelledby="catalog-title"
    >
      <p className="eyebrow">
        {query.collection === 'all'
          ? t('eyebrow')
          : t(`collections.${query.collection}`)}
      </p>
      <h1 id="catalog-title">
        {t('title')}
        <br />
        <em>{t('accent')}</em>
      </h1>
      <p className="description">{t('description')}</p>
      <div
        className="mt-12 border-t border-border pt-8"
        aria-busy={status === 'loading'}
      >
        {status === 'loading' && (
          <p role="status" className="py-12 text-sm text-muted-foreground">
            {t('loading')}
          </p>
        )}
        {status === 'error' && (
          <div role="alert" className="py-8">
            <h2 className="font-medium">{t('errorTitle')}</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('errorDescription')}
            </p>
            <Button className="mt-6" variant="outline" onClick={reload}>
              {t('retry')}
            </Button>
          </div>
        )}
        {status === 'success' && products.length === 0 && (
          <p role="status" className="py-12 text-sm text-muted-foreground">
            {t('empty')}
          </p>
        )}
        {status === 'success' && products.length > 0 && (
          <>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <CatalogSearch
                key={query.search}
                initialValue={query.search}
                onSearch={(search) => update({ search })}
              />
              <div className="grid grid-cols-2 items-end gap-3 md:gap-4 lg:min-w-96">
                <CatalogFilters
                  category={query.category}
                  counts={counts}
                  resultCount={result.total}
                  onChange={(category) => update({ category })}
                />
                <CatalogSort
                  value={query.sort}
                  onChange={(sort) => update({ sort })}
                />
              </div>
            </div>
            <ActiveCatalogFilters
              query={query}
              onChange={update}
              onReset={reset}
            />
            <div
              id="catalog-results"
              tabIndex={-1}
              className="mt-8 scroll-mt-6 border-t border-border pt-6"
            >
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mb-6 text-xs text-muted-foreground"
              >
                {result.total > 0
                  ? t('results.range', {
                      start: format((result.page - 1) * result.pageSize + 1),
                      end: format(
                        Math.min(result.page * result.pageSize, result.total),
                      ),
                      total: format(result.total),
                    })
                  : t('results.zero')}
              </p>
              {result.items.length > 0 ? (
                <ProductGrid products={result.items} />
              ) : (
                <div className="py-16 text-center">
                  <h2 className="font-serif text-3xl">
                    {t('results.emptyTitle')}
                  </h2>
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {t('results.emptyDescription')}
                  </p>
                  <Button variant="outline" className="mt-6" onClick={reset}>
                    {t('filters.reset')}
                  </Button>
                </div>
              )}
              <CatalogPagination
                page={result.page}
                pageCount={result.pageCount}
              />
            </div>
            <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
              {t('priceNote')}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
