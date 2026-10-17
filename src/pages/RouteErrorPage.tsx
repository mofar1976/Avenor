import { useEffect } from 'react'
import {
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from 'react-router-dom'
import { i18n } from '@/app/i18n'
import { languageFromPath } from '@/utils/language'
import { buttonVariants } from '@/components/ui/button-variants'

export function RouteErrorPage() {
  const error = useRouteError()
  const { pathname } = useLocation()
  const language = languageFromPath(pathname) ?? 'en'
  const t = i18n.getFixedT(language, 'common')
  const isNotFound = isRouteErrorResponse(error) && error.status === 404
  useEffect(() => {
    document.documentElement.lang = language
    document.title = `${t(isNotFound ? 'notFound.eyebrow' : 'error.eyebrow')} — AVENOR`
  }, [language, t, isNotFound])
  return (
    <main className="content-page" aria-labelledby="error-title">
      <p className="eyebrow">
        AVENOR · {t(isNotFound ? 'notFound.eyebrow' : 'error.eyebrow')}
      </p>
      <h1 id="error-title">
        {t('error.title')}
        <br />
        <em>{t('error.accent')}</em>
      </h1>
      <p className="description">
        {t(isNotFound ? 'notFound.description' : 'error.description')}
      </p>
      <a
        className={buttonVariants({ className: 'mt-8' })}
        href={`/${language}`}
      >
        {t('backHome')} <span aria-hidden="true">↗</span>
      </a>
    </main>
  )
}
