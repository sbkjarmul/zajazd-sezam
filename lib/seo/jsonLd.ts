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
  phoneBistro?: string | null
  publicEmail?: string | null
  receptionEmail?: string | null
  openingHoursRestaurant?: OpeningHoursEntryInput[] | null
  openingHoursReception?: OpeningHoursEntryInput[] | null
  googleBusinessProfileUrl?: string | null
  googleMapsUrl?: string | null
}

// Obszar obslugi — silny sygnal GEO ("obslugujemy caly region", nie tylko adres).
// Potwierdzic realny zasieg z klientem; latwo edytowac te liste.
const AREA_SERVED_CITIES = [
  'Stalowa Wola',
  'Nisko',
  'Tarnobrzeg',
  'Nowa Dęba',
  'Zaklików',
  'Radomyśl nad Sanem',
  'Pysznica',
  'Bojanów',
] as const

const areaServed = AREA_SERVED_CITIES.map((name) => ({ '@type': 'City', name }))

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
    logo: `${SITE_URL}/images/og/og-default.jpg`,
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
    image: `${SITE_URL}/images/og/og-default.jpg`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    hasMap: mapUrl(settings),
    areaServed,
    priceRange: '$$',
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
    image: `${SITE_URL}/images/og/og-restauracja.jpg`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    hasMap: mapUrl(settings),
    areaServed,
    priceRange: '$$',
    telephone: settings.phone ?? undefined,
    openingHoursSpecification: openingHoursSpec(settings.openingHoursRestaurant),
    hasMenu: `${SITE_URL}/${locale}/${locale === 'pl' ? 'restauracja/menu' : 'restaurant/menu'}`,
  }
}

export function bistroJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/${locale}/bistro#bistro`,
    name: `Bistro ${pickName(settings, locale) ?? 'Sezam'}`,
    servesCuisine: ['Polish'],
    url: `${SITE_URL}/${locale}/bistro`,
    image: `${SITE_URL}/images/og/og-bistro.jpg`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    hasMap: mapUrl(settings),
    areaServed,
    priceRange: '$',
    // Bezposrednia linia Bistro (fallback do numeru glownego).
    telephone: settings.phoneBistro ?? settings.phone ?? undefined,
    openingHoursSpecification: openingHoursSpec(settings.openingHoursRestaurant),
  }
}

export function lodgingBusinessJsonLd({ settings, locale }: Args) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/${locale}/hotel#lodging`,
    name: `Hotel ${pickName(settings, locale) ?? 'Sezam'}`,
    url: `${SITE_URL}/${locale}/hotel`,
    image: `${SITE_URL}/images/og/og-hotel.jpg`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    hasMap: mapUrl(settings),
    areaServed,
    priceRange: '$$',
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
    image: `${SITE_URL}/images/og/og-default.jpg`,
    address: postalAddress(settings),
    geo: geoCoordinates(settings),
    hasMap: mapUrl(settings),
    areaServed,
    telephone: settings.phone ?? undefined,
    email: settings.receptionEmail ?? undefined,
  }
}

type LocaleText = { pl?: string | null; en?: string | null } | null | undefined

export type FaqItemInput = {
  question?: LocaleText
  answer?: LocaleText
} | null

// FAQPage — rich result z rozwijanymi pytaniami w SERP (wieksze CTR).
// Zwraca undefined gdy brak wypelnionych par pytanie/odpowiedz, zeby nie
// emitowac pustego (niewaznego) schematu.
export function faqPageJsonLd({ items, locale }: { items: FaqItemInput[]; locale: Locale }) {
  const entries = (items ?? [])
    .map((item) => {
      const question = pickLocaleText(item?.question, locale)
      const answer = pickLocaleText(item?.answer, locale)
      if (!question || !answer) return null
      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      }
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)

  if (entries.length === 0) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries,
  }
}

function pickLocaleText(value: LocaleText, locale: Locale): string | undefined {
  return value?.[locale] ?? value?.pl ?? undefined
}

type MenuItemInput = {
  name?: LocaleText
  description?: LocaleText
  price?: number | null
} | null

export type MenuCategoryInput = {
  name?: LocaleText
  description?: LocaleText
  items?: MenuItemInput[] | null
} | null

// Menu -> MenuSection -> MenuItem (z Offer/cena PLN). Rich result menu w SERP.
// Pomija sekcje bez nazwy lub bez pozycji; undefined gdy cale menu puste.
export function menuJsonLd({
  categories,
  locale,
  name = 'Menu',
}: {
  categories: MenuCategoryInput[]
  locale: Locale
  name?: string
}) {
  const sections = (categories ?? [])
    .map((cat) => {
      const sectionName = pickLocaleText(cat?.name, locale)
      const items = (cat?.items ?? [])
        .map((item) => {
          const itemName = pickLocaleText(item?.name, locale)
          if (!itemName) return null
          const price = typeof item?.price === 'number' ? item.price : undefined
          return {
            '@type': 'MenuItem',
            name: itemName,
            description: pickLocaleText(item?.description, locale),
            offers:
              price !== undefined ? { '@type': 'Offer', price, priceCurrency: 'PLN' } : undefined,
          }
        })
        .filter((i): i is NonNullable<typeof i> => i !== null)

      if (!sectionName || items.length === 0) return null
      return {
        '@type': 'MenuSection',
        name: sectionName,
        description: pickLocaleText(cat?.description, locale),
        hasMenuItem: items,
      }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)

  if (sections.length === 0) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/${locale}/restauracja/menu#menu`,
    name,
    inLanguage: locale,
    hasMenuSection: sections,
  }
}

// BreadcrumbList — sciezka nawigacji w SERP (ladniejszy wynik, wyzszy CTR).
// items juz z gotowymi, absolutnymi, zlokalizowanymi URL-ami (buildBreadcrumb w metadata.ts).
export function breadcrumbListJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  if (items.length === 0) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
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

// hasMap: preferuj jawny googleMapsUrl z CMS; inaczej zbuduj z geo (deterministyczny
// deep-link Map). Brak geo -> pomijamy pole.
function mapUrl(s: SiteSettingsForJsonLd): string | undefined {
  if (s.googleMapsUrl) return s.googleMapsUrl
  const { latitude, longitude } = s.address ?? {}
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return undefined
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
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
