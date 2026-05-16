// Schema.org JSON-LD generators dla każdej branży.
// Wszystkie pobierają dane z siteSettings (NAP, godziny) — spójność wymagana
// przez Google dla SEO lokalnego (patrz ARCHITECTURE.md sekcja 8.2).
import { SITE_URL } from '@/lib/env'
import type { Locale } from '@/i18n/routing'

export type SiteSettingsForJsonLd = {
  companyName?: { pl?: string | null; en?: string | null } | null
  legalName?: string | null
  shortDescription?: { pl?: string | null; en?: string | null } | null
  address?: {
    street?: string | null
    postalCode?: string | null
    city?: string | null
    region?: string | null
    country?: string | null
    latitude?: number | null
    longitude?: number | null
  } | null
  phone?: string | null
  publicEmail?: string | null
  receptionEmail?: string | null
  openingHoursRestaurant?: OpeningHoursEntryInput[] | null
  openingHoursReception?: OpeningHoursEntryInput[] | null
  googleBusinessProfileUrl?: string | null
}

type OpeningHoursEntryInput = {
  daysOfWeek?: string[] | null
  opens?: string | null
  closes?: string | null
} | null

type Args = { settings: SiteSettingsForJsonLd; locale: Locale }

export function organizationJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: pickName(settings, locale),
    legalName: settings.legalName ?? undefined,
    url: SITE_URL,
    logo: `${SITE_URL}/images/og/og-default.webp`,
    address: postalAddress(settings),
    telephone: settings.phone ?? undefined,
    email: settings.publicEmail ?? settings.receptionEmail ?? undefined,
    sameAs: settings.googleBusinessProfileUrl ? [settings.googleBusinessProfileUrl] : undefined,
  }
}

export function localBusinessJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#localbusiness`,
    name: pickName(settings, locale),
    description: pickDescription(settings, locale),
    url: SITE_URL,
    image: `${SITE_URL}/images/og/og-default.webp`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    telephone: settings.phone ?? undefined,
    email: settings.publicEmail ?? settings.receptionEmail ?? undefined,
    openingHoursSpecification: openingHoursSpec(settings.openingHoursReception),
    sameAs: settings.googleBusinessProfileUrl ? [settings.googleBusinessProfileUrl] : undefined,
  }
}

export function restaurantJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/${locale}/restauracja#restaurant`,
    name: `Restauracja ${pickName(settings, locale) ?? 'Sezam'}`,
    servesCuisine: ['Polish'],
    url: `${SITE_URL}/${locale}/${locale === 'pl' ? 'restauracja' : 'restaurant'}`,
    image: `${SITE_URL}/images/og/og-restauracja.webp`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    telephone: settings.phone ?? undefined,
    openingHoursSpecification: openingHoursSpec(settings.openingHoursRestaurant),
    hasMenu: `${SITE_URL}/${locale}/${locale === 'pl' ? 'restauracja/menu' : 'restaurant/menu'}`,
  }
}

export function lodgingBusinessJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/${locale}/hotel#lodging`,
    name: `Hotel ${pickName(settings, locale) ?? 'Sezam'}`,
    url: `${SITE_URL}/${locale}/hotel`,
    image: `${SITE_URL}/images/og/og-hotel.webp`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    telephone: settings.phone ?? undefined,
    email: settings.receptionEmail ?? undefined,
    checkinTime: '14:00',
    checkoutTime: '11:00',
    openingHoursSpecification: openingHoursSpec(settings.openingHoursReception),
  }
}

export function eventVenueJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': `${SITE_URL}/${locale}/imprezy-okolicznosciowe#venue`,
    name: pickName(settings, locale),
    url: `${SITE_URL}/${locale}/${locale === 'pl' ? 'imprezy-okolicznosciowe' : 'events'}`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    telephone: settings.phone ?? undefined,
    email: settings.receptionEmail ?? undefined,
  }
}

// === Pomocnicze ===

function pickName(s: SiteSettingsForJsonLd, locale: Locale): string | undefined {
  return s.companyName?.[locale] ?? s.companyName?.pl ?? undefined
}

function pickDescription(s: SiteSettingsForJsonLd, locale: Locale): string | undefined {
  return s.shortDescription?.[locale] ?? s.shortDescription?.pl ?? undefined
}

function postalAddress(s: SiteSettingsForJsonLd) {
  if (!s.address) return undefined
  return {
    '@type': 'PostalAddress',
    streetAddress: s.address.street ?? undefined,
    postalCode: s.address.postalCode ?? undefined,
    addressLocality: s.address.city ?? undefined,
    addressRegion: s.address.region ?? undefined,
    addressCountry: s.address.country ?? 'PL',
  }
}

function geoCoordinates(s: SiteSettingsForJsonLd) {
  if (typeof s.address?.latitude !== 'number' || typeof s.address?.longitude !== 'number') {
    return undefined
  }
  return {
    '@type': 'GeoCoordinates',
    latitude: s.address.latitude,
    longitude: s.address.longitude,
  }
}

function openingHoursSpec(entries: OpeningHoursEntryInput[] | null | undefined) {
  if (!entries || entries.length === 0) return undefined
  return entries
    .filter((e): e is NonNullable<OpeningHoursEntryInput> => Boolean(e?.daysOfWeek?.length))
    .map((e) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: e.daysOfWeek ?? undefined,
      opens: e.opens ?? undefined,
      closes: e.closes ?? undefined,
    }))
}

// Helper do osadzania w komponencie React.
export function jsonLdScript<T>(data: T): { __html: string } {
  return { __html: JSON.stringify(data) }
}
