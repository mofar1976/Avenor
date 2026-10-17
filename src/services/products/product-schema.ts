import { z } from 'zod'

export const apiProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  price: z.number().nonnegative().finite(),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5).nullish(),
  brand: z.string().nullish(),
  thumbnail: z.string().nullish(),
  images: z.array(z.string()).default([]),
})

export const apiProductsSchema = z.object({
  products: z.array(apiProductSchema),
  total: z.number().int().nonnegative(),
})
export type ApiProduct = z.infer<typeof apiProductSchema>
