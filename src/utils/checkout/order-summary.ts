import type { ResolvedCartItem } from '@/utils/cart/cart-summary'
import type { OrderItem } from '@/entities/order/order'

export function orderItems(lines: ResolvedCartItem[]): OrderItem[] {
  return lines.flatMap((line) =>
    line.available && line.product
      ? [
          {
            productId: line.product.id,
            variantId: line.item.variantId,
            quantity: line.quantity,
            unitPriceCents: line.product.price.amountCents,
            title: {
              de: line.product.content.de.title,
              en: line.product.content.en.title,
            },
          },
        ]
      : [],
  )
}
