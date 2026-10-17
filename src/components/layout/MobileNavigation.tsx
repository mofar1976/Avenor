import { useAuth } from '@/hooks/auth/use-auth'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

export function MobileNavigation() {
  const { session } = useAuth()
  const { t: authT } = useTranslation('auth')
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <div className="mobile-navigation">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        variant="panel"
        title={t('nav.menuTitle')}
        description={t('nav.menuDescription')}
        closeLabel={t('nav.close')}
        trigger={
          <Button variant="ghost" size="icon" aria-label={t('nav.menu')}>
            <Menu size={21} aria-hidden="true" />
          </Button>
        }
      >
        <nav className="mobile-links" aria-label={t('nav.label')}>
          <NavLink to={`/${language}`} end onClick={() => setOpen(false)}>
            {t('nav.home')}
          </NavLink>
          <NavLink to={`/${language}/products`} onClick={() => setOpen(false)}>
            {t('nav.collection')}
          </NavLink>
          <NavLink to={`/${language}/wishlist`} onClick={() => setOpen(false)}>
            {t('nav.wishlist')}
          </NavLink>
          <NavLink to={`/${language}/cart`} onClick={() => setOpen(false)}>
            {t('nav.cart')}
          </NavLink>
          <NavLink
            to={`/${language}/${session ? 'account' : 'login'}`}
            onClick={() => setOpen(false)}
          >
            {authT(session ? 'account' : 'login')}
          </NavLink>
        </nav>
      </Dialog>
    </div>
  )
}
