import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { MENU_BY_CATEGORY_QUERY, MENU_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { MenuHero } from '@/components/sections/menu/MenuHero'
import { MenuCategoryColumns } from '@/components/sections/menu/MenuCategoryColumns'
import { RestaurantReservation } from '@/components/sections/RestaurantReservation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(MENU_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/restauracja/menu',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function MenuPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, categories, settings] = await Promise.all([
    sanityClient.fetch(MENU_PAGE_QUERY),
    sanityClient.fetch(MENU_BY_CATEGORY_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  const brandLabel = locale === 'pl' ? 'Restauracja Sezam' : 'Sezam Restaurant'
  const logoImage = page.restaurantHeaderLogo ?? settings?.defaultHeaderLogo ?? undefined
  const tReservation = await getTranslations('restaurant.reservation')

  return (
    <>
      <Header
        heroTheme="light"
        logoImage={logoImage}
        locale={locale}
        nav={[
          { label: locale === 'pl' ? 'Restauracja' : 'Restaurant', href: '/restauracja' },
          { label: locale === 'pl' ? 'Menu' : 'Menu', href: '/restauracja/menu' },
          { label: locale === 'pl' ? 'Kontakt' : 'Contact', href: '/kontakt' },
        ]}
      />
      <MenuHero data={page.pageIntro} locale={locale} />

      <div id="menu" className="bg-bg pb-12 md:pb-16">
        {categories.map((category) => (
          <MenuCategoryColumns key={category._id} category={category} locale={locale} />
        ))}
      </div>

      <RestaurantReservation
        title={pickLocale(page.reservationSection?.title, locale)}
        description={pickLocale(page.reservationSection?.description, locale)}
        phone={settings?.phone}
        address={settings?.address}
        locale={locale}
      />
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
