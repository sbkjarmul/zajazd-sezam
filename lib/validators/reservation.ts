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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const PHONE_REGEX = /^\+?[\d\s\-()]{6,20}$/

const baseContact = {
  fullName: z
    .string()
    .trim()
    .min(2, 'reservationErrors.fullName.tooShort')
    .max(100, 'reservationErrors.fullName.tooLong'),
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
    guests: z.number().int().min(1).max(20),
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
  guests: z.number().int().min(1).max(300),
  hall: z.string().trim().max(64).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
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
