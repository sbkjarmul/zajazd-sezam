// Renderowanie szablonow React Email do postaci wysylanej przez Resend.
// Kazdy builder zwraca { subject, html, text } - wersja tekstowa powstaje z tego
// samego drzewa Reacta (`plainText: true`), wiec nie moze rozjechac sie z HTML-em.

import { plainTextSelectors, render } from '@react-email/components'
import { GuestAutoReplyEmail } from '@/emails/GuestAutoReplyEmail'
import { ReceptionInquiryEmail } from '@/emails/ReceptionInquiryEmail'
import { eventTypeLabel, formatDate, roomTypeLabel } from './labels'
import type { BrandContact, EmailLocale, InquiryPayload } from './types'

export type RenderedEmail = {
  subject: string
  html: string
  text: string
}

// Wiersze tabeli szczegolow (Row z klasa `detail-row`) domyslnie skleilyby sie
// w tekscie w "Telefon+48 600 100 200" - formatter `dataTable` rozdziela komorki.
const PLAIN_TEXT_OPTIONS = {
  selectors: [...plainTextSelectors, { selector: 'table.detail-row', format: 'dataTable' }],
}

async function renderBoth(element: React.ReactElement, subject: string): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true, htmlToTextOptions: PLAIN_TEXT_OPTIONS }),
  ])
  return { subject, html, text }
}

// ============================================================================
// Mail do recepcji - zawsze PL
// ============================================================================
function receptionSubject(payload: InquiryPayload): string {
  const guest = payload.data.fullName?.trim() || payload.data.email
  if (payload.kind === 'room') {
    const room = roomTypeLabel(payload.data.roomType, 'pl')
    return `Nowe zapytanie o pokój — ${guest} (${room}, ${formatDate(payload.data.checkIn, 'pl')})`
  }
  const type = eventTypeLabel(payload.data.eventType, 'pl')
  return `Nowe zapytanie o imprezę — ${guest} (${type}, ${formatDate(payload.data.preferredDate, 'pl')})`
}

export function buildReceptionEmail(
  payload: InquiryPayload,
  contact: BrandContact,
): Promise<RenderedEmail> {
  return renderBoth(
    <ReceptionInquiryEmail payload={payload} contact={contact} />,
    receptionSubject(payload),
  )
}

// ============================================================================
// Auto-reply do goscia - jezyk formularza
// ============================================================================
const AUTO_REPLY_SUBJECT: Record<EmailLocale, string> = {
  pl: 'Dziękujemy za zapytanie — Zajazd Sezam',
  en: 'Thanks for your inquiry — Zajazd Sezam',
}

export function buildAutoReplyEmail(
  payload: InquiryPayload,
  locale: EmailLocale,
  contact: BrandContact,
): Promise<RenderedEmail> {
  return renderBoth(
    <GuestAutoReplyEmail payload={payload} locale={locale} contact={contact} />,
    AUTO_REPLY_SUBJECT[locale],
  )
}
