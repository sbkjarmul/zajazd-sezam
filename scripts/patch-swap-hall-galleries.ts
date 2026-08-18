/**
 * One-off patch: zamiana galerii miedzy salami "Sala wydzielona" a "Sala Szafirowa"
 * — zdjecia byly wgrane odwrotnie (kadry z szafirowej lezaly pod wydzielona i odwrotnie).
 *
 * Szczegoly:
 *  - alt (opis SALI, nie konkretnego kadru) zostaje przy swojej sali: opis
 *    "Wydzielona sala restauracyjna..." przypinamy do pierwszego zdjecia
 *    wydzielonej po zamianie.
 *  - pierwszy element galerii szafirowej w wersji opublikowanej mial zawieszony
 *    stub `_upload` bez `asset` (upload dokonczyl sie tylko w draftcie) —
 *    bierzemy czyste referencje z draftu.
 *  - patchujemy takze `drafts.eventHall-sala-szafirowa`, zeby otwarty draft nie
 *    cofnal zmiany przy publikacji.
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-swap-hall-galleries.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const WYDZIELONA = 'eventHall-sala-wydzielona'
const SZAFIROWA = 'eventHall-sala-szafirowa'
const SZAFIROWA_DRAFT = `drafts.${SZAFIROWA}`

type LocaleString = { _type: 'localeString'; pl?: string; en?: string }
type GalleryImage = {
  _key: string
  _type: 'imageWithAlt'
  alt?: LocaleString
  asset?: { _ref: string; _type: 'reference' }
}

async function main() {
  const [wydzielona, szafirowa, szafirowaDraft] = await Promise.all([
    client.getDocument<{ images?: GalleryImage[] }>(WYDZIELONA),
    client.getDocument<{ images?: GalleryImage[] }>(SZAFIROWA),
    client.getDocument<{ images?: GalleryImage[] }>(SZAFIROWA_DRAFT),
  ])

  if (!wydzielona) throw new Error(`Brak dokumentu ${WYDZIELONA}`)
  if (!szafirowa) throw new Error(`Brak dokumentu ${SZAFIROWA}`)

  // Draft szafirowej ma komplet referencji (published gubi pierwsza przez `_upload`).
  const szafirowaSource = (szafirowaDraft?.images ?? szafirowa.images ?? []).filter((i) => i.asset)
  const wydzielonaSource = (wydzielona.images ?? []).filter((i) => i.asset)

  if (!szafirowaSource.length || !wydzielonaSource.length) {
    throw new Error('Ktoras z galerii jest pusta — przerywam, zeby nie skasowac zdjec')
  }

  // Alt opisuje sale, nie kadr — zostaje przy swojej sali.
  const wydzielonaAlt = wydzielona.images?.find((i) => i.alt)?.alt

  const toWydzielona: GalleryImage[] = szafirowaSource.map((img, i) => ({
    _key: img._key,
    _type: 'imageWithAlt',
    asset: img.asset,
    ...(i === 0 && wydzielonaAlt ? { alt: wydzielonaAlt } : {}),
  }))

  const toSzafirowa: GalleryImage[] = wydzielonaSource.map((img) => ({
    _key: img._key,
    _type: 'imageWithAlt',
    asset: img.asset,
  }))

  console.log(
    `Sala wydzielona: ${wydzielonaSource.length} -> ${toWydzielona.length} zdjec\n` +
      `Sala Szafirowa:  ${szafirowaSource.length} -> ${toSzafirowa.length} zdjec`,
  )

  const tx = client
    .transaction()
    .patch(WYDZIELONA, (p) => p.set({ images: toWydzielona }))
    .patch(SZAFIROWA, (p) => p.set({ images: toSzafirowa }))

  if (szafirowaDraft) tx.patch(SZAFIROWA_DRAFT, (p) => p.set({ images: toSzafirowa }))

  await tx.commit()
  console.log('✓ Zamienione (published' + (szafirowaDraft ? ' + draft szafirowej)' : ')'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
