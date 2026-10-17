import type { RouteObject } from 'react-router-dom'
import { LanguageRedirect } from '@/app/LanguageRedirect'
import { i18n, i18nReady } from '@/app/i18n'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { languages, type Language } from '@/utils/language'

async function loadLanguage(language: Language) {
  await i18nReady
  if (i18n.resolvedLanguage !== language) await i18n.changeLanguage(language)
  return null
}

export const routes: RouteObject[] = [
  ...languages.map((language) => ({
    path: `/${language}`,
    element: <SiteLayout />,
    loader: () => loadLanguage(language),
    shouldRevalidate: () => true,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/HomePage')).HomePage,
        }),
      },
      {
        path: 'products',
        lazy: async () => ({
          Component: (await import('@/pages/catalog/CatalogPage')).CatalogPage,
        }),
      },
      {
        path: 'products/:productId',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/catalog/ProductDetailPage'))
            .ProductDetailPage,
        }),
      },
      {
        path: 'cart',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/cart/CartPage')).CartPage,
        }),
      },
      {
        path: 'wishlist',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/wishlist/WishlistPage'))
            .WishlistPage,
        }),
      },
      {
        path: 'checkout',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/checkout/CheckoutPage'))
            .CheckoutPage,
        }),
      },
      {
        path: 'checkout/return',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/checkout/PaymentReturnPage'))
            .PaymentReturnPage,
        }),
      },
      {
        path: 'login',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/auth/LoginPage')).LoginPage,
        }),
      },
      {
        path: 'account',
        handle: { managesMetadata: true },
        lazy: async () => ({
          Component: (await import('@/pages/auth/AccountPage')).AccountPage,
        }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  })),
  {
    path: '*',
    element: <LanguageRedirect />,
    errorElement: <RouteErrorPage />,
  },
]
