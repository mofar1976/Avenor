import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CatalogQuery } from '@/utils/catalog/catalog-params'

type Props = {
  query: CatalogQuery
  onChange: (patch: Partial<CatalogQuery>) => void
  onReset: () => void
}
export function ActiveCatalogFilters({ query, onChange, onReset }: Props) {
  const { t } = useTranslation('catalog')
  if (
    !query.search &&
    query.category === 'all' &&
    query.sort === 'featured' &&
    query.collection === 'all'
  )
    return null
  const filters = [
    ...(query.collection !== 'all'
      ? [
          {
            label: t(`collections.${query.collection}`),
            remove: () => onChange({ collection: 'all' }),
          },
        ]
      : []),
    ...(query.search
      ? [
          {
            label: t('active.search', { value: query.search }),
            remove: () => onChange({ search: '' }),
          },
        ]
      : []),
    ...(query.category !== 'all'
      ? [
          {
            label: t(`categories.${query.category}`),
            remove: () => onChange({ category: 'all' }),
          },
        ]
      : []),
    ...(query.sort !== 'featured'
      ? [
          {
            label: t(`sorting.${query.sort}`),
            remove: () => onChange({ sort: 'featured' }),
          },
        ]
      : []),
  ]
  return (
    <div
      className="mt-5 flex flex-wrap items-center gap-2"
      role="group"
      aria-label={t('active.label')}
    >
      {filters.map((filter) => (
        <Button
          key={filter.label}
          variant="outline"
          onClick={filter.remove}
          aria-label={t('active.remove', { value: filter.label })}
          className="min-h-10 max-w-full gap-2 px-3 py-2 text-xs"
        >
          <span className="truncate">{filter.label}</span>
          <X size={13} className="shrink-0" aria-hidden="true" />
        </Button>
      ))}
      <Button
        variant="ghost"
        className="min-h-10 px-3 py-2 text-xs underline underline-offset-4"
        onClick={onReset}
      >
        {t('filters.reset')}
      </Button>
    </div>
  )
}
