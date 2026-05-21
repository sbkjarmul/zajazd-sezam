import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { EVENTS_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { EventsHero } from '@/components/sections/events/EventsHero'
import { EventsPromise } from '@/components/sections/events/EventsPromise'
import { EventTypesCarousel } from '@/components/sections/events/EventTypesCarousel'
import { EventsHalls } from '@/components/sections/events/EventsHalls'
import { EventsHotelUpsell } from '@/components/sections/events/EventsHotelUpsell'
import { EventsCatering } from '@/components/sections/events/EventsCatering'
import { EventsReviews } from '@/components/sections/events/EventsReviews'
import { EventsSteps } from '@/components/sections/events/EventsSteps'
import { EventsReservationCta } from '@/components/sections/events/EventsReservationCta'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(EVENTS_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/imprezy-okolicznosciowe',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function EventsPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, settings] = await Promise.all([
    sanityClient.fetch(EVENTS_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined

  return (
    <>
      <Header logoImage={logoImage} locale={locale} />
      <EventsHero data={page.hero} locale={locale} />
      <EventsPromise data={page.promiseSection} locale={locale} />
      <EventTypesCarousel
        section={page.eventTypesSection}
        types={page.eventTypes ?? []}
        locale={locale}
      />
      <EventsHalls section={page.hallsSection} halls={page.halls ?? []} locale={locale} />
      <EventsHotelUpsell data={page.hotelUpsellSection} locale={locale} />
      <EventsCatering data={page.cateringSection} locale={locale} />
      <EventsReviews data={page.reviewsSection} locale={locale} />
      <EventsSteps data={page.stepsSection} locale={locale} />
      <EventsReservationCta data={page.reservationSection} settings={settings} locale={locale} />
      <Footer settings={settings} locale={locale} logoImage={logoImage} />
    </>
  )
}
