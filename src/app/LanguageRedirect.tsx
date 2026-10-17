import { Navigate, useLocation } from 'react-router-dom'
import { detectLanguage, localizedPath } from '@/utils/language'

export function LanguageRedirect() {
  const { pathname, search, hash } = useLocation()
  return (
    <Navigate
      replace
      to={`${localizedPath(pathname, detectLanguage())}${search}${hash}`}
    />
  )
}
