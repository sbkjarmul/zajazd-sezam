// HTML email templates dla obu typów zapytań (pokój / event).
// Styling inline — kompatybilność z klientami pocztowymi (Gmail, Outlook).
// Brand colors hardcoded (nie ma dostępu do CSS variables w email).

import type { RoomBookingValues, EventInquiryValues } from '@/lib/validators/reservation'

const BRAND = {
  bg: '#f6f5ef',
  text: '#1f1f1c',
  textMuted: '#6b6b67',
  primary: '#1f1f1c',
  accent: '#a49266',
  surface: '#ffffff',
  border: '#e5e4d9',
}

const ROOM_LABELS_PL: Record<RoomBookingValues['roomType'], string> = {
  'apartment-comfort': 'Apartament Komfort',
  'double-comfort': 'Pokój dwuosobowy Komfort',
  'triple-comfort': 'Pokój trzyosobowy Komfort',
  'quad-comfort': 'Pokój czteroosobowy Komfort',
  'single-comfort-single-bed': 'Pokój 1-os. Komfort — łóżko pojedyncze',
  'single-comfort-king': 'Pokój 1-os. Komfort — łóżko King Size',
  'single-standard': 'Pokój jednoosobowy Standard',
  'double-standard': 'Pokój dwuosobowy Standard',
}

const EVENT_LABELS_PL: Record<EventInquiryValues['eventType'], string> = {
  wedding: 'Wesele',
  communion: 'Komunia',
  birthday: 'Urodziny',
  corporate: 'Impreza firmowa',
  other: 'Inne',
}

function esc(s: string | number | undefined | null): string {
  if (s === undefined || s === null) return '—'
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function shell(title: string, contentHtml: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Inter',Arial,sans-serif;color:${BRAND.text};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:${BRAND.surface};border-radius:12px;overflow:hidden;">
        <tr><td style="padding:32px 32px 16px;">
          <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-1px;color:${BRAND.text};">SEZAM</h1>
          <p style="margin:4px 0 0;font-size:9px;letter-spacing:3px;color:${BRAND.accent};">ZAWSZE ŚWIEŻO</p>
        </td></tr>
        <tr><td style="padding:0 32px 32px;">
          ${contentHtml}
        </td></tr>
        <tr><td style="padding:24px 32px;background:${BRAND.bg};border-top:1px solid ${BRAND.border};font-size:12px;color:${BRAND.textMuted};">
          Zajazd Sezam · ul. Komisji Edukacji Narodowej 51, 37-450 Stalowa Wola · +48 15 642 21 06 · recepcja@zajazdsezam.pl
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function detailsRow(label: string, value: string | number): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.textMuted};width:40%;">${esc(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.border};font-size:15px;color:${BRAND.text};">${esc(value)}</td>
  </tr>`
}

// =============================================================================
// Recepcja — zawsze PL
// =============================================================================
export function buildRoomReceptionEmail(data: RoomBookingValues) {
  const subject = `Nowe zapytanie o pokój — ${data.fullName}`
  const html = shell(
    subject,
    `<h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">Nowe zapytanie o pokój</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${detailsRow('Imię i nazwisko', data.fullName)}
      ${detailsRow('Email', data.email)}
      ${detailsRow('Telefon', data.phone)}
      ${detailsRow('Typ pokoju', ROOM_LABELS_PL[data.roomType])}
      ${detailsRow('Zameldowanie', data.checkIn)}
      ${detailsRow('Wymeldowanie', data.checkOut)}
      ${detailsRow('Liczba gości', data.guests)}
      ${data.notes ? detailsRow('Uwagi', data.notes) : ''}
    </table>
    <p style="margin:24px 0 0;font-size:14px;color:${BRAND.textMuted};">
      Skontaktuj się z gościem aby potwierdzić dostępność.
    </p>`,
  )
  const text = `Nowe zapytanie o pokój — ${data.fullName}
Email: ${data.email}
Telefon: ${data.phone}
Typ pokoju: ${ROOM_LABELS_PL[data.roomType]}
Zameldowanie: ${data.checkIn}
Wymeldowanie: ${data.checkOut}
Liczba gości: ${data.guests}
${data.notes ? `Uwagi: ${data.notes}\n` : ''}`
  return { subject, html, text }
}

export function buildEventReceptionEmail(data: EventInquiryValues) {
  const subject = `Nowe zapytanie o event — ${data.fullName} (${EVENT_LABELS_PL[data.eventType]})`
  const html = shell(
    subject,
    `<h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">Nowe zapytanie o event</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${detailsRow('Imię i nazwisko', data.fullName)}
      ${detailsRow('Email', data.email)}
      ${detailsRow('Telefon', data.phone)}
      ${detailsRow('Rodzaj imprezy', EVENT_LABELS_PL[data.eventType])}
      ${detailsRow('Preferowana data', data.preferredDate)}
      ${detailsRow('Liczba gości', data.guests)}
      ${data.hall ? detailsRow('Wybrana sala', data.hall) : ''}
      ${data.message ? detailsRow('Wiadomość', data.message) : ''}
    </table>
    <p style="margin:24px 0 0;font-size:14px;color:${BRAND.textMuted};">
      Skontaktuj się z gościem aby potwierdzić dostępność sali i terminu.
    </p>`,
  )
  const text = `Nowe zapytanie o event — ${data.fullName}
Email: ${data.email}
Telefon: ${data.phone}
Rodzaj: ${EVENT_LABELS_PL[data.eventType]}
Data: ${data.preferredDate}
Liczba gości: ${data.guests}
${data.hall ? `Sala: ${data.hall}\n` : ''}${data.message ? `Wiadomość: ${data.message}\n` : ''}`
  return { subject, html, text }
}

// =============================================================================
// Auto-reply do gościa — bilingual PL/EN
// =============================================================================
type Locale = 'pl' | 'en'

const AUTO_REPLY_COPY: Record<
  Locale,
  { subject: string; intro: string; body: string; closing: string }
> = {
  pl: {
    subject: 'Dziękujemy za zapytanie — Zajazd Sezam',
    intro: 'Dziękujemy za zapytanie',
    body: 'Otrzymaliśmy Twoje zgłoszenie. Recepcja skontaktuje się z Tobą w ciągu 24 godzin aby potwierdzić dostępność i ustalić szczegóły.',
    closing: 'Do zobaczenia w Stalowej Woli!',
  },
  en: {
    subject: 'Thanks for your inquiry — Zajazd Sezam',
    intro: 'Thanks for your inquiry',
    body: 'We received your request. Reception will contact you within 24 hours to confirm availability and arrange the details.',
    closing: 'See you in Stalowa Wola!',
  },
}

export function buildAutoReplyEmail(name: string, locale: Locale) {
  const copy = AUTO_REPLY_COPY[locale]
  const html = shell(
    copy.subject,
    `<h2 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};">${esc(copy.intro)}, ${esc(name)}!</h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.text};">${esc(copy.body)}</p>
    <p style="margin:0;font-size:15px;color:${BRAND.text};">${esc(copy.closing)}</p>`,
  )
  const text = `${copy.intro}, ${name}!\n\n${copy.body}\n\n${copy.closing}\n\nZajazd Sezam`
  return { subject: copy.subject, html, text }
}
