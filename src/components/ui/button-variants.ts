import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/85',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
      },
      size: { default: '', icon: 'size-12 shrink-0 p-0' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
