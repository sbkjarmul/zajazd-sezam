import { setRequestLocale, getTranslations } from 'next-intl/server'
import { sanityClient } from '@/lib/sanity/client'
import { GALLERY_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import { GalleryGrid } from '@/components/sections/gallery/GalleryGrid'
import { GalleryLightbox } from '@/components/sections/gallery/GalleryLightbox'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

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

  const [page, settings, t] = await Promise.all([
    sanityClient.fetch(GALLERY_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
    getTranslations(),
  ])

  // Brak notFound() gdy nie ma jeszcze dokumentu galleryPage: ta strona jest celem
  // przekierowania 301 ze starego /galeria (Joomla), wiec MUSI zwracac 200 zanim
  // tresc trafi do Studio. Fallback tytulu z messages; pusta galeria pokazuje
  // krotki stan "wkrotce" zamiast 404.
  const logoImage = page?.headerLogo ?? settings?.defaultHeaderLogo ?? undefined
  const images = page?.images ?? []
  const eyebrow = pickLocale(page?.eyebrow, locale)
  const title = pickLocale(page?.title, locale) ?? t('gallery.title')
  const intro = pickLocale(page?.intro, locale)

  return (
    <>
      {/* Jasne tlo -> header w wariancie light z ciemnym akcentem (spojnie z reszta
          jasnych podstron). Wlasna nawigacja podstrony (skroty do glownych sekcji). */}
      <Header
        logoImage={logoImage}
        locale={locale}
        heroTheme="light"
        lightAccent="dark"
        nav={[
          { label: locale === 'pl' ? 'Hotel' : 'Hotel', href: '/hotel' },
          { label: locale === 'pl' ? 'Restauracja' : 'Restaurant', href: '/restauracja' },
          { label: locale === 'pl' ? 'Imprezy' : 'Events', href: '/imprezy-okolicznosciowe' },
          { label: locale === 'pl' ? 'Kontakt' : 'Contact', href: '/kontakt' },
        ]}
      />

      <div className="bg-bg min-h-screen">
        {/* pt duzy — przeswit pod fixed headerem (naglowek nie chowa sie pod nim). */}
        <section className="layout-container pt-32 pb-16 md:pt-40 md:pb-24">
          <header className="mb-12 max-w-3xl md:mb-16">
            {eyebrow && (
              <p className="text-accent mb-4 text-sm font-medium tracking-[0.2em] uppercase">
                {eyebrow}
              </p>
            )}
            <h1 className="text-text text-4xl font-medium tracking-tight md:text-6xl">{title}</h1>
            {intro && <p className="text-text-muted mt-5 text-base whitespace-pre-line">{intro}</p>}
          </header>

          {images.length > 0 ? (
            // Kafle = Server Component (zero JS na layout); GalleryLightbox owija je
            // i deleguje klik do leniwie ladowanego lightboxa (YARL).
            <GalleryLightbox images={images} locale={locale}>
              <GalleryGrid images={images} locale={locale} />
            </GalleryLightbox>
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
