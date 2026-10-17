import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui/select'
import { catalogSorts } from '@/utils/catalog/catalog-params'
import type { ProductSort } from '@/utils/catalog/query-products'

export function CatalogSort({
  value,
  onChange,
}: {
  value: ProductSort
  onChange: (value: ProductSort) => void
}) {
  const { t } = useTranslation('catalog')
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs text-muted-foreground">
        {t('sorting.label')}
      </label>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as ProductSort)}
      >
        {catalogSorts.map((sort) => (
          <option key={sort} value={sort}>
            {t(`sorting.${sort}`)}
          </option>
        ))}
      </Select>
    </div>
  )
}
