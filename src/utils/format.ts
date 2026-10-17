import type { Language } from '@/utils/language'

const locales: Record<Language, string> = { de: 'de-DE', en: 'en-IE' }

// Monetary values are stored in integer cents throughout the shop.
export function formatPrice(cents: number, language: Language) {
  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(locales[language]).format(value)
}
