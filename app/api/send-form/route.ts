import { NextResponse } from 'next/server'
import { sendFormRequestSchema } from '@/lib/validators/reservation'
import { verifyTurnstileToken } from '@/lib/turnstile'
import {
  buildAutoReplyEmail,
  buildEventReceptionEmail,
  buildRoomReceptionEmail,
} from '@/lib/email/templates'
import { sendEmail } from '@/lib/email/send'

// Wymagane: NEXT_PUBLIC_SITE_URL nie jest tu czytany; receptionEmail z env.
const RECEPTION_EMAIL = process.env.RECEPTION_EMAIL || 'recepcja@zajazdsezam.pl'
const REPLY_FROM = process.env.REPLY_FROM_EMAIL || 'noreply@zajazdsezam.pl'

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

  const receptionEmail =
    kind === 'room' ? buildRoomReceptionEmail(data) : buildEventReceptionEmail(data)
  const autoReply = buildAutoReplyEmail(data.fullName ?? '', locale)

  try {
    await Promise.all([
      sendEmail({
        to: RECEPTION_EMAIL,
        subject: receptionEmail.subject,
        html: receptionEmail.html,
        text: receptionEmail.text,
        replyTo: data.email,
      }),
      sendEmail({
        to: data.email,
        subject: autoReply.subject,
        html: autoReply.html,
        text: autoReply.text,
        replyTo: REPLY_FROM,
      }),
    ])
  } catch (error) {
    console.error('[send-form] email send failed', error)
    return NextResponse.json({ error: 'send-failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
