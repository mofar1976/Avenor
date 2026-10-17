import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { Button } from '@/components/ui/button'

type DialogProps = {
  trigger: ReactNode
  title: string
  description: string
  closeLabel: string
  children: ReactNode
  variant?: 'dialog' | 'panel'
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({
  trigger,
  title,
  description,
  closeLabel,
  children,
  variant = 'dialog',
  contentClassName,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay" />
        <DialogPrimitive.Content
          className={cn(
            'dialog-content',
            variant === 'panel' && 'dialog-panel',
            contentClassName,
          )}
        >
          <DialogPrimitive.Title className="dialog-title">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-8">{children}</div>
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3"
              aria-label={closeLabel}
            >
              <X size={20} aria-hidden="true" />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
