export const languages = ['de', 'en'] as const
export type Language = (typeof languages)[number]
export const languageStorageKey = 'avenor.language'

export function isLanguage(value: unknown): value is Language {
  return value === 'de' || value === 'en'
}

export function languageFromPath(pathname: string): Language | undefined {
  const segment = pathname.split('/')[1]
  return isLanguage(segment) ? segment : undefined
}

export function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem(languageStorageKey)
    if (isLanguage(saved)) return saved
  } catch {
    // Language routing still works when browser storage is unavailable.
  }
  for (const locale of navigator.languages) {
    const language = locale.toLowerCase().split('-')[0]
    if (isLanguage(language)) return language
  }
  return 'en'
}

export function rememberLanguage(language: Language) {
  try {
    localStorage.setItem(languageStorageKey, language)
  } catch {
    // Persistence is optional; the URL remains the source of truth.
  }
}

export function localizedPath(pathname: string, language: Language) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const remainder = languageFromPath(normalized)
    ? normalized.slice(3)
    : normalized
  return `/${language}${remainder === '/' ? '' : remainder}`
}
