import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useProducts } from '@/queries/product/use-products'
import { queryProducts } from '@/utils/catalog/query-products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'

export function HomeNewArrivals() {
  const { t } = useTranslation('home')
  const language = useLanguage()
  const { products, status, reload } = useProducts()
  const selection = queryProducts(
    products,
    { collection: 'new-arrivals', pageSize: 4 },
    language,
  ).items
  return (
    <section
      id="new-arrivals"
      className="home-container home-section scroll-mt-8"
      aria-labelledby="new-arrivals-title"
    >
      <div className="home-section-heading">
        <div>
          <p className="eyebrow">{t('arrivals.eyebrow')}</p>
          <h2 id="new-arrivals-title" className="home-section-title">
            {t('arrivals.title')}
          </h2>
        </div>
        <Link
          to={`/${language}/products?collection=new-arrivals`}
          className="inline-flex min-h-11 items-center gap-3 text-xs underline underline-offset-4"
        >
          {t('arrivals.cta')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {status === 'loading' && (
        <div aria-busy="true">
          <p role="status" className="mb-5 text-sm text-muted-foreground">
            {t('arrivals.loading')}
          </p>
          <div
            aria-hidden="true"
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {[1, 2, 3, 4].map((key) => (
              <div key={key} className="aspect-square bg-muted/40" />
            ))}
          </div>
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="border-y border-border py-10">
          <p className="text-sm text-muted-foreground">{t('arrivals.error')}</p>
          <Button variant="outline" className="mt-5" onClick={reload}>
            {t('arrivals.retry')}
          </Button>
        </div>
      )}
      {status === 'success' &&
        (selection.length > 0 ? (
          <ProductGrid
            products={selection}
            headingLevel={3}
            className="lg:grid-cols-4"
          />
        ) : (
          <p
            role="status"
            className="border-y border-border py-10 text-sm text-muted-foreground"
          >
            {t('arrivals.empty')}
          </p>
        ))}
    </section>
  )
}
