// NAP do stopki maili. Zrodlo prawdy: Sanity `siteSettings` (to samo, co
// stopka strony i JSON-LD). Fallbacki obowiazuja, gdy Sanity jest niedostepne -
// mail ma wyjsc nawet przy chwilowym bledzie CMS-a.

import { SITE_URL } from '@/lib/env'
import { formatPhonePl } from '@/lib/format/phone'
import type { EMAIL_LOGO_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import { buildEmailLogo } from './logo'
import type { BrandContact, EmailLocale } from './types'

const FALLBACK = {
  companyName: 'Zajazd Sezam',
  addressLine: 'ul. Komisji Edukacji Narodowej 51, 37-450 Stalowa Wola',
  email: 'recepcja@zajazdsezam.pl',
} as const

export function buildBrandContact(
  settings: SITE_SETTINGS_QUERY_RESULT | null,
  logo: EMAIL_LOGO_QUERY_RESULT,
  locale: EmailLocale,
): BrandContact {
  const address = settings?.address
  const addressLine =
    [address?.street, [address?.postalCode, address?.city].filter(Boolean).join(' ')]
      .filter((part) => part && part.trim().length > 0)
      .join(', ') || FALLBACK.addressLine

  return {
    companyName: settings?.companyName?.[locale] ?? FALLBACK.companyName,
    addressLine,
    phone: settings?.phone ?? undefined,
    phoneDisplay: formatPhonePl(settings?.phone) || undefined,
    email: settings?.receptionEmail ?? settings?.publicEmail ?? FALLBACK.email,
    siteUrl: SITE_URL,
    logo: buildEmailLogo(logo, locale),
  }
}
