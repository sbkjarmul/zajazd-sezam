// Etykiety i formatowanie wartosci zgloszenia dla maili (PL + EN).
// Mail do recepcji jest zawsze PL, auto-reply w jezyku formularza - stad
// dwujezyczne mapy zamiast siegania po `messages/*.json` (te sa dla UI, a
// route handler nie ma kontekstu next-intl).

import type {
  EventInquiryValues,
  EventTypeId,
  RoomBookingValues,
  RoomTypeId,
} from '@/lib/validators/reservation'
import type { DetailRow, EmailLocale, InquiryPayload } from './types'

const ROOM_LABELS: Record<EmailLocale, Record<RoomTypeId, string>> = {
  pl: {
    'apartment-comfort': 'Apartament Komfort',
    'comfort-room': 'Pokój Komfort',
    'standard-room': 'Pokój Standard',
  },
  en: {
    'apartment-comfort': 'Comfort Apartment',
    'comfort-room': 'Comfort Room',
    'standard-room': 'Standard Room',
  },
}

const EVENT_LABELS: Record<EmailLocale, Record<EventTypeId, string>> = {
  pl: {
    wedding: 'Wesele',
    communion: 'Komunia',
    birthday: 'Urodziny',
    corporate: 'Impreza firmowa',
    other: 'Inne',
  },
  en: {
    wedding: 'Wedding',
    communion: 'Communion',
    birthday: 'Birthday',
    corporate: 'Corporate event',
    other: 'Other',
  },
}

const FIELD_LABELS = {
  pl: {
    fullName: 'Imię i nazwisko',
    email: 'E-mail',
    phone: 'Telefon',
    roomType: 'Rodzaj pokoju',
    checkIn: 'Zameldowanie',
    checkOut: 'Wymeldowanie',
    nights: 'Liczba nocy',
    guests: 'Liczba gości',
    notes: 'Uwagi',
    eventType: 'Rodzaj imprezy',
    preferredDate: 'Preferowana data',
    hall: 'Wybrana sala',
  },
  en: {
    fullName: 'Full name',
    email: 'E-mail',
    phone: 'Phone',
    roomType: 'Room type',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    nights: 'Nights',
    guests: 'Guests',
    notes: 'Notes',
    eventType: 'Event type',
    preferredDate: 'Preferred date',
    hall: 'Selected hall',
  },
} as const satisfies Record<EmailLocale, Record<string, string>>

export function roomTypeLabel(id: RoomTypeId, locale: EmailLocale): string {
  return ROOM_LABELS[locale][id]
}

export function eventTypeLabel(id: EventTypeId, locale: EmailLocale): string {
  return EVENT_LABELS[locale][id]
}

// ISO (YYYY-MM-DD) -> "14 czerwca 2026" / "14 June 2026".
// UTC wymuszone, zeby data nie przeskoczyla o dzien przy strefie serwera.
export function formatDate(iso: string, locale: EmailLocale): string {
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

// Zakres dat bez powtarzania czesci wspolnych: "18–21 lipca 2026",
// "28 lipca – 2 sierpnia 2026", "30 grudnia 2026 – 2 stycznia 2027".
export function formatDateRange(from: string, to: string, locale: EmailLocale): string {
  const [fromDate, toDate] = [new Date(`${from}T12:00:00Z`), new Date(`${to}T12:00:00Z`)]
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return `${formatDate(from, locale)} – ${formatDate(to, locale)}`
  }

  const tag = locale === 'pl' ? 'pl-PL' : 'en-GB'
  const sameYear = fromDate.getUTCFullYear() === toDate.getUTCFullYear()
  const sameMonth = sameYear && fromDate.getUTCMonth() === toDate.getUTCMonth()

  if (sameMonth) {
    const day = new Intl.DateTimeFormat(tag, { day: 'numeric', timeZone: 'UTC' }).format(fromDate)
    return `${day}–${formatDate(to, locale)}`
  }
  if (sameYear) {
    const head = new Intl.DateTimeFormat(tag, {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(fromDate)
    return `${head} – ${formatDate(to, locale)}`
  }
  return `${formatDate(from, locale)} – ${formatDate(to, locale)}`
}

function nightsBetween(checkIn: string, checkOut: string): number | null {
  const from = Date.parse(`${checkIn}T00:00:00Z`)
  const to = Date.parse(`${checkOut}T00:00:00Z`)
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) return null
  return Math.round((to - from) / 86_400_000)
}

// Wiersze tabeli szczegolow - te same dane w mailu do recepcji (PL) i w
// podsumowaniu auto-reply (jezyk goscia).
export function buildDetailRows(payload: InquiryPayload, locale: EmailLocale): DetailRow[] {
  const t = FIELD_LABELS[locale]
  const rows: DetailRow[] = []

  const push = (label: string, value: string | number | undefined | null) => {
    const text = typeof value === 'number' ? String(value) : value?.trim()
    if (text) rows.push({ label, value: text })
  }

  if (payload.kind === 'room') {
    const data: RoomBookingValues = payload.data
    push(t.fullName, data.fullName)
    push(t.email, data.email)
    push(t.phone, data.phone)
    push(t.roomType, roomTypeLabel(data.roomType, locale))
    push(t.checkIn, formatDate(data.checkIn, locale))
    push(t.checkOut, formatDate(data.checkOut, locale))
    push(t.nights, nightsBetween(data.checkIn, data.checkOut))
    push(t.guests, data.guests)
    push(t.notes, data.notes)
    return rows
  }

  const data: EventInquiryValues = payload.data
  push(t.fullName, data.fullName)
  push(t.email, data.email)
  push(t.phone, data.phone)
  push(t.eventType, eventTypeLabel(data.eventType, locale))
  push(t.preferredDate, formatDate(data.preferredDate, locale))
  push(t.guests, data.guests)
  push(t.hall, data.hall)
  return rows
}
