import { useId, type ComponentProps } from 'react'
import { Input } from '@/components/ui/input'

type FormFieldProps = ComponentProps<typeof Input> & {
  label: string
  hint?: string
  error?: string
}

export function FormField({
  label,
  hint,
  error,
  id,
  ...props
}: FormFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const description =
    [
      hint ? `${inputId}-hint` : '',
      error ? `${inputId}-error` : '',
      props['aria-describedby'],
    ]
      .filter(Boolean)
      .join(' ') || undefined
  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <Input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error) || props['aria-invalid']}
        aria-describedby={description}
      />
      {hint && (
        <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}
