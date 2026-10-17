import { useTranslation } from 'react-i18next'
import { useWishlist } from '@/hooks/wishlist/use-wishlist'

export function WishlistStorageNotice() {
  const { t } = useTranslation('wishlist')
  const { storageAvailable } = useWishlist()
  if (storageAvailable) return null
  return (
    <p
      role="status"
      className="border-b border-border bg-muted/50 px-[var(--page-gutter)] py-3 text-xs leading-relaxed"
    >
      {t('storageWarning')}
    </p>
  )
}
