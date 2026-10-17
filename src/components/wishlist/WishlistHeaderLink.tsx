import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'
import { useWishlist } from '@/hooks/wishlist/use-wishlist'

export function WishlistHeaderLink() {
  const { t } = useTranslation('wishlist')
  const language = useLanguage()
  const { count } = useWishlist()
  return (
    <Link
      to={`/${language}/wishlist`}
      className="relative hidden size-11 shrink-0 items-center justify-center hover:bg-muted min-[761px]:inline-flex"
      aria-label={t('header', {
        count,
        formatted: formatNumber(count, language),
      })}
    >
      <Heart size={19} aria-hidden="true" />
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground"
          aria-hidden="true"
        >
          {formatNumber(count, language)}
        </span>
      )}
    </Link>
  )
}
