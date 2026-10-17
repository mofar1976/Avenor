import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { useCart } from '@/hooks/cart/use-cart'
import { getPaymentStatus } from '@/services/payment/payments'
import { readPaymentAttempt } from '@/services/payment/payment-storage'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'

function PaymentReturn({
  sessionId,
  canceled,
}: {
  sessionId: string
  canceled: boolean
}) {
  const { t } = useTranslation('checkout')
  const language = useLanguage()
  const { settlePayment, storageAvailable } = useCart()
  const [attempt] = useState(() => readPaymentAttempt(sessionId))
  const valid = /^cs_test_[a-zA-Z0-9]+$/.test(sessionId) && !!attempt
  const query = useQuery({
    queryKey: ['payments', sessionId],
    queryFn: ({ signal }) =>
      getPaymentStatus(sessionId, attempt!.receiptKey, signal),
    enabled: valid,
    retry: false,
    networkMode: 'always',
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: (query) =>
      !canceled &&
      query.state.data?.status === 'pending' &&
      query.state.dataUpdateCount < 15
        ? 2000
        : false,
  })
  const receipt = query.data?.status === 'paid' ? query.data.receipt : null
  useEffect(() => {
    if (receipt) settlePayment(receipt)
  }, [receipt, settlePayment])
  const state = !valid
    ? 'missing'
    : query.isError
      ? 'error'
      : receipt
        ? 'paid'
        : query.isPending
          ? 'checking'
          : query.data?.status === 'expired'
            ? 'expired'
            : canceled
              ? 'canceled'
              : 'pending'
  usePageMetadata(
    `${t(`stripeReturn.${state}Title`)} — AVENOR`,
    t('stripeReturn.description'),
  )
  return (
    <section className="content-page" aria-labelledby="payment-return-title">
      <p className="eyebrow">AVENOR · Stripe Test</p>
      <h1 id="payment-return-title" className="text-4xl sm:text-6xl">
        {t(`stripeReturn.${state}Title`)}
      </h1>
      <p
        role="status"
        className="max-w-xl text-sm leading-relaxed text-muted-foreground"
      >
        {t(`stripeReturn.${state}`)}
      </p>
      {receipt && (
        <>
          <p className="mt-6 break-all text-xs text-muted-foreground">
            {t('stripeReturn.reference')}: {receipt.id}
          </p>
          <div className="mt-8 max-w-xl border border-border p-6 sm:p-8">
            <OrderSummary items={receipt.items} totals={receipt} />
          </div>
          {!storageAvailable && (
            <p role="status" className="mt-6 text-sm text-destructive">
              {t('stripeReturn.storageWarning')}
            </p>
          )}
        </>
      )}
      {valid && !receipt && (
        <Button
          variant="outline"
          className="mt-6"
          disabled={query.isFetching}
          onClick={() => {
            void query.refetch()
          }}
        >
          {t('retry')}
        </Button>
      )}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to={`/${language}/cart`} className={buttonVariants()}>
          {t('cart')}
        </Link>
        <Link
          to={`/${language}/products`}
          className={buttonVariants({ variant: 'outline' })}
        >
          {t('continueShopping')}
        </Link>
      </div>
    </section>
  )
}

export function PaymentReturnPage() {
  const [params] = useSearchParams()
  const sessionId =
    params.get('session_id') ??
    readPaymentAttempt(params.get('request_id') ?? '')?.sessionId ??
    ''
  return (
    <PaymentReturn
      key={sessionId}
      sessionId={sessionId}
      canceled={params.get('canceled') === '1'}
    />
  )
}
