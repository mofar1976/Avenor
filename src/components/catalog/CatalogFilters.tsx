import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'
import {
  productCategories,
  type ProductCategory,
} from '@/entities/product/product'
import type { CatalogQuery } from '@/utils/catalog/catalog-params'

type Props = {
  category: CatalogQuery['category']
  counts: Record<ProductCategory | 'all', number>
  resultCount: number
  onChange: (category: CatalogQuery['category']) => void
}

export function CatalogFilters({
  category,
  counts,
  resultCount,
  onChange,
}: Props) {
  const { t } = useTranslation('catalog')
  const language = useLanguage()
  const id = useId()
  const [open, setOpen] = useState(false)
  const categories = ['all', ...productCategories] as const
  return (
    <>
      <div className="hidden md:block">
        <label
          htmlFor={id}
          className="mb-2 block text-xs text-muted-foreground"
        >
          {t('filters.category')}
        </label>
        <Select
          id={id}
          value={category}
          onChange={(event) =>
            onChange(event.target.value as CatalogQuery['category'])
          }
        >
          {categories.map((value) => (
            <option key={value} value={value}>
              {t(`categories.${value}`)} (
              {formatNumber(counts[value], language)})
            </option>
          ))}
        </Select>
      </div>
      <div className="md:hidden">
        <Dialog
          variant="panel"
          open={open}
          onOpenChange={setOpen}
          title={t('filters.title')}
          description={t('filters.description')}
          closeLabel={t('filters.close')}
          trigger={
            <Button variant="outline" className="w-full">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {t('filters.title')}
              {category !== 'all' && (
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
              )}
            </Button>
          }
        >
          <fieldset className="grid gap-1">
            <legend className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              {t('filters.category')}
            </legend>
            {categories.map((value) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-border py-3 text-sm"
              >
                <input
                  type="radio"
                  name={`${id}-category`}
                  value={value}
                  checked={category === value}
                  onChange={() => onChange(value)}
                  className="size-4 accent-primary"
                />
                <span>{t(`categories.${value}`)}</span>
                <span className="ml-auto text-muted-foreground">
                  {formatNumber(counts[value], language)}
                </span>
              </label>
            ))}
          </fieldset>
          {category !== 'all' && (
            <Button
              variant="ghost"
              onClick={() => onChange('all')}
              className="mt-4 w-full"
            >
              {t('filters.clearCategory')}
            </Button>
          )}
          <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
            {t('filters.showResults', {
              count: resultCount,
              formatted: formatNumber(resultCount, language),
            })}
          </Button>
        </Dialog>
      </div>
    </>
  )
}
