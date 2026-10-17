import type { ApiProduct } from '@/services/products/product-schema'
import type { Product } from '@/entities/product/product'
import { productCopy, type CuratedProduct } from '@/data/catalog/assortment'

function imageUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'cdn.dummyjson.com'
      ? url.href
      : null
  } catch {
    return null
  }
}

export function mapProduct(
  source: ApiProduct,
  curated: CuratedProduct,
): Product | null {
  const de = productCopy.de[String(source.id)]
  const en = productCopy.en[String(source.id)]
  // IDs alone are insufficient if the public fixture changes underneath us.
  if (
    source.id !== curated.id ||
    source.title !== curated.sourceTitle ||
    source.category !== curated.sourceCategory ||
    !de ||
    !en
  )
    return null
  const images = [
    ...new Set(
      source.images.map(imageUrl).filter((url): url is string => url !== null),
    ),
  ]
  const thumbnail = imageUrl(source.thumbnail) ?? images[0] ?? null
  if (images.length === 0 && thumbnail) images.push(thumbnail)
  return {
    id: source.id,
    category: curated.category,
    content: { de, en },
    brand: source.brand ?? null,
    price: {
      amountCents: Math.round(source.price * 100),
      currency: 'EUR',
      basis: 'demo-eur',
    },
    stock: source.stock,
    rating: source.rating ?? null,
    thumbnail,
    images,
    source: {
      provider: 'dummyjson',
      title: source.title,
      description: source.description,
      category: source.category,
      priceAmount: source.price,
    },
  }
}
