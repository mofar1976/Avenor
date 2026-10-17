export const productCollections = [
  'new-arrivals',
  'everyday-essentials',
] as const
export type ProductCollection = (typeof productCollections)[number]

// Editorial selections, independent of the upstream fixture's creation dates.
export const collectionProductIds: Record<
  ProductCollection,
  readonly number[]
> = {
  'new-arrivals': [164, 175, 93, 177, 173, 186, 154, 85],
  'everyday-essentials': [164, 86, 175, 176, 93, 154, 158, 188],
}
