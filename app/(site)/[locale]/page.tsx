import { setRequestLocale } from 'next-intl/server'
import { sanityClient } from '@/lib/sanity/client'
import { HOMEPAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { EventsBlock } from '@/components/sections/EventsBlock'
import { RestaurantBlock } from '@/components/sections/RestaurantBlock'
import { HotelBlock } from '@/components/sections/HotelBlock'
import { BistroBlock } from '@/components/sections/BistroBlock'
import { Reviews } from '@/components/sections/reviews/Reviews'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { SectionConnector } from '@/components/sections/SectionConnector'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SnapController } from '@/components/SnapController'

// Laczniki miedzy sekcjami (mobile) - gora = kolor sekcji powyzej, dol = kolor
// sekcji ponizej. Nie snapuja (patrz SectionConnector).
const CONNECTOR_IMPREZY_RESTAURACJA =
  'linear-gradient(to bottom, var(--color-light), var(--color-dark-ruby))'
const CONNECTOR_RESTAURACJA_HOTEL =
  'linear-gradient(to bottom, var(--color-dark-ruby), var(--color-dark))'
const CONNECTOR_HOTEL_BISTRO = 'linear-gradient(to bottom, var(--color-dark), var(--color-light))'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [home, settings] = await Promise.all([
    sanityClient.fetch(HOMEPAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/',
    seo: home?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [home, settings] = await Promise.all([
    sanityClient.fetch(HOMEPAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  const logoImage = home?.headerLogo ?? settings?.defaultHeaderLogo ?? undefined

  return (
    <>
      <Header
        heroTheme="dark"
        logoImage={logoImage}
        locale={locale}
        animateIn
        animateInDelay={1.1}
      />
      <SnapController />
      <div className="snap-panels">
        <HeroSection data={home?.hero ?? null} locale={locale} />
        <AboutSection data={home?.aboutSection ?? null} locale={locale} />
        <EventsBlock data={home?.eventsBlock ?? null} locale={locale} />
        <SectionConnector gradient={CONNECTOR_IMPREZY_RESTAURACJA} />
        <RestaurantBlock data={home?.restaurantBlock ?? null} locale={locale} />
        <SectionConnector gradient={CONNECTOR_RESTAURACJA_HOTEL} />
        <HotelBlock data={home?.hotelBlock ?? null} locale={locale} />
        <SectionConnector gradient={CONNECTOR_HOTEL_BISTRO} />
        <BistroBlock data={home?.bistroBlock ?? null} locale={locale} />
        <Reviews data={home?.reviewsBlock ?? null} locale={locale} />
        <ContactBlock data={home?.contactBlock ?? null} settings={settings} locale={locale} />
        <Footer settings={settings} locale={locale} logoImage={logoImage} />
      </div>
    </>
  )
}
