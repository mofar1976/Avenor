import definitions from '@/data/catalog/curated-products.json'
import deCopy from '@/locales/de/products.json'
import enCopy from '@/locales/en/products.json'
import type { ProductCategory, ProductCopy } from '@/entities/product/product'

export type CuratedProduct = {
  id: number
  category: ProductCategory
  sourceCategory: string
  sourceTitle: string
}

export const assortment = definitions as CuratedProduct[]
export const productCopy: Record<'de' | 'en', Record<string, ProductCopy>> = {
  de: deCopy,
  en: enCopy,
}
