import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale, type Pathname } from '@/i18n/routing'
import { SITE_URL } from '@/lib/env'

type LocaleString = { pl?: string | null; en?: string | null } | null | undefined

type SeoImageInput =
  | {
      asset?: { url?: string | null } | null
    }
  | null
  | undefined

export type SeoMetaInput = {
  metaTitle?: LocaleString
  metaDescription?: LocaleString
  ogImage?: SeoImageInput
  noIndex?: boolean | null
} | null

type BuildMetadataArgs = {
  locale: Locale
  pathname: Pathname
  seo?: SeoMetaInput
  defaultSeo?: SeoMetaInput
  siteName?: string
}

const OG_LOCALE: Record<Locale, string> = { pl: 'pl_PL', en: 'en_US' }

export function buildMetadata({
  locale,
  pathname,
  seo,
  defaultSeo,
  siteName = 'Zajazd Sezam',
}: BuildMetadataArgs): Metadata {
  const title = pickLocale(seo?.metaTitle, locale) ?? pickLocale(defaultSeo?.metaTitle, locale)
  const description =
    pickLocale(seo?.metaDescription, locale) ?? pickLocale(defaultSeo?.metaDescription, locale)
  const ogImageUrl = ogImageFromSeo(seo) ?? ogImageFromSeo(defaultSeo)
  const noIndex = Boolean(seo?.noIndex)

  const canonical = absoluteUrl(localizedPathname(pathname, locale))
  const languages = buildHreflangAlternates(pathname)

  const og: Metadata['openGraph'] = {
    title: title ?? siteName,
    description: description ?? undefined,
    url: canonical,
    siteName,
    locale: OG_LOCALE[locale],
    type: 'website',
    images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: title ?? undefined,
    description: description ?? undefined,
    alternates: { canonical, languages },
    openGraph: og,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

function pickLocale(value: LocaleString, locale: Locale): string | undefined {
  return value?.[locale] ?? undefined
}

function ogImageFromSeo(seo: SeoMetaInput | undefined): string | undefined {
  const url = seo?.ogImage?.asset?.url
  if (!url) return undefined
  // Sanity image CDN URL — append transformation params for 1200×630 OG crop.
  return `${url}?w=1200&h=630&fit=crop&auto=format`
}

function localizedPathname(pathname: Pathname, locale: Locale): string {
  return getPathname({ href: { pathname }, locale })
}

function buildHreflangAlternates(pathname: Pathname): Record<string, string> {
  const out: Record<string, string> = {}
  for (const locale of routing.locales) {
    out[locale] = absoluteUrl(localizedPathname(pathname, locale))
  }
  out['x-default'] = absoluteUrl(localizedPathname(pathname, routing.defaultLocale))
  return out
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
