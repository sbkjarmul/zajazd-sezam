import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { BISTRO_PAGE_QUERY, BISTRO_MENU_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { BistroHero } from '@/components/sections/bistro/BistroHero'
import { BistroBanner } from '@/components/sections/bistro/BistroBanner'
import { MenuCategorySection } from '@/components/sections/menu/MenuCategorySection'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(BISTRO_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/bistro',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function BistroPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, categories, settings] = await Promise.all([
    sanityClient.fetch(BISTRO_PAGE_QUERY),
    sanityClient.fetch(BISTRO_MENU_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  // Banner pozycjonowany po sekcji "Dania mięsne" (pierwszej), zgodnie z Figma.
  const first = categories[0]
  const rest = categories.slice(1)

  const brandLabel = locale === 'pl' ? 'Bistro Sezam' : 'Sezam Bistro'
  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined

  return (
    <>
      <Header heroTheme="dark" logoImage={logoImage} locale={locale} />
      <BistroHero data={page} locale={locale} />

      {first && (
        <MenuCategorySection
          category={first}
          locale={locale}
          index={0}
          forceTheme="light"
          headingWeight="black"
        />
      )}

      <BistroBanner text={page.centralBanner} hours={page.hoursText} locale={locale} />

      {rest.map((category, i) => (
        <MenuCategorySection
          key={category._id}
          category={category}
          locale={locale}
          index={i + 1}
          forceTheme="light"
          headingWeight="black"
        />
      ))}

      <Footer
        settings={settings}
        locale={locale}
        brandLabel={brandLabel}
        theme="dark"
        bgColor="#1a2789"
        bigBrand
      />
    </>
  )
}
