import { setRequestLocale, getTranslations } from 'next-intl/server'
import { sanityClient } from '@/lib/sanity/client'
import { LEGAL_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'
import { LegalArticle } from '@/components/sections/legal/LegalArticle'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

// Stałe ID dokumentu (patrz LEGAL_PAGE_IDS w sanity/schemas). Slug PL = ID.
const LEGAL_ID = 'polityka-prywatnosci'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(LEGAL_PAGE_QUERY, { id: LEGAL_ID }),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/polityka-prywatnosci',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function PrivacyPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, settings, t] = await Promise.all([
    sanityClient.fetch(LEGAL_PAGE_QUERY, { id: LEGAL_ID }),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
    getTranslations(),
  ])

  const logoImage = settings?.defaultHeaderLogo ?? undefined
  const title = pickLocale(page?.title, locale) ?? t('legal.privacyTitle')
  const intro = pickLocale(page?.intro, locale)
  const body = pickLocale(page?.body, locale) ?? t('legal.placeholder')

  return (
    <>
      <Breadcrumbs locale={locale} pathname="/polityka-prywatnosci" />
      <Header logoImage={logoImage} locale={locale} heroTheme="light" lightAccent="dark" />
      <LegalArticle title={title} intro={intro} body={body} />
      <Footer settings={settings} locale={locale} logoImage={logoImage} />
    </>
  )
}
