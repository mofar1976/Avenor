import type { ComponentProps } from 'react'
import { cn } from '@/utils/utils'

export function Input({
  className,
  type = 'text',
  ...props
}: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex min-h-12 w-full border border-border bg-background px-4 py-3 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}
