import { setRequestLocale } from 'next-intl/server'
import { sanityClient } from '@/lib/sanity/client'
import { HOMEPAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ServicesIntro } from '@/components/sections/ServicesIntro'
import { EventsBlock } from '@/components/sections/EventsBlock'
import { RestaurantBlock } from '@/components/sections/RestaurantBlock'
import { HotelBlock } from '@/components/sections/HotelBlock'
import { BistroBlock } from '@/components/sections/BistroBlock'
import { ReviewsBlock } from '@/components/sections/ReviewsBlock'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

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
      <Header logoImage={logoImage} locale={locale} />
      <HeroSection data={home?.hero ?? null} locale={locale} />
      <AboutSection data={home?.aboutSection ?? null} locale={locale} />
      <ServicesIntro data={home?.servicesIntro ?? null} locale={locale} />
      <EventsBlock data={home?.eventsBlock ?? null} locale={locale} />
      <RestaurantBlock data={home?.restaurantBlock ?? null} locale={locale} />
      <HotelBlock data={home?.hotelBlock ?? null} locale={locale} />
      <BistroBlock data={home?.bistroBlock ?? null} locale={locale} />
      <ReviewsBlock data={home?.reviewsBlock ?? null} locale={locale} />
      <ContactBlock data={home?.contactBlock ?? null} settings={settings} locale={locale} />
      <Footer settings={settings} locale={locale} logoImage={logoImage} />
    </>
  )
}
