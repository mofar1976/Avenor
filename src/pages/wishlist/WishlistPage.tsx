import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useProducts } from '@/queries/product/use-products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { formatNumber } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { useWishlist } from '@/hooks/wishlist/use-wishlist'

function WishlistContents() {
  const { t } = useTranslation('wishlist')
  const { productIds, remove } = useWishlist()
  const { products, status, reload } = useProducts()
  if (status === 'loading')
    return (
      <p role="status" className="py-16 text-sm text-muted-foreground">
        {t('loading')}
      </p>
    )
  if (status === 'error')
    return (
      <div role="alert" className="py-12">
        <h2 className="font-medium">{t('errorTitle')}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t('errorDescription')}
        </p>
        <Button variant="outline" className="mt-6" onClick={reload}>
          {t('retry')}
        </Button>
      </div>
    )
  const byId = new Map(products.map((product) => [product.id, product]))
  const saved = productIds.flatMap((id) => {
    const product = byId.get(id)
    return product ? [product] : []
  })
  const missing = productIds.filter((id) => !byId.has(id))
  return (
    <>
      {saved.length > 0 && <ProductGrid products={saved} />}
      {missing.length > 0 && (
        <section
          aria-labelledby="wishlist-unavailable"
          className={
            saved.length > 0 ? 'mt-12 border-t border-border pt-8' : ''
          }
        >
          <h2 id="wishlist-unavailable" className="font-serif text-2xl">
            {t('unavailableTitle')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('unavailableDescription')}
          </p>
          <ul className="mt-5 divide-y divide-border">
            {missing.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <span className="text-sm">{t('missingProduct', { id })}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(id)}
                  aria-label={t('remove', { name: `AV-${id}` })}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

export function WishlistPage() {
  const { t } = useTranslation('wishlist')
  const language = useLanguage()
  const { count, clear } = useWishlist()
  usePageMetadata(`${t('title')} — AVENOR`, t('metaDescription'))
  return (
    <section
      className="content-page catalog-page"
      aria-labelledby="wishlist-title"
    >
      <p className="eyebrow">AVENOR · {t('eyebrow')}</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 id="wishlist-title" className="mb-0 text-5xl sm:text-6xl">
          {t('title')}
        </h1>
        {count > 0 && (
          <Button
            variant="ghost"
            onClick={clear}
            className="px-0 text-xs underline underline-offset-4"
          >
            {t('clear')}
          </Button>
        )}
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mb-8 mt-5 text-sm text-muted-foreground"
      >
        {t('count', { count, formatted: formatNumber(count, language) })}
      </p>
      <div className="border-t border-border pt-8">
        {count > 0 ? (
          <WishlistContents />
        ) : (
          <div className="py-12 text-center">
            <Heart
              size={32}
              className="mx-auto text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="mt-6 font-serif text-3xl">{t('empty.title')}</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('empty.description')}
            </p>
            <Link
              to={`/${language}/products`}
              className={buttonVariants({ className: 'mt-8' })}
            >
              {t('empty.cta')}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
