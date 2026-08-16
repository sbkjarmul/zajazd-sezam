import { NextResponse } from 'next/server'
import { sendFormRequestSchema } from '@/lib/validators/reservation'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { buildBrandContact } from '@/lib/email/contact'
import { buildAutoReplyEmail, buildReceptionEmail } from '@/lib/email/templates'
import { sendEmail } from '@/lib/email/send'
import type { InquiryPayload } from '@/lib/email/types'
import { sanityClient } from '@/lib/sanity/client'
import { EMAIL_LOGO_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'

const RECEPTION_EMAIL = process.env.RECEPTION_EMAIL || 'recepcja@zajazdsezam.pl'

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 })
  }

  const parsed = sendFormRequestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 422 })
  }

  const { kind, locale, turnstileToken, data } = parsed.data

  const remoteIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined

  const verify = await verifyTurnstileToken(turnstileToken, remoteIp)
  if (!verify.ok) {
    return NextResponse.json({ error: 'turnstile', reason: verify.reason }, { status: 403 })
  }

  // Discriminated union zachowany rzutowaniem przez `kind` — Zod zwalidowal juz
  // odpowiadajacy mu ksztalt `data`.
  const payload = { kind, data } as InquiryPayload

  // Logo do naglowka + NAP do stopki maila. Blad Sanity nie moze zablokowac
  // zgloszenia — szablon ma fallbackowe dane kontaktowe i tekstowy wordmark.
  const [settings, logo] = await Promise.all([
    sanityClient.fetch(SITE_SETTINGS_QUERY).catch((error) => {
      console.error('[send-form] siteSettings fetch failed', error)
      return null
    }),
    sanityClient.fetch(EMAIL_LOGO_QUERY).catch((error) => {
      console.error('[send-form] email logo fetch failed', error)
      return null
    }),
  ])
  const contact = buildBrandContact(settings, logo, locale)

  // Mail do recepcji jest krytyczny — bez niego zgloszenie przepada, wiec blad
  // idzie do uzytkownika. Auto-reply jest best-effort: gdy padnie (np. literowka
  // w adresie goscia), recepcja i tak ma zgloszenie i formularz konczy sie OK.
  try {
    const receptionEmail = await buildReceptionEmail(payload, contact)
    await sendEmail({
      to: RECEPTION_EMAIL,
      subject: receptionEmail.subject,
      html: receptionEmail.html,
      text: receptionEmail.text,
      replyTo: data.email,
      tags: [
        { name: 'type', value: 'reception-inquiry' },
        { name: 'form', value: kind },
      ],
    })
  } catch (error) {
    console.error('[send-form] reception email failed', error)
    return NextResponse.json({ error: 'send-failed' }, { status: 500 })
  }

  try {
    const autoReply = await buildAutoReplyEmail(payload, locale, contact)
    await sendEmail({
      to: data.email,
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
      replyTo: RECEPTION_EMAIL,
      tags: [
        { name: 'type', value: 'guest-auto-reply' },
        { name: 'form', value: kind },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('[send-form] auto-reply failed (zgloszenie doszlo do recepcji)', error)
  }

  return NextResponse.json({ ok: true })
}
