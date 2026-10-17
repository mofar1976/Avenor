import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'

type Props = {
  value: number
  maximum: number
  onChange: (value: number) => void
}
export function ProductQuantity({ value, maximum, onChange }: Props) {
  const { t } = useTranslation('product')
  const language = useLanguage()
  const id = useId()
  const [draft, setDraft] = useState<string | null>(null)
  const draftNumber = draft === null ? value : Number(draft)
  const invalid =
    draft !== null &&
    (draft === '' ||
      !Number.isInteger(draftNumber) ||
      draftNumber < 1 ||
      draftNumber > maximum)
  function commit() {
    onChange(Number(draft ?? value))
    setDraft(null)
  }
  return (
    <div>
      <label htmlFor={id} className="mb-3 block text-sm">
        {t('quantity.label')}
      </label>
      <div className="inline-flex items-center border border-border">
        <Button
          variant="ghost"
          size="icon"
          disabled={value <= 1 || maximum < 1}
          onClick={() => onChange(value - 1)}
          aria-label={t('quantity.decrease')}
        >
          <Minus size={16} aria-hidden="true" />
        </Button>
        <Input
          id={id}
          type="number"
          min={maximum > 0 ? 1 : 0}
          max={maximum}
          step={1}
          inputMode="numeric"
          disabled={maximum < 1}
          value={draft ?? value}
          onFocus={() => setDraft(String(value))}
          onChange={(event) => {
            const text = event.target.value
            const number = event.target.valueAsNumber
            setDraft(text)
            if (Number.isInteger(number) && number >= 1 && number <= maximum)
              onChange(number)
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.currentTarget.blur()
            }
          }}
          aria-invalid={invalid}
          aria-describedby={`${id}-hint`}
          className="w-16 border-0 px-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          variant="ghost"
          size="icon"
          disabled={value >= maximum || maximum < 1}
          onClick={() => onChange(value + 1)}
          aria-label={t('quantity.increase')}
        >
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
      <p id={`${id}-hint`} className="mt-2 text-xs text-muted-foreground">
        {t('quantity.maximum', {
          count: maximum,
          formatted: formatNumber(maximum, language),
        })}
      </p>
    </div>
  )
}
