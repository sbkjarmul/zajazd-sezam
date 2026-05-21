import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity/client'
import { CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/metadata'
import type { Locale } from '@/i18n/routing'
import { ContactHero } from '@/components/sections/contact/ContactHero'
import { ContactInfo } from '@/components/sections/contact/ContactInfo'
import { ContactMap } from '@/components/sections/contact/ContactMap'
import { ContactDirections } from '@/components/sections/contact/ContactDirections'
import { ContactFinalCta } from '@/components/sections/contact/ContactFinalCta'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

type Params = { locale: string }

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params
  const [page, settings] = await Promise.all([
    sanityClient.fetch(CONTACT_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])
  return buildMetadata({
    locale: locale as Locale,
    pathname: '/kontakt',
    seo: page?.seo,
    defaultSeo: settings?.defaultSeo,
  })
}

export default async function ContactPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  setRequestLocale(rawLocale)
  const locale = rawLocale as Locale

  const [page, settings] = await Promise.all([
    sanityClient.fetch(CONTACT_PAGE_QUERY),
    sanityClient.fetch(SITE_SETTINGS_QUERY),
  ])

  if (!page) notFound()

  const logoImage = page.headerLogo ?? settings?.defaultHeaderLogo ?? undefined

  return (
    <>
      <Header logoImage={logoImage} locale={locale} />
      <ContactHero data={page.hero} locale={locale} />
      <ContactInfo data={page.contactSection} settings={settings} locale={locale} />
      <ContactMap data={page.mapSection} settings={settings} locale={locale} />
      <ContactDirections data={page.directionsSection} locale={locale} />
      <ContactFinalCta data={page.finalCta} locale={locale} />
      <Footer settings={settings} locale={locale} logoImage={logoImage} />
    </>
  )
}
