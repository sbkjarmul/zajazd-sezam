import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { RESTAURANT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { RestaurantHero } from '@/components/sections/restaurant/RestaurantHero'
import { RestaurantPitch } from '@/components/sections/restaurant/RestaurantPitch'
import { RestaurantCraft } from '@/components/sections/restaurant/RestaurantCraft'
import { RestaurantAmbiance } from '@/components/sections/restaurant/RestaurantAmbiance'
import { RestaurantReservation } from '@/components/sections/restaurant/RestaurantReservation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(RESTAURANT_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/restauracja',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function RestaurantPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, settings] = await Promise.all([
    sanityClient.fetch(RESTAURANT_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  const brandLabel = locale === 'pl' ? 'Restauracja Sezam' : 'Sezam Restaurant'
  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined
  const tReservation = await getTranslations('restaurant.reservation')

  return (
    <>
      <Header
        heroTheme="light"
        mobileHeroTheme="dark"
        logoImage={logoImage}
        locale={locale}
        nav={[
          { label: locale === 'pl' ? 'Restauracja' : 'Restaurant', href: '/restauracja' },
          { label: locale === 'pl' ? 'Menu' : 'Menu', href: '/restauracja/menu' },
          { label: locale === 'pl' ? 'Kontakt' : 'Contact', href: '/kontakt' },
        ]}
      />
      <RestaurantHero data={page} locale={locale} />
      <RestaurantPitch data={page.pitchSection} locale={locale} />
      <RestaurantCraft data={page.craftSection} locale={locale} />
      <RestaurantAmbiance data={page.ambianceSection} settings={settings} locale={locale} />
      <RestaurantReservation data={page.reservationSection} settings={settings} locale={locale} />
      <Footer
        settings={settings}
        locale={locale}
        brandLabel={brandLabel}
        logoImage={logoImage}
        bigBrand
        hoursText={tReservation('hoursValue')}
      />
    </>
  )
}
