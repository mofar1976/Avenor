import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import type { Product } from '@/entities/product/product'
import { useCart } from '@/hooks/cart/use-cart'
import { useLanguage } from '@/hooks/use-language'
import { useStripeCheckout } from '@/hooks/payment/use-stripe-checkout'
import { resolveCartItems, summarizeCart } from '@/utils/cart/cart-summary'
import { orderItems } from '@/utils/checkout/order-summary'
import { Button } from '@/components/ui/button'
import { OrderSummary } from '@/components/checkout/OrderSummary'

type Props = { products: Product[]; reload: () => void }
export function CheckoutForm({ products, reload }: Props) {
  const { t } = useTranslation('checkout')
  const language = useLanguage()
  const { items } = useCart()
  const { start, pending, error } = useStripeCheckout(products)
  const lines = resolveCartItems(items, products)
  const totals = summarizeCart(lines)
  const blocked =
    totals.unavailableCount > 0 ||
    totals.availableCount === 0 ||
    lines.some((line) => line.quantity !== line.item.quantity)
  const errorKey =
    error === 'order-limit'
      ? 'limit'
      : error === 'not-configured'
        ? 'notConfigured'
        : error === 'storage'
          ? 'storage'
          : error === 'quote-changed'
            ? 'changed'
            : 'network'
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <section aria-labelledby="payment-title">
        <h2 id="payment-title" className="font-serif text-2xl">
          {t('payment.title')}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {t('payment.description')}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {t('demoNotice')}
        </p>
      </section>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void start()
        }}
        className="min-w-0 border border-border p-6 sm:p-8"
      >
        <OrderSummary items={orderItems(lines)} totals={totals} />
        {blocked && (
          <p role="alert" className="mt-6 text-sm text-destructive">
            {t('review.blocked')}
          </p>
        )}
        {error && (
          <div role="alert" className="mt-6 text-sm text-destructive">
            <p>{t(`stripe.${errorKey}`)}</p>
            {error === 'quote-changed' && (
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={reload}
              >
                {t('retry')}
              </Button>
            )}
          </div>
        )}
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={blocked || pending}
        >
          {pending && (
            <LoaderCircle
              size={16}
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {t(pending ? 'submitting' : 'submit')}
        </Button>
        <p role="status" className="sr-only">
          {pending ? t('submitting') : ''}
        </p>
        <Link
          to={`/${language}/cart`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs underline underline-offset-4"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t('editCart')}
        </Link>
      </form>
    </div>
  )
}
