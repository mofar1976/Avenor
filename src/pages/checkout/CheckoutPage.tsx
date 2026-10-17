import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'
import { useProducts } from '@/queries/product/use-products'
import { useCart } from '@/hooks/cart/use-cart'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { useAuth } from '@/hooks/auth/use-auth'

function CheckoutContents() {
  const { t } = useTranslation('checkout')
  const { products, status, reload } = useProducts()
  if (status === 'loading')
    return (
      <p role="status" className="py-16 text-sm text-muted-foreground">
        {t('loading')}
      </p>
    )
  if (status === 'error')
    return (
      <div role="alert" className="py-10">
        <h2 className="font-medium">{t('loadError')}</h2>
        <Button variant="outline" className="mt-5" onClick={reload}>
          {t('retry')}
        </Button>
      </div>
    )
  return <CheckoutForm products={products} reload={reload} />
}

function AuthenticatedCheckoutPage() {
  const { t } = useTranslation('checkout')
  const language = useLanguage()
  const { items } = useCart()
  usePageMetadata(`${t('title')} — AVENOR`, t('metaDescription'))
  return (
    <section
      className="content-page catalog-page"
      aria-labelledby="checkout-title"
    >
      <p className="eyebrow">AVENOR · {t('eyebrow')}</p>
      <h1 id="checkout-title" className="text-5xl sm:text-6xl">
        {t('title')}
      </h1>
      <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {t('intro')}
      </p>
      {items.length > 0 ? (
        <CheckoutContents />
      ) : (
        <div className="border-t border-border py-12">
          <h2 className="font-serif text-3xl">{t('empty.title')}</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('empty.description')}
          </p>
          <Link
            to={`/${language}/products`}
            className={buttonVariants({ className: 'mt-6' })}
          >
            {t('empty.cta')}
          </Link>
        </div>
      )}
    </section>
  )
}

export function CheckoutPage() {
  const { session } = useAuth()
  const language = useLanguage()
  if (!session)
    return <Navigate replace to={`/${language}/login?redirect=checkout`} />
  return <AuthenticatedCheckoutPage />
}
