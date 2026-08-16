// Szablon 1/2 - powiadomienie do recepcji o nowym zgloszeniu z formularza
// (rezerwacja pokoju albo zapytanie o impreze). Zawsze po polsku - odbiorca to
// zespol Zajazdu. Reply-To ustawiane na adres goscia, wiec "Odpowiedz" w
// kliencie pocztowym trafia prosto do niego.

import * as React from 'react'
import { Button, Heading, Section, Text } from '@react-email/components'
import { buildDetailRows } from '@/lib/email/labels'
import type { BrandContact, InquiryPayload } from '@/lib/email/types'
import { DetailsTable } from './components/DetailsTable'
import { ctaButton } from './components/buttons'
import { EmailShell } from './components/EmailShell'
import { PREVIEW_LOGO } from './components/previewLogo'
import { BRAND } from './components/theme'

type Props = {
  payload: InquiryPayload
  contact: BrandContact
}

const KIND_COPY = {
  room: {
    badge: 'Rezerwacja pokoju',
    heading: 'Nowe zapytanie o pokój',
    hint: 'Skontaktuj się z gościem, aby potwierdzić dostępność i szczegóły pobytu.',
  },
  event: {
    badge: 'Impreza okolicznościowa',
    heading: 'Nowe zapytanie o imprezę',
    hint: 'Skontaktuj się z gościem, aby potwierdzić dostępność sali i terminu.',
  },
} as const

export function ReceptionInquiryEmail({ payload, contact }: Props) {
  const copy = KIND_COPY[payload.kind]
  const { email, phone, fullName } = payload.data
  const rows = buildDetailRows(payload, 'pl')
  const guest = fullName?.trim() || email

  return (
    <EmailShell
      preview={`${copy.heading} — ${guest}`}
      locale="pl"
      contact={contact}
      logo={contact.logo}
    >
      <Text style={badge}>{copy.badge}</Text>
      <Heading as="h1" style={heading}>
        {copy.heading}
      </Heading>
      <Text style={lead}>{copy.hint}</Text>

      <DetailsTable rows={rows} />

      <Section style={actions}>
        <Button href={`tel:${phone.replace(/\s/g, '')}`} style={ctaButton}>
          Zadzwoń: {phone}
        </Button>
      </Section>

      <Text style={note}>
        Wiadomość wygenerowana automatycznie przez formularz na{' '}
        {contact.siteUrl.replace(/^https?:\/\//, '')}.
      </Text>
    </EmailShell>
  )
}

// Dane podgladu dla `pnpm email` (react-email dev server).
ReceptionInquiryEmail.PreviewProps = {
  payload: {
    kind: 'event',
    data: {
      fullName: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      phone: '+48 600 100 200',
      eventType: 'wedding',
      preferredDate: '2026-09-12',
      guests: '100-200',
      hall: 'Sala Bankietowa',
    },
  },
  contact: {
    companyName: 'Zajazd Sezam',
    addressLine: 'ul. Komisji Edukacji Narodowej 51, 37-450 Stalowa Wola',
    phone: '+48 15 642 21 06',
    email: 'recepcja@zajazdsezam.pl',
    siteUrl: 'https://zajazdsezam.pl',
    logo: PREVIEW_LOGO,
  },
} satisfies Props

export default ReceptionInquiryEmail

// Eyebrow wg DESIGN-RULES 4.1: 16px, UPPERCASE, tracking 0, waga normalna.
const badge: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 400,
  textTransform: 'uppercase',
  color: BRAND.darkGold,
}

// Naglowek wg DESIGN-RULES 4.3: leading-none + tracking -0.03em.
const heading: React.CSSProperties = {
  margin: '12px 0 0',
  fontSize: '32px',
  lineHeight: '100%',
  fontWeight: 500,
  letterSpacing: '-0.03em',
  color: BRAND.dark,
}

// Opis = 16px / leading 1.2 / tracking 0 (zelazna regula z DESIGN-RULES 4.6).
// Wezszy niz karta, zeby opis lamal sie na dwie zbalansowane linie
// (Outlook ignoruje max-width i pokaze pelna szerokosc - akceptowalne).
const lead: React.CSSProperties = {
  margin: '14px auto 28px',
  maxWidth: '320px',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.textMuted,
}

const actions: React.CSSProperties = {
  paddingTop: '28px',
}

const note: React.CSSProperties = {
  margin: '28px 0 0',
  fontSize: '12px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.textMuted,
}
