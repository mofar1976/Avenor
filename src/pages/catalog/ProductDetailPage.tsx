import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { usePageMetadata } from '@/hooks/use-page-metadata'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { assortment } from '@/data/catalog/assortment'
import { useProducts } from '@/queries/product/use-products'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductDetails } from '@/components/product/ProductDetails'
import { RelatedProducts } from '@/components/product/RelatedProducts'

function ProductNotFound() {
  const { t } = useTranslation('product')
  const language = useLanguage()
  const { search } = useLocation()
  usePageMetadata(`${t('notFound.title')} — AVENOR`, t('notFound.description'))
  return (
    <section className="content-page" aria-labelledby="missing-product">
      <p className="eyebrow">404 · AVENOR</p>
      <h1 id="missing-product" className="text-4xl sm:text-6xl">
        {t('notFound.title')}
      </h1>
      <p className="description">{t('notFound.description')}</p>
      <Link
        to={`/${language}/products${search}`}
        className={buttonVariants({ className: 'mt-8' })}
      >
        {t('backToCollection')}
      </Link>
    </section>
  )
}

function ProductDetailContent({ productId }: { productId: number }) {
  const { t } = useTranslation('product')
  const { t: common } = useTranslation()
  const { t: catalog } = useTranslation('catalog')
  const language = useLanguage()
  const { search } = useLocation()
  const { status, products, reload } = useProducts()
  const product = products.find((item) => item.id === productId)
  usePageMetadata(
    product
      ? `${product.content[language].title} — AVENOR`
      : `${t(status === 'error' ? 'errorTitle' : status === 'success' ? 'notFound.title' : 'metaTitle')} — AVENOR`,
    product?.content[language].description ??
      t(status === 'success' ? 'notFound.description' : 'metaDescription'),
  )
  if (status === 'success' && !product) return <ProductNotFound />
  return (
    <section
      className="content-page catalog-page"
      aria-labelledby="product-title"
    >
      <Link
        to={`/${language}/products${search}`}
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('backToCollection')}
      </Link>
      {status === 'loading' && (
        <>
          <h1 id="product-title" className="sr-only">
            {t('metaTitle')}
          </h1>
          <p role="status" className="py-16 text-sm text-muted-foreground">
            {t('loading')}
          </p>
        </>
      )}
      {status === 'error' && (
        <div role="alert" className="py-10">
          <h1 id="product-title" className="text-3xl sm:text-4xl">
            {t('errorTitle')}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('errorDescription')}
          </p>
          <Button className="mt-6" variant="outline" onClick={reload}>
            {catalog('retry')}
          </Button>
        </div>
      )}
      {product && status === 'success' && (
        <>
          <nav
            aria-label={t('breadcrumb')}
            className="mb-8 text-xs text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to={`/${language}`} className="hover:underline">
                  {common('nav.home')}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li>
                <Link
                  to={`/${language}/products?category=${product.category}`}
                  className="hover:underline"
                >
                  {catalog(`categories.${product.category}`)}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} />
              </li>
              <li aria-current="page">{product.content[language].title}</li>
            </ol>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <ProductGallery key={product.id} product={product} />
            <ProductDetails key={product.id} product={product} />
          </div>
          <RelatedProducts product={product} products={products} />
        </>
      )}
    </section>
  )
}

export function ProductDetailPage() {
  const { productId = '' } = useParams()
  const id = /^[1-9]\d*$/.test(productId) ? Number(productId) : NaN
  if (
    !Number.isSafeInteger(id) ||
    !assortment.some((product) => product.id === id)
  )
    return <ProductNotFound />
  return <ProductDetailContent productId={id} />
}
