import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { formatNumber } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { useProducts } from '@/queries/product/use-products'
import { useCart } from '@/hooks/cart/use-cart'
import { cartItemKey } from '@/entities/cart/cart'
import { resolveCartItems, summarizeCart } from '@/utils/cart/cart-summary'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { CartSummary } from '@/components/cart/CartSummary'

function CartContents() {
  const { t } = useTranslation('cart')
  const { items, stockAdjusted, reconcile } = useCart()
  const { products, status, reload } = useProducts()
  useEffect(() => {
    if (status === 'success') reconcile(products)
  }, [products, status, reconcile])
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
        <p className="mt-3 text-sm text-muted-foreground">
          {t('errorDescription')}
        </p>
        <Button variant="outline" className="mt-6" onClick={reload}>
          {t('retry')}
        </Button>
      </div>
    )
  const lines = resolveCartItems(items, products)
  const summary = summarizeCart(lines)
  return (
    <>
      {stockAdjusted && (
        <p
          role="status"
          className="mb-6 bg-muted/50 p-4 text-sm leading-relaxed"
        >
          {t('stockAdjusted')}
        </p>
      )}
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
        <ul className="border-t border-border">
          {lines.map((line) => (
            <CartItemRow key={cartItemKey(line.item)} line={line} />
          ))}
        </ul>
        <CartSummary summary={summary} />
      </div>
    </>
  )
}

export function CartPage() {
  const { t } = useTranslation('cart')
  const language = useLanguage()
  const { items, itemCount, clearCart, storageAvailable } = useCart()
  usePageMetadata(`${t('title')} — AVENOR`, t('metaDescription'))
  return (
    <section className="content-page catalog-page" aria-labelledby="cart-title">
      <p className="eyebrow">AVENOR · {t('eyebrow')}</p>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 id="cart-title" className="mb-0 text-5xl sm:text-6xl">
          {t('title')}
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            className="px-0 text-xs underline underline-offset-4"
            onClick={clearCart}
          >
            {t('clear')}
          </Button>
        )}
      </div>
      {!storageAvailable && (
        <p
          role="status"
          className="mb-6 bg-muted/50 p-4 text-sm leading-relaxed"
        >
          {t('storageWarning')}
        </p>
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {t('header', {
          count: itemCount,
          formatted: formatNumber(itemCount, language),
        })}
      </p>
      {items.length > 0 ? (
        <CartContents />
      ) : (
        <div className="border-t border-border py-16 text-center">
          <ShoppingBag
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
    </section>
  )
}
