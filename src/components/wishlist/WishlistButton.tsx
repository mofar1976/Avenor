import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/utils'
import { useWishlist } from '@/hooks/wishlist/use-wishlist'

type Props = {
  productId: number
  productName: string
  variant?: 'icon' | 'text'
  className?: string
}
export function WishlistButton({
  productId,
  productName,
  variant = 'icon',
  className,
}: Props) {
  const { t } = useTranslation('wishlist')
  const { productIds, toggle } = useWishlist()
  const saved = productIds.includes(productId)
  return (
    <Button
      variant="outline"
      size={variant === 'icon' ? 'icon' : 'default'}
      className={cn(
        variant === 'icon'
          ? 'size-11 rounded-full bg-background/95 shadow-sm'
          : 'w-full',
        className,
      )}
      onClick={() => toggle(productId)}
      aria-pressed={saved}
      aria-label={t('toggle', { name: productName })}
      title={t(saved ? 'remove' : 'add', { name: productName })}
    >
      <Heart
        size={18}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      {variant === 'text' && t(saved ? 'saved' : 'save')}
    </Button>
  )
}
