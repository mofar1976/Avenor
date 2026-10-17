import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import deCommon from '@/locales/de/common.json'
import deHome from '@/locales/de/home.json'
import deCatalog from '@/locales/de/catalog.json'
import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enCatalog from '@/locales/en/catalog.json'
import deProduct from '@/locales/de/product.json'
import enProduct from '@/locales/en/product.json'
import deCart from '@/locales/de/cart.json'
import enCart from '@/locales/en/cart.json'
import deWishlist from '@/locales/de/wishlist.json'
import enWishlist from '@/locales/en/wishlist.json'
import deCheckout from '@/locales/de/checkout.json'
import enCheckout from '@/locales/en/checkout.json'

import deAuth from '@/locales/de/auth.json'
import enAuth from '@/locales/en/auth.json'

export const i18n = createInstance()
export const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    de: {
      auth: deAuth,
      common: deCommon,
      home: deHome,
      catalog: deCatalog,
      product: deProduct,
      cart: deCart,
      wishlist: deWishlist,
      checkout: deCheckout,
    },
    en: {
      auth: enAuth,
      common: enCommon,
      home: enHome,
      catalog: enCatalog,
      product: enProduct,
      cart: enCart,
      wishlist: enWishlist,
      checkout: enCheckout,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['de', 'en'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})
