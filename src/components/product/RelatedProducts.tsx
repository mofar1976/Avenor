import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import type { Product } from '@/entities/product/product'
import { ProductGrid } from '@/components/product/ProductGrid'

export function RelatedProducts({
  product,
  products,
}: {
  product: Product
  products: Product[]
}) {
  const { t } = useTranslation('product')
  const language = useLanguage()
  const sameCategory = products.filter(
    (candidate) =>
      candidate.id !== product.id && candidate.category === product.category,
  )
  const related = [
    ...sameCategory,
    ...products.filter(
      (candidate) =>
        candidate.id !== product.id && candidate.category !== product.category,
    ),
  ].slice(0, 4)
  if (related.length === 0) return null
  return (
    <section
      aria-labelledby="related-title"
      className="mt-20 border-t border-border pt-10"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 id="related-title" className="font-serif text-3xl sm:text-4xl">
          {t('related')}
        </h2>
        <Link
          to={`/${language}/products?category=${product.category}`}
          className="text-sm underline underline-offset-4"
        >
          {t('moreInCategory')}
        </Link>
      </div>
      <ProductGrid products={related} headingLevel={3} />
    </section>
  )
}
