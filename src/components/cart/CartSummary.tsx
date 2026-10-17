import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { formatPrice } from '@/utils/format'
import { buttonVariants } from '@/components/ui/button-variants'
import {
  freeShippingThresholdCents,
  shippingFeeCents,
} from '@/utils/cart/cart-rules'
import type { summarizeCart } from '@/utils/cart/cart-summary'

export function CartSummary({
  summary,
}: {
  summary: ReturnType<typeof summarizeCart>
}) {
  const { t } = useTranslation('cart')
  const language = useLanguage()
  const money = (value: number) => formatPrice(value, language)
  const remaining = Math.max(
    0,
    freeShippingThresholdCents - summary.subtotalCents,
  )
  return (
    <aside
      className="h-fit border border-border p-6 sm:p-8"
      aria-labelledby="cart-summary-title"
    >
      <h2 id="cart-summary-title" className="font-serif text-2xl">
        {t('summary.title')}
      </h2>
      <dl className="mt-6 grid gap-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt>{t('summary.subtotal')}</dt>
          <dd>{money(summary.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{t('summary.shipping')}</dt>
          <dd>
            {summary.shippingCents === 0
              ? t('summary.free')
              : money(summary.shippingCents)}
          </dd>
        </div>
        <div className="mt-2 flex justify-between gap-4 border-t border-border pt-5 text-base font-medium">
          <dt>{t('summary.total')}</dt>
          <dd aria-live="polite" aria-atomic="true">
            {money(summary.totalCents)}
          </dd>
        </div>
      </dl>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {t('summary.shippingRule', {
          fee: money(shippingFeeCents),
          threshold: money(freeShippingThresholdCents),
        })}
      </p>
      {summary.availableCount > 0 && remaining > 0 && (
        <p className="mt-3 text-xs leading-relaxed">
          {t('summary.remaining', { amount: money(remaining) })}
        </p>
      )}
      {summary.unavailableCount > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t('summary.unavailableNote')}
        </p>
      )}
      {summary.availableCount > 0 && summary.unavailableCount === 0 && (
        <Link
          to={`/${language}/checkout`}
          className={buttonVariants({ className: 'mt-6 w-full' })}
        >
          {t('checkout')}
        </Link>
      )}
      <Link
        to={`/${language}/products`}
        className={buttonVariants({
          variant: 'outline',
          className: 'mt-6 w-full',
        })}
      >
        {t('continueShopping')}
      </Link>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        {t('summary.demo')}
      </p>
    </aside>
  )
}
