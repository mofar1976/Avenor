import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageOff } from 'lucide-react'
import { cn } from '@/utils/utils'

export function EditorialImage({
  className,
  alt,
  loading = 'lazy',
  ...props
}: ComponentProps<'img'>) {
  const { t } = useTranslation('home')
  const [failed, setFailed] = useState(false)
  if (failed)
    return (
      <div className="flex size-full min-h-40 items-center justify-center gap-3 bg-muted text-sm text-muted-foreground">
        <ImageOff size={20} aria-hidden="true" />
        <span>{t('imageUnavailable')}</span>
      </div>
    )
  return (
    <img
      {...props}
      alt={alt}
      loading={loading}
      decoding="async"
      className={cn('size-full object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}
