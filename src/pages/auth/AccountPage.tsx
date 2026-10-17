import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth/use-auth'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { Button } from '@/components/ui/button'

export function AccountPage() {
  const { t } = useTranslation('auth')
  const language = useLanguage()
  const { session, signOut } = useAuth()
  usePageMetadata(`${t('account')} — AVENOR`, t('description'))
  if (!session)
    return <Navigate replace to={`/${language}/login?redirect=account`} />
  const { user } = session
  return (
    <section className="content-page" aria-labelledby="account-title">
      <p className="eyebrow">AVENOR · {t('demoLabel')}</p>
      <h1 id="account-title" className="text-5xl sm:text-6xl">
        {t('account')}
      </h1>
      <p className="description">{t('welcome', { name: user.firstName })}</p>
      <dl className="my-8 grid max-w-lg gap-5 border-y border-border py-6">
        <div>
          <dt className="text-xs text-muted-foreground">{t('name')}</dt>
          <dd className="mt-1">
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t('username')}</dt>
          <dd className="mt-1">{user.username}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t('email')}</dt>
          <dd className="mt-1 break-all">{user.email}</dd>
        </div>
      </dl>
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {t('accountNotice')}
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <Button onClick={signOut}>{t('logout')}</Button>
        <Link
          to={`/${language}/products`}
          className="underline underline-offset-4"
        >
          {t('continue')}
        </Link>
      </div>
    </section>
  )
}
