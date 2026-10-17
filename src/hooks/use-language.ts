import { useLocation } from 'react-router-dom'
import { languageFromPath } from '@/utils/language'

export function useLanguage() {
  const { pathname } = useLocation()
  return languageFromPath(pathname) ?? 'en'
}
