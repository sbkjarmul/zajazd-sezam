/**
 * Testowa wysylka obu szablonow maili - z pominieciem formularza i Turnstile.
 *
 *   pnpm email:test                      # na adres z RECEPTION_EMAIL
 *   pnpm email:test ktos@example.com     # na wskazany adres
 *
 * Bez RESEND_API_KEY nic nie leci w swiat - maile ladują w tmp/mails/*.html
 * (ten sam mock, co przy lokalnym wypelnieniu formularza).
 */

import { buildBrandContact } from '@/lib/email/contact'
import { sendEmail } from '@/lib/email/send'
import { buildAutoReplyEmail, buildReceptionEmail } from '@/lib/email/templates'
import type { InquiryPayload } from '@/lib/email/types'
import { sanityClient } from '@/lib/sanity/client'
import { EMAIL_LOGO_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'

const TO = process.argv[2] || process.env.RECEPTION_EMAIL
if (!TO)
  throw new Error('Podaj adres: pnpm email:test ktos@example.com (lub ustaw RECEPTION_EMAIL)')

// Przykladowe zgloszenie - takie, jakie przyszloby z drawera rezerwacji.
const payload: InquiryPayload = {
  kind: 'room',
  data: {
    fullName: 'Jan Kowalski',
    email: TO,
    phone: '+48 600 100 200',
    roomType: 'comfort-room',
    checkIn: '2026-07-18',
    checkOut: '2026-07-21',
    guests: 2,
    notes: 'Test wysylki — mail wygenerowany przez scripts/send-test-email.ts',
  },
}

async function main() {
  const [settings, logo] = await Promise.all([
    sanityClient.fetch(SITE_SETTINGS_QUERY),
    sanityClient.fetch(EMAIL_LOGO_QUERY),
  ])
  const contact = buildBrandContact(settings, logo, 'pl')

  const mode = process.env.RESEND_API_KEY ? 'Resend' : 'mock (tmp/mails/)'
  console.info(`[email:test] tryb: ${mode} → ${TO}`)

  const reception = await buildReceptionEmail(payload, contact)
  const receptionResult = await sendEmail({
    to: TO!,
    subject: reception.subject,
    html: reception.html,
    text: reception.text,
    replyTo: payload.data.email,
  })
  console.info(`  1/2 recepcja      → ${receptionResult.id}`)

  const autoReply = await buildAutoReplyEmail(payload, 'pl', contact)
  const autoReplyResult = await sendEmail({
    to: TO!,
    subject: autoReply.subject,
    html: autoReply.html,
    text: autoReply.text,
    replyTo: process.env.RECEPTION_EMAIL,
  })
  console.info(`  2/2 auto-reply    → ${autoReplyResult.id}`)
}

void main()
