import type { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing, type Pathname } from '@/i18n/routing'
import { SITE_URL } from '@/lib/env'

// Statyczna lista wszystkich tras strony — singleton pages (PRD sekcja 3.2).
const SITE_PATHS = [
  '/',
  '/restauracja',
  '/restauracja/menu',
  '/bistro',
  '/hotel',
  '/imprezy-okolicznosciowe',
  '/kontakt',
] as const satisfies readonly Pathname[]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return SITE_PATHS.map((pathname) => ({
    url: absoluteUrl(pathname, routing.defaultLocale),
    lastModified: now,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, absoluteUrl(pathname, locale)]),
      ),
    },
  }))
}

function absoluteUrl(pathname: Pathname, locale: (typeof routing.locales)[number]): string {
  // getPathname zawiera już prefix locale (config: localePrefix='always').
  const path = getPathname({ href: { pathname }, locale })
  return `${SITE_URL}${path}`
}
