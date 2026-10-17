import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CatalogSearch({
  initialValue,
  onSearch,
}: {
  initialValue: string
  onSearch: (value: string) => void
}) {
  const { t } = useTranslation('catalog')
  const id = useId()
  const [value, setValue] = useState(initialValue)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(value)
  }
  return (
    <form
      role="search"
      aria-label={t('search.label')}
      onSubmit={submit}
      className="w-full md:max-w-lg"
    >
      <label htmlFor={id} className="sr-only">
        {t('search.label')}
      </label>
      <div className="flex">
        <Input
          id={id}
          name="q"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t('search.placeholder')}
          className="min-w-0 border-r-0"
          autoComplete="off"
        />
        <Button type="submit" size="icon" aria-label={t('search.submit')}>
          <Search size={18} aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
