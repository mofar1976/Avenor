import { getJson, RequestError } from '@/utils/http'
import { assortment } from '@/data/catalog/assortment'
import type { Product } from '@/entities/product/product'
import { apiProductsSchema } from '@/services/products/product-schema'
import { mapProduct } from '@/services/products/map-product'

const fields =
  'id,title,description,category,price,stock,rating,brand,thumbnail,images'
export const productsUrl = `https://dummyjson.com/products?limit=0&select=${fields}`

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const payload = await getJson(productsUrl, signal)
  const result = apiProductsSchema.safeParse(payload)
  // Local filtering and pagination require a complete source dataset.
  if (!result.success || result.data.products.length !== result.data.total)
    throw new RequestError('invalid-data')
  const byId = new Map(
    result.data.products.map((product) => [product.id, product]),
  )
  return assortment.flatMap((definition) => {
    const source = byId.get(definition.id)
    if (!source) return []
    const product = mapProduct(source, definition)
    return product ? [product] : []
  })
}
