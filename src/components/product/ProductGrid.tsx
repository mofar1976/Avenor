import type { Product } from '@/entities/product/product'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/utils/utils'

export function ProductGrid({
  products,
  headingLevel = 2,
  className,
}: {
  products: Product[]
  headingLevel?: 2 | 3
  className?: string
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}
