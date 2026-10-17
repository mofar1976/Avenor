import { useTranslation } from 'react-i18next'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeCategories } from '@/components/home/HomeCategories'
import { HomeNewArrivals } from '@/components/home/HomeNewArrivals'
import { HomeEditorial } from '@/components/home/HomeEditorial'

export function HomePage() {
  const { t } = useTranslation('home')
  return (
    <>
      <HomeHero />
      <div className="home-container">
        <ul className="grid gap-4 border-y border-border py-6 text-center text-xs tracking-wide sm:grid-cols-3 sm:text-left">
          <li>{t('perspective.shapes')}</li>
          <li className="sm:text-center">{t('perspective.details')}</li>
          <li className="sm:text-right">{t('perspective.style')}</li>
        </ul>
      </div>
      <HomeCategories />
      <HomeNewArrivals />
      <HomeEditorial />
      <section
        className="home-container pb-20 pt-4 text-center sm:pb-28"
        aria-labelledby="home-closing"
      >
        <p className="eyebrow">AVENOR</p>
        <h2 id="home-closing" className="mt-5 font-serif text-3xl sm:text-4xl">
          {t('closing')}
        </h2>
      </section>
    </>
  )
}
