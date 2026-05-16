import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { BISTRO_PAGE_QUERY, BISTRO_MENU_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { BistroHero } from '@/components/sections/bistro/BistroHero'
import { BistroBanner } from '@/components/sections/bistro/BistroBanner'
import { MenuCategorySection } from '@/components/sections/menu/MenuCategorySection'

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

  const [page, categories] = await Promise.all([
    sanityClient.fetch(BISTRO_PAGE_QUERY),
    sanityClient.fetch(BISTRO_MENU_QUERY),
  ])

  if (!page) notFound()

  // Banner pozycjonowany po sekcji "Dania mięsne" (pierwszej), zgodnie z Figma.
  const first = categories[0]
  const rest = categories.slice(1)

  return (
    <>
      <BistroHero data={page} locale={locale} />

      <div className="mx-auto w-full max-w-[1024px] px-6 md:px-16">
        {first && <MenuCategorySection category={first} locale={locale} />}
      </div>

      <BistroBanner text={page.centralBanner} locale={locale} />

      <div className="mx-auto w-full max-w-[1024px] px-6 md:px-16">
        {rest.map((category) => (
          <MenuCategorySection key={category._id} category={category} locale={locale} />
        ))}
      </div>
    </>
  )
}
