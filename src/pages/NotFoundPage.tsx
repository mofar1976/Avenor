import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { buttonVariants } from '@/components/ui/button-variants'

export function NotFoundPage() {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <section className="content-page" aria-labelledby="not-found-title">
      <p className="eyebrow">{t('notFound.eyebrow')}</p>
      <h1 id="not-found-title">
        {t('notFound.title')}
        <br />
        <em>{t('notFound.accent')}</em>
      </h1>
      <p className="description">{t('notFound.description')}</p>
      <Link
        className={buttonVariants({ className: 'mt-8' })}
        to={`/${language}`}
      >
        {t('backHome')} <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}
