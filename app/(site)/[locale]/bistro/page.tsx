import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { BISTRO_PAGE_QUERY, BISTRO_MENU_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import { BistroHero } from '@/components/sections/bistro/BistroHero'
import { BistroMenuList } from '@/components/sections/bistro/BistroMenuList'
import { BistroBanner } from '@/components/sections/bistro/BistroBanner'
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

  // Redesign wg Figma 971:1214 — hero na jasnym tle, sekcja "NASZE MENU"
  // (kategorie + pozycje z Sanity), banner "Czekamy na ciebie" i footer.
  const t = await getTranslations('common')
  const menuHeading = pickLocale(page.menuIntroHeading, locale) || 'Nasze menu'
  const brandLabel = locale === 'pl' ? 'Bistro Sezam' : 'Sezam Bistro'
  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined
  const bistroPhone = settings?.phoneBistro ?? settings?.phone
  const hoursText = page.hoursText ? pickLocale(page.hoursText, locale) : undefined

  return (
    <>
      <Header
        heroTheme="light"
        logoImage={logoImage}
        locale={locale}
        // Bistro: CTA headera to „Zadzwoń" z linkiem tel: zamiast drawera rezerwacji.
        ctaLabel={t('call')}
        ctaHref={bistroPhone ? `tel:${bistroPhone.replace(/\s/g, '')}` : undefined}
      />
      <BistroHero data={page} locale={locale} />

      <BistroMenuList categories={categories} heading={menuHeading} locale={locale} />

      <BistroBanner text={page.centralBanner} hours={page.hoursText} locale={locale} />

      {/* Stopka wg Figma 1010:104 — wielki napis „SEZAM" (StretchWord) na górze,
          bez logo, kolumny dociśnięte do prawej. */}
      <Footer
        settings={settings}
        locale={locale}
        phone={bistroPhone}
        brandLabel={brandLabel}
        theme="dark"
        bgColor="#1a2789"
        bigBrand
        hideBrandLogo
        displayWord="SEZAM"
        displayWordClassName="fill-current font-sans font-black tracking-[-0.06em]"
        displayWordPad={0.06}
        hoursText={hoursText}
        logoImage={logoImage}
      />
    </>
  )
}
