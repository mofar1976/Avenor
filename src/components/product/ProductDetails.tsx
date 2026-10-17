import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/cart/use-cart'
import { cartMaximum } from '@/utils/cart/cart-rules'
import { WishlistButton } from '@/components/wishlist/WishlistButton'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber, formatPrice } from '@/utils/format'
import type { Product } from '@/entities/product/product'
import { createProductSelection } from '@/entities/product/product-selection'
import { ProductQuantity } from '@/components/product/ProductQuantity'

export function ProductDetails({ product }: { product: Product }) {
  const { t } = useTranslation('product')
  const { t: catalog } = useTranslation('catalog')
  const { t: cart } = useTranslation('cart')
  const { items, addItem, storageAvailable, reconcile } = useCart()
  const [addedCount, setAddedCount] = useState(0)
  useEffect(() => {
    reconcile([product])
  }, [product, reconcile])
  const language = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const inCart =
    items.find(
      (item) => item.productId === product.id && item.variantId === 'default',
    )?.quantity ?? 0
  const remaining = Math.max(0, cartMaximum(product) - inCart)
  const selection =
    remaining > 0
      ? createProductSelection(product, Math.min(quantity, remaining))
      : null
  function addSelection() {
    if (!selection) return
    addItem(product, selection)
    setAddedCount(selection.quantity)
  }
  const copy = product.content[language]
  return (
    <div className="min-w-0 lg:py-6">
      <Link
        to={`/${language}/products?category=${product.category}`}
        className="eyebrow underline-offset-4 hover:underline"
      >
        {catalog(`categories.${product.category}`)}
      </Link>
      <h1
        id="product-title"
        className="my-5 font-serif text-4xl leading-tight sm:text-5xl xl:text-6xl"
      >
        {copy.title}
      </h1>
      {product.brand && (
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      )}
      <p className="mt-6 text-2xl">
        {formatPrice(product.price.amountCents, language)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        <p className="flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${product.stock > 0 ? 'bg-foreground' : 'bg-muted-foreground'}`}
            aria-hidden="true"
          />
          {t(product.stock > 0 ? 'inStock' : 'soldOut')}
        </p>
        {product.rating !== null && (
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Star size={14} aria-hidden="true" />
            <span>
              {t('rating', { value: formatNumber(product.rating, language) })}
            </span>
          </p>
        )}
      </div>
      <p className="mt-8 text-sm leading-loose text-muted-foreground">
        {copy.description}
      </p>
      <div className="mt-8 border-y border-border py-6">
        {remaining > 0 && (
          <ProductQuantity
            value={selection?.quantity ?? 0}
            maximum={remaining}
            onChange={(value) =>
              setQuantity(createProductSelection(product, value)?.quantity ?? 0)
            }
          />
        )}
        {selection && (
          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <span>{t('subtotal')}</span>
            <output
              className="font-medium"
              aria-live="polite"
              aria-label={t('subtotal')}
            >
              {formatPrice(
                product.price.amountCents * selection.quantity,
                language,
              )}
            </output>
          </div>
        )}
      </div>
      <div className="mt-6">
        {inCart > 0 && (
          <p className="mb-3 text-xs text-muted-foreground">
            {cart('inCart', {
              count: inCart,
              formatted: formatNumber(inCart, language),
            })}
          </p>
        )}
        <Button className="w-full" disabled={!selection} onClick={addSelection}>
          <ShoppingBag size={17} aria-hidden="true" />
          {cart(
            product.stock < 1
              ? 'soldOut'
              : remaining === 0
                ? 'limitReached'
                : 'add',
          )}
        </Button>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 text-sm"
        >
          {addedCount > 0 && (
            <p className="flex items-center gap-2">
              <Check size={16} aria-hidden="true" />
              {cart('added', {
                count: addedCount,
                formatted: formatNumber(addedCount, language),
              })}
            </p>
          )}
        </div>
        {inCart > 0 && (
          <Link
            to={`/${language}/cart`}
            className="mt-3 inline-block py-2 text-sm underline underline-offset-4"
          >
            {cart('view')}
          </Link>
        )}
        {!storageAvailable && (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {cart('storageWarning')}
          </p>
        )}
      </div>
      <WishlistButton
        productId={product.id}
        productName={copy.title}
        variant="text"
        className="mt-5"
      />
      <dl className="mt-6 grid gap-4 text-sm">
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">{t('category')}</dt>
          <dd>{catalog(`categories.${product.category}`)}</dd>
        </div>
        {product.brand && (
          <div className="flex justify-between gap-6">
            <dt className="text-muted-foreground">{t('brand')}</dt>
            <dd>{product.brand}</dd>
          </div>
        )}
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">{t('reference')}</dt>
          <dd>AV-{product.id}</dd>
        </div>
      </dl>
      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        {catalog('priceNote')}
      </p>
    </div>
  )
}
