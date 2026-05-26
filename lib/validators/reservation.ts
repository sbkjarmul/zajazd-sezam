// Współdzielone schematy Zod dla formularzy rezerwacji.
// Używane CLIENT-SIDE (react-hook-form z resolverem) i SERVER-SIDE (route handler).
// Wiadomości błędów to klucze do messages/{pl,en}.json (sekcja "reservationErrors").

import { z } from 'zod'

// Identyfikatory pokoi — zsynchronizowane z `roomType.identifier` w Sanity
// (sanity/schemas/documents/roomType.ts). Trzy kategorie: rezerwacja ogólna,
// liczbę osób ustala gość, konkretną alokację robi recepcja.
export const ROOM_TYPE_IDS = ['apartment-comfort', 'comfort-room', 'standard-room'] as const
export type RoomTypeId = (typeof ROOM_TYPE_IDS)[number]

export const EVENT_TYPE_IDS = ['wedding', 'communion', 'birthday', 'corporate', 'other'] as const
export type EventTypeId = (typeof EVENT_TYPE_IDS)[number]

// Rangiownik liczby gości dla zapytań o eventy — wartości to label = wartość.
export const EVENT_GUEST_RANGES = ['1-10', '10-50', '50-100', '100-200', '200+'] as const
export type EventGuestRange = (typeof EVENT_GUEST_RANGES)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^\+?[\d\s\-()]{6,20}$/

const baseContact = {
  // Imię i nazwisko jest opcjonalne — Figma drawer rezerwacji pokazuje tylko
  // email + telefon. Recepcja pyta o imię przy potwierdzeniu telefonicznym.
  fullName: z
    .string()
    .trim()
    .max(100, 'reservationErrors.fullName.tooLong')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().toLowerCase().pipe(z.email('reservationErrors.email.invalid')),
  phone: z.string().trim().regex(PHONE_REGEX, 'reservationErrors.phone.invalid'),
}

// ============================================================================
// Rezerwacja pokoju
// ============================================================================
export const roomBookingSchema = z
  .object({
    ...baseContact,
    roomType: z.enum(ROOM_TYPE_IDS, {
      error: 'reservationErrors.roomType.required',
    }),
    checkIn: z.string().regex(ISO_DATE, 'reservationErrors.checkIn.invalid'),
    checkOut: z.string().regex(ISO_DATE, 'reservationErrors.checkOut.invalid'),
    guests: z
      .number({ error: 'reservationErrors.guests.required' })
      .int()
      .min(1)
      .max(16),
    notes: z.string().trim().max(2000).optional().or(z.literal('')),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    error: 'reservationErrors.checkOut.beforeCheckIn',
    path: ['checkOut'],
  })

export type RoomBookingValues = z.infer<typeof roomBookingSchema>

// ============================================================================
// Zapytanie o event
// ============================================================================
export const eventInquirySchema = z.object({
  ...baseContact,
  eventType: z.enum(EVENT_TYPE_IDS, {
    error: 'reservationErrors.eventType.required',
  }),
  preferredDate: z.string().regex(ISO_DATE, 'reservationErrors.preferredDate.invalid'),
  guests: z.enum(EVENT_GUEST_RANGES, {
    error: 'reservationErrors.guests.required',
  }),
  hall: z.string().trim().max(64).optional().or(z.literal('')),
})

export type EventInquiryValues = z.infer<typeof eventInquirySchema>

// ============================================================================
// Combined API request (discriminated union by `kind`)
// ============================================================================
const SUPPORTED_LOCALES = ['pl', 'en'] as const

export const sendFormRequestSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('room'),
    locale: z.enum(SUPPORTED_LOCALES),
    turnstileToken: z.string().min(1, 'reservationErrors.turnstile.missing'),
    data: roomBookingSchema,
  }),
  z.object({
    kind: z.literal('event'),
    locale: z.enum(SUPPORTED_LOCALES),
    turnstileToken: z.string().min(1, 'reservationErrors.turnstile.missing'),
    data: eventInquirySchema,
  }),
])

export type SendFormRequest = z.infer<typeof sendFormRequestSchema>
