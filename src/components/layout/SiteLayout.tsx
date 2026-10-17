import { AccountHeaderLink } from '@/components/auth/AccountHeaderLink'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
} from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { rememberLanguage } from '@/utils/language'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { CartHeaderLink } from '@/components/cart/CartHeaderLink'
import { WishlistHeaderLink } from '@/components/wishlist/WishlistHeaderLink'
import { WishlistStorageNotice } from '@/components/wishlist/WishlistStorageNotice'

export function SiteLayout() {
  const { t } = useTranslation()
  const language = useLanguage()
  const { pathname } = useLocation()
  const matches = useMatches()
  const managesMetadata = matches.some(
    (match) =>
      (match.handle as { managesMetadata?: boolean } | undefined)
        ?.managesMetadata,
  )

  useEffect(() => {
    document.documentElement.lang = language
    rememberLanguage(language)
    if (managesMetadata) return
    const page = pathname.replace(`/${language}`, '').replace(/\/$/, '')
    document.title = t(
      `meta.${page === '' ? 'home' : page === '/products' ? 'catalog' : 'notFound'}`,
    )
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  }, [language, pathname, t, managesMetadata])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {t('skip')}
      </a>
      <header className="site-header">
        <Link
          className="wordmark"
          to={`/${language}`}
          aria-label={t('brandHome')}
        >
          AVENOR
        </Link>
        <nav className="desktop-navigation" aria-label={t('nav.label')}>
          <NavLink to={`/${language}`} end>
            {t('nav.home')}
          </NavLink>
          <NavLink to={`/${language}/products`}>{t('nav.collection')}</NavLink>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <AccountHeaderLink />
          <WishlistHeaderLink />
          <CartHeaderLink />
          <MobileNavigation key={pathname} />
        </div>
      </header>
      <WishlistStorageNotice />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <Link
          className="wordmark wordmark-small"
          to={`/${language}`}
          aria-label={t('brandHome')}
        >
          AVENOR
        </Link>
        <p>Everyday, considered.</p>
        <span>{t('demo')}</span>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
