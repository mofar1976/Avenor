import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { EditorialImage } from '@/components/home/EditorialImage'

export function HomeEditorial() {
  const { t } = useTranslation('home')
  const language = useLanguage()
  return (
    <section
      className="home-container home-section"
      aria-labelledby="home-editorial-title"
    >
      <div className="grid overflow-hidden bg-muted/50 lg:grid-cols-[1.2fr_1fr]">
        <div className="aspect-3/2 min-w-0 lg:aspect-auto">
          <EditorialImage
            src="/images/home/avenor-editorial-1536.jpg"
            srcSet="/images/home/avenor-editorial-768.jpg 768w, /images/home/avenor-editorial-1536.jpg 1536w"
            sizes="(max-width: 1023px) 90vw, 55vw"
            width={1536}
            height={1024}
            alt={t('editorial.imageAlt')}
          />
        </div>
        <div className="flex flex-col items-start justify-center px-7 py-12 sm:px-12 lg:py-20">
          <p className="eyebrow">{t('editorial.eyebrow')}</p>
          <h2
            id="home-editorial-title"
            className="mt-5 font-serif text-4xl leading-tight sm:text-5xl"
          >
            {t('editorial.title')}
            <br />
            <em>{t('editorial.accent')}</em>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-loose text-muted-foreground">
            {t('editorial.description')}
          </p>
          <Link
            to={`/${language}/products?collection=everyday-essentials`}
            className="mt-7 inline-flex min-h-11 items-center gap-5 border-b border-foreground py-2 text-xs"
          >
            {t('editorial.cta')}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
