import { NextResponse, type NextRequest } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { GALLERY_IMAGES_QUERY } from '@/lib/sanity/queries'

// Maksymalny rozmiar partii na zadanie — bezpiecznik przed nadmiernym sliceem.
const MAX_BATCH = 60

// Paginacja zdjec galerii dla infinite scroll. Zwraca slice images[$start...$end]
// (koniec wylaczny). Publiczne dane (URL-e CDN i tak sa publiczne), read-only.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const start = Math.max(0, Math.floor(Number(sp.get('start')) || 0))
  const requestedEnd = Math.floor(Number(sp.get('end')) || start)
  const end = Math.min(Math.max(requestedEnd, start), start + MAX_BATCH)

  const images = await sanityClient.fetch(GALLERY_IMAGES_QUERY, { start, end })

  return NextResponse.json({ images: images ?? [] })
}
