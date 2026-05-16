// Webhook Sanity → revalidacja ISR.
// Konfiguracja: Sanity Manage → API → Webhooks → URL = /api/revalidate,
// Secret = SANITY_WEBHOOK_SECRET (.env.local).
//
// Sanity wysyła payload z `_type`, `_id`, akcji. My revalidujemy odpowiednie
// ścieżki dla obu locales w zależności od typu zmodyfikowanego dokumentu.

import { revalidatePath } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import type { Pathname } from '@/i18n/routing'

// Mapowanie _type dokumentu Sanity → ścieżki do rewalidacji.
const TYPE_TO_PATHS: Record<string, Pathname[]> = {
  siteSettings: [
    '/',
    '/restauracja',
    '/restauracja/menu',
    '/bistro',
    '/hotel',
    '/imprezy-okolicznosciowe',
    '/kontakt',
  ],
  homepage: ['/'],
  restaurantPage: ['/restauracja'],
  menuPage: ['/restauracja/menu'],
  bistroPage: ['/bistro'],
  hotelPage: ['/hotel'],
  eventsPage: ['/imprezy-okolicznosciowe'],
  contactPage: ['/kontakt'],
  menuItem: ['/restauracja/menu'],
  menuCategory: ['/restauracja/menu'],
  eventHall: ['/imprezy-okolicznosciowe', '/'],
  eventType: ['/imprezy-okolicznosciowe'],
  roomType: ['/hotel'],
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'missing-server-secret' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ error: 'invalid-signature' }, { status: 401 })
  }

  let payload: { _type?: string; _id?: string } = {}
  try {
    payload = JSON.parse(body) as { _type?: string; _id?: string }
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 })
  }

  const type = payload._type
  if (!type) {
    return NextResponse.json({ error: 'missing-type' }, { status: 400 })
  }

  const internalPaths = TYPE_TO_PATHS[type] ?? []
  const revalidated: string[] = []

  for (const internalPath of internalPaths) {
    for (const locale of routing.locales) {
      const localized = getPathname({ href: { pathname: internalPath }, locale })
      revalidatePath(localized)
      revalidated.push(localized)
    }
  }

  return NextResponse.json({ ok: true, type, revalidated })
}
