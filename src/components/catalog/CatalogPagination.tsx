import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'
import { writeCatalogParams } from '@/utils/catalog/catalog-params'

export function CatalogPagination({
  page,
  pageCount,
}: {
  page: number
  pageCount: number
}) {
  const { t } = useTranslation('catalog')
  const language = useLanguage()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  if (pageCount <= 1) return null
  const href = (value: number) => ({
    pathname,
    search: `?${writeCatalogParams(params, { page: value }).toString()}`,
    hash: '#catalog-results',
  })
  const pages = Array.from(
    { length: pageCount },
    (_, index) => index + 1,
  ).filter(
    (value) =>
      value === 1 || value === pageCount || Math.abs(value - page) <= 1,
  )
  const disabledClass = buttonVariants({
    variant: 'outline',
    size: 'icon',
    className: 'opacity-30',
  })
  return (
    <nav
      aria-label={t('pagination.label')}
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8"
    >
      {page > 1 ? (
        <Link
          to={href(page - 1)}
          aria-label={t('pagination.previous')}
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label={t('pagination.previous')}
          className={disabledClass}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </span>
      )}
      {pages.map((value, index) => (
        <span key={value} className="flex items-center gap-2">
          {index > 0 && value - pages[index - 1]! > 1 && (
            <span className="px-1" aria-hidden="true">
              …
            </span>
          )}
          <Link
            to={href(value)}
            aria-label={t('pagination.goTo', {
              page: formatNumber(value, language),
            })}
            aria-current={value === page ? 'page' : undefined}
            className={buttonVariants({
              variant: value === page ? 'default' : 'ghost',
              size: 'icon',
            })}
          >
            {formatNumber(value, language)}
          </Link>
        </span>
      ))}
      {page < pageCount ? (
        <Link
          to={href(page + 1)}
          aria-label={t('pagination.next')}
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label={t('pagination.next')}
          className={disabledClass}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
