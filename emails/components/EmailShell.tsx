// Wspolny shell obu szablonow: <head>, tlo strony, karta tresci, header z
// wordmarkiem SEZAM i stopka z NAP-em z Sanity. Layout tabelkowy zapewniaja
// komponenty react-email (Container/Section/Row) - klienci pocztowi nie maja
// niezawodnego flexboxa.

import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { BrandContact, EmailLocale, EmailLogo } from '@/lib/email/types'
import { BRAND, FONT_STACK } from './theme'

type Props = {
  // Tekst podgladu w skrzynce odbiorczej (obok tematu).
  preview: string
  locale: EmailLocale
  contact: BrandContact
  // Logo z Sanity (homepage.headerLogo). Brak -> fallback tekstowy, tak samo
  // jak w komponencie Logo na stronie.
  logo?: EmailLogo
  children: React.ReactNode
}

export function EmailShell({ preview, locale, contact, logo, children }: Props) {
  return (
    <Html lang={locale}>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={page}>
          <Container style={card}>
            <Section style={header}>
              {logo ? (
                <Img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  style={logoImage}
                />
              ) : (
                <>
                  <Text style={wordmark}>SEZAM</Text>
                  <Text style={tagline}>ZAWSZE ŚWIEŻO</Text>
                </>
              )}
            </Section>

            <Section style={content}>{children}</Section>
          </Container>

          <Section style={footer}>
            <Text style={footerName}>{contact.companyName}</Text>
            <Text style={footerLine}>{contact.addressLine}</Text>
            <Text style={footerLine}>
              {contact.phone ? (
                <Link href={`tel:${contact.phone.replace(/\s/g, '')}`} style={footerLink}>
                  {contact.phoneDisplay ?? contact.phone}
                </Link>
              ) : null}
              {contact.phone && contact.email ? <span style={footerDot}> · </span> : null}
              {contact.email ? (
                <Link href={`mailto:${contact.email}`} style={footerLink}>
                  {contact.email}
                </Link>
              ) : null}
            </Text>
            <Hr style={footerRule} />
            <Text style={footerLine}>
              <Link href={contact.siteUrl} style={footerLink}>
                {contact.siteUrl.replace(/^https?:\/\//, '')}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: BRAND.bg,
  fontFamily: FONT_STACK,
  color: BRAND.dark,
  WebkitFontSmoothing: 'antialiased',
}

const page: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 16px 40px',
}

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '568px',
  margin: 0,
  backgroundColor: BRAND.surface,
  borderRadius: '16px',
  overflow: 'hidden',
}

// Pasek naglowka jest jasny, bo logo z Sanity to jeden ciemny asset - na
// stronie wybielamy go filtrem CSS, ale filtry nie dzialaja w mailu.
const header: React.CSSProperties = {
  backgroundColor: BRAND.surface,
  borderBottom: `1px solid ${BRAND.border}`,
  padding: '36px 32px 32px',
  textAlign: 'center',
}

const logoImage: React.CSSProperties = {
  display: 'block',
  margin: '0 auto',
  border: 0,
  outline: 'none',
  textDecoration: 'none',
}

// Fallback tekstowy = wordmark z Logo.tsx. `tracking-widest` (0.125em) jest
// wg DESIGN-RULES 1.2 dozwolone WYLACZNIE tutaj; tagline pod nim ma tracking 0.
const wordmark: React.CSSProperties = {
  margin: 0,
  fontSize: '40px',
  lineHeight: '100%',
  fontWeight: 700,
  letterSpacing: '0.125em',
  color: BRAND.dark,
}

const tagline: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: '12px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.darkGold,
}

// Cala tresc maila jest wysrodkowana (naglowki, opisy, tabela, CTA) - stopka
// i tak byla. Poszczegolne style nie nadpisuja `text-align`, wiec dziedzicza stad.
const content: React.CSSProperties = {
  padding: '32px',
  textAlign: 'center',
}

const footer: React.CSSProperties = {
  padding: '24px 8px 0',
  textAlign: 'center',
}

// Stopka to fine-print: text-xs (12px) / leading 1.2 / tracking 0 - DESIGN-RULES 1.1.
const footerName: React.CSSProperties = {
  margin: 0,
  fontSize: '12px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 500,
  color: BRAND.dark,
}

const footerLine: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: '12px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.textMuted,
}

const footerLink: React.CSSProperties = {
  color: BRAND.darkGold,
  textDecoration: 'none',
}

const footerDot: React.CSSProperties = {
  color: BRAND.textMuted,
}

const footerRule: React.CSSProperties = {
  margin: '16px auto 12px',
  width: '40px',
  border: 'none',
  borderTop: `1px solid ${BRAND.border}`,
}
