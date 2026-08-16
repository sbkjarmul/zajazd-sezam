// Szablon 2/2 - automatyczne potwierdzenie dla goscia, ktory wyslal formularz.
// Jezyk = locale formularza (PL/EN). Zawiera podsumowanie zgloszenia, zeby
// gosc mial u siebie slad tego, co wyslal, oraz kontakt do recepcji.

import * as React from 'react'
import { Button, Heading, Section, Text } from '@react-email/components'
import { buildDetailRows } from '@/lib/email/labels'
import type { BrandContact, EmailLocale, InquiryPayload } from '@/lib/email/types'
import { DetailsTable } from './components/DetailsTable'
import { ctaButton } from './components/buttons'
import { EmailShell } from './components/EmailShell'
import { PREVIEW_LOGO } from './components/previewLogo'
import { BRAND } from './components/theme'

type Props = {
  payload: InquiryPayload
  locale: EmailLocale
  contact: BrandContact
}

type Copy = {
  preview: string
  eyebrow: string
  headingWithName: (name: string) => string
  headingNoName: string
  lead: (kind: InquiryPayload['kind']) => string
  summaryTitle: string
  urgent: string
  callCta: string
  closing: string
  signature: string
}

const COPY: Record<EmailLocale, Copy> = {
  pl: {
    preview: 'Otrzymaliśmy Twoje zgłoszenie — odezwiemy się w ciągu 24 godzin.',
    eyebrow: 'Otrzymaliśmy Twoje zgłoszenie',
    headingWithName: (name) => `Dziękujemy, ${name}!`,
    headingNoName: 'Dziękujemy za zapytanie!',
    lead: (kind) =>
      kind === 'room'
        ? 'Recepcja sprawdzi dostępność i odezwie się w ciągu 24 godzin, aby potwierdzić rezerwację.'
        : 'Nasz zespół sprawdzi dostępność sali i terminu, a następnie odezwie się w ciągu 24 godzin z propozycją szczegółów.',
    summaryTitle: 'Podsumowanie zgłoszenia',
    urgent: 'Sprawa pilna? Zadzwoń do nas.',
    callCta: 'Zadzwoń do recepcji',
    closing: 'Do zobaczenia w Stalowej Woli!',
    signature: 'Zespół Zajazdu Sezam',
  },
  en: {
    preview: 'We received your inquiry — we will get back to you within 24 hours.',
    eyebrow: 'We received your inquiry',
    headingWithName: (name) => `Thank you, ${name}!`,
    headingNoName: 'Thank you for your inquiry!',
    lead: (kind) =>
      kind === 'room'
        ? 'Our reception will check availability and get back to you within 24 hours to confirm the booking.'
        : 'Our team will check hall and date availability, then get back to you within 24 hours with the details.',
    summaryTitle: 'Your inquiry',
    urgent: 'Need an answer sooner? Give us a call.',
    callCta: 'Call reception',
    closing: 'See you in Stalowa Wola!',
    signature: 'The Zajazd Sezam team',
  },
}

export function GuestAutoReplyEmail({ payload, locale, contact }: Props) {
  const copy = COPY[locale]
  const name = payload.data.fullName?.trim()
  const rows = buildDetailRows(payload, locale)
  const phone = contact.phone

  return (
    <EmailShell preview={copy.preview} locale={locale} contact={contact} logo={contact.logo}>
      <Text style={eyebrow}>{copy.eyebrow}</Text>
      <Heading as="h1" style={heading}>
        {name ? copy.headingWithName(name) : copy.headingNoName}
      </Heading>
      <Text style={lead}>{copy.lead(payload.kind)}</Text>

      <Text style={summaryTitle}>{copy.summaryTitle}</Text>
      <DetailsTable rows={rows} />

      <Text style={urgent}>{copy.urgent}</Text>
      {phone ? (
        <Section style={actions}>
          <Button href={`tel:${phone.replace(/\s/g, '')}`} style={ctaButton}>
            {copy.callCta}: {contact.phoneDisplay ?? phone}
          </Button>
        </Section>
      ) : null}

      <Text style={closing}>{copy.closing}</Text>
      <Text style={signature}>{copy.signature}</Text>
    </EmailShell>
  )
}

// Dane podgladu dla `pnpm email` (react-email dev server).
GuestAutoReplyEmail.PreviewProps = {
  payload: {
    kind: 'room',
    data: {
      fullName: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      phone: '+48 600 100 200',
      roomType: 'comfort-room',
      checkIn: '2026-07-18',
      checkOut: '2026-07-21',
      guests: 2,
      notes: 'Proszę o pokój z dala od ulicy.',
    },
  },
  locale: 'pl',
  contact: {
    companyName: 'Zajazd Sezam',
    addressLine: 'ul. Komisji Edukacji Narodowej 51, 37-450 Stalowa Wola',
    phone: '+48 15 642 21 06',
    email: 'recepcja@zajazdsezam.pl',
    siteUrl: 'https://zajazdsezam.pl',
    logo: PREVIEW_LOGO,
  },
} satisfies Props

export default GuestAutoReplyEmail

// Eyebrow wg DESIGN-RULES 4.1: 16px, UPPERCASE, tracking 0, waga normalna.
const eyebrow: React.CSSProperties = {
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

// Opisy = 16px / leading 1.2 / tracking 0 (zelazna regula z DESIGN-RULES 4.6).
const lead: React.CSSProperties = {
  margin: '16px 0 32px',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.dark,
}

const summaryTitle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 400,
  textTransform: 'uppercase',
  color: BRAND.textMuted,
}

const urgent: React.CSSProperties = {
  margin: '28px 0 0',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.dark,
}

const actions: React.CSSProperties = {
  paddingTop: '16px',
}

const closing: React.CSSProperties = {
  margin: '32px 0 0',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.dark,
}

const signature: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 500,
  color: BRAND.dark,
}
