import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { EditorialImage } from '@/components/home/EditorialImage'

const categories = ['dresses', 'bags', 'shoes', 'watches'] as const
export function HomeCategories() {
  const { t } = useTranslation('home')
  const { t: catalog } = useTranslation('catalog')
  const language = useLanguage()
  return (
    <section
      className="home-container home-section"
      aria-labelledby="home-categories-title"
    >
      <div className="home-section-heading">
        <div>
          <p className="eyebrow">{t('categories.eyebrow')}</p>
          <h2 id="home-categories-title" className="home-section-title">
            {t('categories.title')}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {t('categories.description')}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {categories.map((category, index) => (
          <li key={category}>
            <Link
              to={`/${language}/products?category=${category}`}
              className="group block"
            >
              <div className="aspect-4/5 overflow-hidden bg-muted/40 p-5 sm:p-10">
                <EditorialImage
                  src={`/images/home/category-${category}.webp`}
                  alt=""
                  width={1000}
                  height={1000}
                  className="object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <h3 className="font-serif text-xl sm:text-2xl">
                  {catalog(`categories.${category}`)}
                </h3>
                <ArrowUpRight size={17} aria-hidden="true" />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                0{index + 1} / {t('categories.explore')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
