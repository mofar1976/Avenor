import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, ImageOff, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/utils/format'
import { cn } from '@/utils/utils'
import type { Product } from '@/entities/product/product'

export function ProductGallery({ product }: { product: Product }) {
  const { t } = useTranslation('product')
  const language = useLanguage()
  const hintId = useId()
  const title = product.content[language].title
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [failed, setFailed] = useState<string[]>([])
  const images = (
    product.images.length
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : []
  ).filter((url) => !failed.includes(url))
  const active = images.find((url) => url === selected) ?? images[0]
  const index = active ? images.indexOf(active) : 0
  const position = t('gallery.position', {
    current: formatNumber(index + 1, language),
    total: formatNumber(images.length, language),
  })
  function fail(url: string) {
    setFailed((previous) =>
      previous.includes(url) ? previous : [...previous, url],
    )
  }
  function move(direction: number) {
    if (images.length > 1)
      setSelected(images[(index + direction + images.length) % images.length])
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }
  const controls =
    images.length > 1 ? (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => move(-1)}
          aria-label={t('gallery.previous')}
          className="bg-background"
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => move(1)}
          aria-label={t('gallery.next')}
          className="bg-background"
        >
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    ) : null
  return (
    <section
      aria-label={t('gallery.label')}
      aria-describedby={hintId}
      onKeyDown={keyboard}
      className="min-w-0"
    >
      <p id={hintId} className="sr-only">
        {t('gallery.keyboard')}
      </p>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted/40 p-6 sm:p-10 lg:aspect-4/5">
        {active ? (
          <img
            key={active}
            src={active}
            alt={title}
            width={960}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-contain"
            onError={() => fail(active)}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
            <ImageOff size={40} aria-hidden="true" />
            <p>{t('gallery.unavailable')}</p>
          </div>
        )}
        {active && (
          <div className="absolute right-3 top-3">
            <Dialog
              title={title}
              description={t('gallery.zoomDescription')}
              closeLabel={t('gallery.close')}
              contentClassName="w-[min(94vw,1000px)]"
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t('gallery.zoom')}
                  className="bg-background"
                >
                  <Maximize2 size={18} aria-hidden="true" />
                </Button>
              }
            >
              <img
                key={active}
                src={active}
                alt={title}
                width={1200}
                height={1200}
                className="mx-auto max-h-[60svh] w-full object-contain"
                onError={() => fail(active)}
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground" role="status">
                  {position}
                </p>
                {controls}
              </div>
            </Dialog>
          </div>
        )}
      </div>
      {active && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p
            className="text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {position}
          </p>
          {controls}
        </div>
      )}
      {images.length > 1 && (
        <div
          className="mt-4 flex gap-3 overflow-x-auto p-1"
          role="group"
          aria-label={t('gallery.thumbnails')}
        >
          {images.map((url, imageIndex) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(url)}
              aria-label={t('gallery.select', {
                number: formatNumber(imageIndex + 1, language),
              })}
              aria-pressed={url === active}
              className={cn(
                'flex size-20 shrink-0 items-center justify-center border bg-muted/30 p-2 transition-colors',
                url === active
                  ? 'border-foreground'
                  : 'border-transparent hover:border-border',
              )}
            >
              <img
                src={url}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                className="size-full object-contain"
                onError={() => fail(url)}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
