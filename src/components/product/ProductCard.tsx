import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { formatPrice } from '@/utils/format'
import type { Product } from '@/entities/product/product'
import { WishlistButton } from '@/components/wishlist/WishlistButton'

function ProductImage({ product, alt }: { product: Product; alt: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted/40 p-3 sm:p-6">
      {product.thumbnail && !failed ? (
        <img
          src={product.thumbnail}
          alt={alt}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff
          size={32}
          className="text-muted-foreground"
          role="img"
          aria-label={alt}
        />
      )}
    </div>
  )
}

export function ProductCard({
  product,
  headingLevel = 2,
}: {
  product: Product
  headingLevel?: 2 | 3
}) {
  const { t } = useTranslation('catalog')
  const language = useLanguage()
  const copy = product.content[language]
  const { search } = useLocation()
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  return (
    <article className="relative">
      <Link
        to={`/${language}/products/${product.id}${search}`}
        className="group grid gap-4"
        aria-label={t('viewProduct', { name: copy.title })}
      >
        <ProductImage
          key={product.thumbnail}
          product={product}
          alt={copy.title}
        />
        <div>
          <p className="eyebrow text-muted-foreground">
            {t(`categories.${product.category}`)}
          </p>
          <Heading className="mt-2 text-sm font-medium leading-relaxed md:text-base">
            {copy.title}
          </Heading>
          <p className="mt-1 text-sm">
            {formatPrice(product.price.amountCents, language)}
          </p>
          <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground md:block">
            {copy.description}
          </p>
          {product.stock === 0 && (
            <p className="mt-3 text-xs">{t('soldOut')}</p>
          )}
        </div>
      </Link>
      <WishlistButton
        productId={product.id}
        productName={copy.title}
        className="absolute right-2 top-2 sm:right-3 sm:top-3"
      />
    </article>
  )
}
