import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'
import { useCart } from '@/hooks/cart/use-cart'

export function CartHeaderLink() {
  const { t } = useTranslation('cart')
  const language = useLanguage()
  const { itemCount } = useCart()
  return (
    <Link
      to={`/${language}/cart`}
      className="relative inline-flex size-11 shrink-0 items-center justify-center hover:bg-muted"
      aria-label={t('header', {
        count: itemCount,
        formatted: formatNumber(itemCount, language),
      })}
    >
      <ShoppingBag size={19} aria-hidden="true" />
      {itemCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground"
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : formatNumber(itemCount, language)}
        </span>
      )}
    </Link>
  )
}
