import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { languages, localizedPath } from '@/utils/language'
import { useLanguage } from '@/hooks/use-language'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const language = useLanguage()
  const { pathname, search, hash } = useLocation()
  return (
    <nav className="language-switcher" aria-label={t('language')}>
      {languages.map((target) => (
        <Link
          key={target}
          lang={target}
          hrefLang={target}
          to={`${localizedPath(pathname, target)}${search}${hash}`}
          aria-label={target === 'de' ? 'Deutsch' : 'English'}
          aria-current={language === target ? 'true' : undefined}
          preventScrollReset
        >
          {target.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}
