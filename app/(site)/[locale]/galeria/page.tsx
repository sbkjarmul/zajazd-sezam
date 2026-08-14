import { setRequestLocale, getTranslations } from 'next-intl/server'
import { sanityClient } from '@/lib/sanity/client'
import { GALLERY_IMAGES_QUERY, GALLERY_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import { GalleryInfinite } from '@/components/sections/gallery/GalleryInfinite'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

// Rozmiar partii zdjec: pierwsza (SSR) i kolejne (dociagane po scrollu).
const GALLERY_BATCH = 24

// Strona "Galeria" (singleton galleryPage). Naglowek (eyebrow/tytul/wstep) +
// luzna siatka kwadratowych kafli (GalleryGrid, Server Component) owinieta cienka
// warstwa klienta (GalleryLightbox) otwierajaca podglad YARL po kliknieciu.
// Tresc z Sanity; NAP/stopka z siteSettings.

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(GALLERY_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/galeria',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function GaleriaPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, firstImages, settings, t] = await Promise.all([
    sanityClient.fetch(GALLERY_PAGE_QUERY),
    sanityClient.fetch(GALLERY_IMAGES_QUERY, { start: 0, end: GALLERY_BATCH }),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
    getTranslations(),
  ])

  // Brak notFound() gdy nie ma jeszcze dokumentu galleryPage: ta strona jest celem
  // przekierowania 301 ze starego /galeria (Joomla), wiec MUSI zwracac 200 zanim
  // tresc trafi do Studio. Fallback tytulu z messages; pusta galeria pokazuje
  // krotki stan "wkrotce" zamiast 404.
  const logoImage = page?.headerLogo ?? settings?.defaultHeaderLogo ?? undefined
  const images = firstImages ?? []
  const total = page?.total ?? images.length
  // Bez akcentu — czysty tekst. `replace('*')` defensywnie usuwa ewentualne
  // markery z (nieswiezego przez CDN) tytulu, zeby nigdy nie wyswietlic gwiazdek.
  const title = (pickLocale(page?.title, locale) ?? t('gallery.title')).replaceAll('*', '')
  const intro = pickLocale(page?.intro, locale)

  return (
    <>
      {/* Jasne tlo -> header w wariancie light z ciemnym akcentem (spojnie z reszta
          jasnych podstron). Bez nawigacji - na galerii nie powinno jej byc
          (tylko logo + CTA + burger). */}
      <Breadcrumbs locale={locale} pathname="/galeria" />
      <Header logoImage={logoImage} locale={locale} heroTheme="light" lightAccent="dark" />

      <div className="bg-bg min-h-screen">
        {/* pt duzy — przeswit pod fixed headerem (naglowek nie chowa sie pod nim).
            data-header-theme/surface: adaptacyjny header (jak na stronie glownej)
            buduje z tego swoj gradient/tlo przy scrollu — inaczej zostaje
            przezroczysty i tresc przeswituje pod nawigacja. surface = kolor tla
            strony (--color-bg), zeby gradient headera wtapial sie w sekcje. */}
        <section
          data-header-theme="light"
          data-header-surface="#f6f5ef"
          className="layout-container pt-32 pb-16 md:pt-40 md:pb-24"
        >
          <header className="mb-12 max-w-3xl md:mb-16">
            {/* Naglowek: Inter font-normal, leading-[1.1], skala 30->52->60->64,
                tracking -7% (tracking-[-0.07em]). Bez akcentu, bez eyebrow. */}
            <h1 className="text-text text-[30px] leading-[1.1] font-normal tracking-[-0.07em] md:text-[52px] lg:text-[60px] xl:text-[64px]">
              {title}
            </h1>
            {intro && <p className="text-text-muted mt-5 text-base whitespace-pre-line">{intro}</p>}
          </header>

          {images.length > 0 ? (
            // Pierwsza partia z SSR; kolejne dociagane po scrollu (infinite scroll)
            // z /api/gallery. Kafle -> lightbox YARL po kliknieciu.
            <GalleryInfinite
              initialImages={images}
              total={total}
              locale={locale}
              batchSize={GALLERY_BATCH}
            />
          ) : (
            // Pusty dataset (przed wprowadzeniem zdjec w Studio) — stan zamiast 404.
            <p className="text-text-muted text-base">{t('gallery.empty')}</p>
          )}
        </section>

        <Footer
          settings={settings}
          locale={locale}
          brandLabel="Zajazd Sezam"
          logoImage={logoImage}
        />
      </div>
    </>
  )
}
