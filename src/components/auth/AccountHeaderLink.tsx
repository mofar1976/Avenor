import { UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/auth/use-auth'
import { useLanguage } from '@/hooks/use-language'
import { buttonVariants } from '@/components/ui/button-variants'

export function AccountHeaderLink() {
  const { session } = useAuth()
  const language = useLanguage()
  const { t } = useTranslation('auth')
  return (
    <Link
      to={`/${language}/${session ? 'account' : 'login'}`}
      aria-label={t(session ? 'account' : 'login')}
      className={buttonVariants({
        variant: 'ghost',
        size: 'icon',
        className: 'hidden min-[761px]:inline-flex',
      })}
    >
      <UserRound size={20} aria-hidden="true" />
    </Link>
  )
}
