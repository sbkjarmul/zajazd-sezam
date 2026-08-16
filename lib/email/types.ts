// Wspoldzielone typy warstwy mailowej: payload zgloszenia + dane kontaktowe (NAP)
// wstrzykiwane do stopki szablonow. NAP pochodzi z Sanity `siteSettings` - jeden
// zrodlo prawdy dla strony, JSON-LD i maili.

import type { EventInquiryValues, RoomBookingValues } from '@/lib/validators/reservation'

export type EmailLocale = 'pl' | 'en'

export type InquiryPayload =
  | { kind: 'room'; data: RoomBookingValues }
  | { kind: 'event'; data: EventInquiryValues }

// Logo w naglowku maila - gotowe do wstawienia w <img> (URL absolutny z CDN
// Sanity, wymiary w px, alt w jezyku odbiorcy).
export type EmailLogo = {
  src: string
  width: number
  height: number
  alt: string
}

export type BrandContact = {
  companyName: string
  addressLine: string
  // E.164 z Sanity — trafia do `href="tel:"`.
  phone?: string
  // Ten sam numer w zapisie do czytania: "+48 15 642 21 06".
  phoneDisplay?: string
  email?: string
  siteUrl: string
  logo?: EmailLogo
}

export type DetailRow = {
  label: string
  value: string
}
