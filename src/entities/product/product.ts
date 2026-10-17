import type { Language } from '@/utils/language'

export const productCategories = [
  'shirts',
  'dresses',
  'bags',
  'shoes',
  'watches',
  'sunglasses',
  'jewellery',
] as const
export type ProductCategory = (typeof productCategories)[number]
export type ProductCopy = { title: string; description: string }

export type Product = {
  id: number
  category: ProductCategory
  content: Record<Language, ProductCopy>
  brand: string | null
  price: { amountCents: number; currency: 'EUR'; basis: 'demo-eur' }
  stock: number
  rating: number | null
  images: string[]
  thumbnail: string | null
  source: {
    provider: 'dummyjson'
    title: string
    description: string
    category: string
    priceAmount: number
  }
}
