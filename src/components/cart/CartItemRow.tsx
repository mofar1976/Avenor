import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ImageOff, Trash2 } from 'lucide-react'
import { ProductQuantity } from '@/components/product/ProductQuantity'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import { formatPrice } from '@/utils/format'
import { useCart } from '@/hooks/cart/use-cart'
import { cartItemKey } from '@/entities/cart/cart'
import type { ResolvedCartItem } from '@/utils/cart/cart-summary'

function CartImage({ url, title }: { url: string | null; title: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex aspect-square items-center justify-center bg-muted/40 p-3">
      {url && !failed ? (
        <img
          src={url}
          alt={title}
          width={160}
          height={160}
          loading="lazy"
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff
          size={24}
          role="img"
          aria-label={title}
          className="text-muted-foreground"
        />
      )}
    </div>
  )
}

export function CartItemRow({ line }: { line: ResolvedCartItem }) {
  const { t } = useTranslation('cart')
  const { t: catalog } = useTranslation('catalog')
  const language = useLanguage()
  const { removeItem, setQuantity } = useCart()
  const { product, item } = line
  const title =
    product?.content[language].title ??
    t('missingProduct', { id: item.productId })
  const key = cartItemKey(item)
  return (
    <li className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-border py-6 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6">
      {product ? (
        <Link
          to={`/${language}/products/${product.id}`}
          aria-label={catalog('viewProduct', { name: title })}
        >
          <CartImage
            key={product.thumbnail}
            url={product.thumbnail}
            title={title}
          />
        </Link>
      ) : (
        <CartImage url={null} title={title} />
      )}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-medium leading-relaxed sm:text-base">
            {product ? (
              <Link
                to={`/${language}/products/${product.id}`}
                className="hover:underline"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-2 size-10 shrink-0"
            onClick={() => removeItem(key)}
            aria-label={t('remove', { name: title })}
          >
            <Trash2 size={16} aria-hidden="true" />
          </Button>
        </div>
        {product && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatPrice(product.price.amountCents, language)} {t('perItem')}
          </p>
        )}
        {!line.available && (
          <p className="mt-4 text-sm text-muted-foreground">
            {t('unavailableItem')}
          </p>
        )}
        {line.available && product && (
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <ProductQuantity
              value={line.quantity}
              maximum={line.maximum}
              onChange={(quantity) => setQuantity(key, quantity, product)}
            />
            <p className="text-sm font-medium">
              {formatPrice(line.totalCents, language)}
            </p>
          </div>
        )}
      </div>
    </li>
  )
}
