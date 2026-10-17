import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { buttonVariants } from '@/components/ui/button-variants'
import { EditorialImage } from '@/components/home/EditorialImage'

export function HomeHero() {
  const { t } = useTranslation('home')
  const language = useLanguage()
  return (
    <section className="home-hero home-container" aria-labelledby="home-title">
      <div className="home-hero-copy">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1 id="home-title">
          {t('title')}
          <br />
          <em>{t('accent')}</em>
        </h1>
        <p className="description">{t('description')}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link to={`/${language}/products`} className={buttonVariants()}>
            {t('cta')}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="#new-arrivals"
            className="inline-flex min-h-11 items-center text-xs underline underline-offset-4"
          >
            {t('hero.secondary')}
          </a>
        </div>
        <p className="mt-12 max-w-xs border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
          {t('hero.note')}
        </p>
      </div>
      <figure className="min-w-0">
        <div className="aspect-4/5 overflow-hidden bg-muted">
          <EditorialImage
            src="/images/home/avenor-campaign-1122.jpg"
            srcSet="/images/home/avenor-campaign-640.jpg 640w, /images/home/avenor-campaign-1122.jpg 1122w"
            sizes="(max-width: 767px) 90vw, (max-width: 1600px) 48vw, 720px"
            width={1122}
            height={1402}
            alt={t('hero.imageAlt')}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <figcaption className="mt-3 flex justify-between gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>{t('hero.caption')}</span>
          <span>01 / AVENOR</span>
        </figcaption>
      </figure>
    </section>
  )
}
