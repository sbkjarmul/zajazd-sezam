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

// Statyczny fallback og:image per strona (public/images/og/*.jpg) — uzywany gdy
// dokument nie ma wlasnego seo.ogImage ani defaultSeo.ogImage. Gwarantuje grafike
// przy udostepnianiu linku na kazdej podstronie. Nieujete sciezki -> og-default.jpg.
const OG_FALLBACK_FILE: Partial<Record<Pathname, string>> = {
  '/restauracja': 'og-restauracja.jpg',
  '/restauracja/menu': 'og-restauracja.jpg',
  '/hotel': 'og-hotel.jpg',
  '/bistro': 'og-bistro.jpg',
}

function staticOgFallback(pathname: Pathname): string {
  return `${SITE_URL}/images/og/${OG_FALLBACK_FILE[pathname] ?? 'og-default.jpg'}`
}

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
  const ogImageUrl = ogImageFromSeo(seo) ?? ogImageFromSeo(defaultSeo) ?? staticOgFallback(pathname)
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

// === Breadcrumbs (okruchy nawigacji dla BreadcrumbList JSON-LD) ===

const BREADCRUMB_LABEL: Record<Pathname, Record<Locale, string>> = {
  '/': { pl: 'Strona główna', en: 'Home' },
  '/restauracja': { pl: 'Restauracja', en: 'Restaurant' },
  '/restauracja/menu': { pl: 'Menu', en: 'Menu' },
  '/bistro': { pl: 'Bistro', en: 'Bistro' },
  '/hotel': { pl: 'Hotel', en: 'Hotel' },
  '/imprezy-okolicznosciowe': { pl: 'Imprezy okolicznościowe', en: 'Events' },
  '/galeria': { pl: 'Galeria', en: 'Gallery' },
  '/kontakt': { pl: 'Kontakt', en: 'Contact' },
  '/regulamin': { pl: 'Regulamin', en: 'Terms & Conditions' },
  '/polityka-prywatnosci': { pl: 'Polityka prywatności', en: 'Privacy Policy' },
}

// Rodzic w drzewie nawigacji — tylko sciezki glebsze niz 1. poziom.
// Reszta ma domyslnie rodzica '/' (dodawany w buildBreadcrumb).
const BREADCRUMB_PARENT: Partial<Record<Pathname, Pathname>> = {
  '/restauracja/menu': '/restauracja',
}

// Zwraca lancuch okruchow od strony glownej do biezacej strony, z absolutnymi
// zlokalizowanymi URL-ami. Dla '/' zwraca [] (breadcrumb 1-elementowy nie ma sensu).
export function buildBreadcrumb(
  locale: Locale,
  pathname: Pathname,
): Array<{ name: string; url: string }> {
  if (pathname === '/') return []
  const chain: Pathname[] = []
  let current: Pathname | undefined = pathname
  while (current && current !== '/') {
    chain.unshift(current)
    current = BREADCRUMB_PARENT[current]
  }
  chain.unshift('/')
  return chain.map((p) => ({
    name: BREADCRUMB_LABEL[p][locale],
    url: absoluteUrl(localizedPathname(p, locale)),
  }))
}
