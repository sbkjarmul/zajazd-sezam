import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { ALL_ROOM_TYPES_QUERY, HOTEL_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { HotelHero } from '@/components/sections/hotel/HotelHero'
import { HotelQuote } from '@/components/sections/hotel/HotelQuote'
import { HotelRoomCard } from '@/components/sections/hotel/HotelRoomCard'
import { HotelAmenities } from '@/components/sections/hotel/HotelAmenities'
import { HotelReservationCta } from '@/components/sections/hotel/HotelReservationCta'

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

  const [page, rooms] = await Promise.all([
    sanityClient.fetch(HOTEL_PAGE_QUERY),
    sanityClient.fetch(ALL_ROOM_TYPES_QUERY),
  ])

  if (!page) notFound()

  return (
    <>
      <HotelHero data={page.hero} locale={locale} />
      <HotelQuote data={page.quote} locale={locale} />

      <div id="rooms">
        {rooms.map((room, i) => (
          <HotelRoomCard key={room._id} room={room} locale={locale} index={i} />
        ))}
      </div>

      <HotelAmenities data={page.amenitiesSection} locale={locale} />
      <HotelReservationCta data={page.reservationSection} locale={locale} />
    </>
  )
}
