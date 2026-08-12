import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { ALL_ROOM_TYPES_QUERY, HOTEL_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { HotelHero } from '@/components/sections/hotel/HotelHero'
import { HotelQuote } from '@/components/sections/hotel/HotelQuote'
import { HotelRoomsShowcase } from '@/components/sections/hotel/HotelRoomsShowcase'
import { HotelAmenities } from '@/components/sections/hotel/HotelAmenities'
import { HotelReservationCta } from '@/components/sections/hotel/HotelReservationCta'
import { Reviews } from '@/components/sections/reviews/Reviews'
import { HotelDiscover } from '@/components/sections/hotel/HotelDiscover'
import { SnapController } from '@/components/SnapController'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(HOTEL_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/hotel',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function HotelPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, rooms, settings] = await Promise.all([
    sanityClient.fetch(HOTEL_PAGE_QUERY),
    sanityClient.fetch(ALL_ROOM_TYPES_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined

  return (
    <>
      <Header
        logoImage={logoImage}
        locale={locale}
        lightAccent="dark"
        darkGradient="dark"
        nav={[
          { label: locale === 'pl' ? 'Hotel' : 'Hotel', href: '/hotel' },
          { label: locale === 'pl' ? 'Pokoje' : 'Rooms', hash: 'rooms' },
          { label: locale === 'pl' ? 'Rezerwacja' : 'Reservation', hash: 'reservation' },
          { label: locale === 'pl' ? 'Dlaczego my' : 'Why us', hash: 'amenities' },
        ]}
      />
      <SnapController />
      <div className="snap-panels">
        <HotelHero data={page.hero} locale={locale} />
        <HotelQuote data={page.quote} locale={locale} />

        {/* Pokoje = wyspa scrollytellingu wolna od snapu. `snap-start` na tym
            wysokim (kilka ekranow) wrapperze robi z niego "przerosniety" obszar
            snapu: mandatory snap dosuwa gore pokoi po HotelQuote, po czym pozwala
            przewijac swobodnie w srodku, a na koncu snapuje do HotelAmenities. */}
        <div id="rooms" data-header-theme="light" className="snap-start bg-bg">
          <HotelRoomsShowcase rooms={rooms} locale={locale} />
        </div>

        <HotelAmenities data={page.amenitiesSection} locale={locale} />
        <Reviews data={page.reviewsSection} locale={locale} uppercaseTitle />
        <HotelDiscover data={page.discoverSection} locale={locale} />
        <HotelReservationCta data={page.reservationSection} locale={locale} />
        <Footer settings={settings} locale={locale} brandLabel="Hotel Sezam" logoImage={logoImage} />
      </div>
    </>
  )
}
