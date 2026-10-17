import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber, formatPrice } from '@/utils/format'
import type { OrderItem, OrderTotals } from '@/entities/order/order'

export function OrderSummary({
  items,
  totals,
}: {
  items: OrderItem[]
  totals: OrderTotals
}) {
  const { t } = useTranslation('checkout')
  const language = useLanguage()
  const money = (cents: number) => formatPrice(cents, language)
  return (
    <>
      <h2 className="font-serif text-2xl">{t('summary.title')}</h2>
      <ul className="mt-6 divide-y divide-border">
        {items.map((item) => (
          <li
            key={`${item.productId}:${item.variantId}`}
            className="py-4 text-sm"
          >
            <div className="flex justify-between gap-4">
              <span className="leading-relaxed">{item.title[language]}</span>
              <span className="shrink-0">
                {money(item.unitPriceCents * item.quantity)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('summary.line', {
                quantity: formatNumber(item.quantity, language),
                price: money(item.unitPriceCents),
              })}
            </p>
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid gap-4 border-t border-border pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt>{t('summary.subtotal')}</dt>
          <dd>{money(totals.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>{t('summary.shipping')}</dt>
          <dd>
            {totals.shippingCents === 0
              ? t('summary.free')
              : money(totals.shippingCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-5 text-base font-medium">
          <dt>{t('summary.total')}</dt>
          <dd aria-live="polite" aria-atomic="true">
            {money(totals.totalCents)}
          </dd>
        </div>
      </dl>
    </>
  )
}
