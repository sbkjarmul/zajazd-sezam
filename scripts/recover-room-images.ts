/**
 * Odzyskuje pole `images` w dokumentach roomType z poprzedniej rewizji Sanity.
 * Używane po niefortunnym `createOrReplace` z seed-hotel.ts, które wyzerowało
 * zdjęcia.
 *
 * Strategia:
 *   1. Dla każdego pokoju pobierz listę transakcji z API history.
 *   2. Idź wstecz przez rewizje, pobieraj dokument przy każdej.
 *   3. Pierwsza rewizja z niepustym `images[]` — przywróć przez patch.set.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/recover-room-images.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const ROOM_IDS = [
  'roomType-apartment-comfort',
  'roomType-comfort-room',
  'roomType-standard-room',
]

type Transaction = { id: string; timestamp?: string }

async function fetchTransactions(docId: string): Promise<Transaction[]> {
  // NDJSON — każda linia to jedna transakcja
  const ndjson = await client.request<string>({
    url: `/data/history/${dataset}/transactions/${docId}?excludeContent=true`,
    method: 'GET',
  })
  return ndjson
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Transaction)
}

async function fetchDocAtRevision(docId: string, revisionId: string): Promise<unknown> {
  return client.request({
    url: `/data/history/${dataset}/documents/${docId}?revision=${revisionId}`,
    method: 'GET',
  })
}

async function recover(docId: string) {
  console.log(`\n${docId}`)
  let transactions: Transaction[] = []
  try {
    transactions = await fetchTransactions(docId)
  } catch (err) {
    console.warn(`  ⚠ Failed to list transactions: ${(err as Error).message}`)
    return
  }
  console.log(`  Found ${transactions.length} revisions`)

  // Idź wstecz — od ostatniej (najnowszej) do najstarszej
  for (let i = transactions.length - 1; i >= 0; i--) {
    const tx = transactions[i]
    let doc: { images?: unknown[]; documents?: unknown[] } | null = null
    try {
      doc = (await fetchDocAtRevision(docId, tx.id)) as typeof doc
    } catch (err) {
      console.warn(`  Skip rev ${tx.id}: ${(err as Error).message}`)
      continue
    }
    // documents array (multi-doc response) — Sanity sometimes wraps single doc
    const docObj = doc as Record<string, unknown> | null
    const inner =
      docObj && Array.isArray(docObj.documents)
        ? (docObj.documents[0] as { images?: unknown[] } | undefined)
        : (docObj as { images?: unknown[] } | null)

    const images = inner?.images
    if (Array.isArray(images) && images.length > 0) {
      console.log(`  ✓ Found ${images.length} images at revision ${tx.id} (${tx.timestamp})`)
      // Restore
      await client.patch(docId).set({ images }).commit()
      console.log(`  ✓ Restored on current document`)
      return
    }
  }
  console.warn(`  ✗ No revision with images found for ${docId}`)
}

// Dla hotelPage szukamy headerLogo + hero.image (i innych pól ze zdjęciami).
type FieldPath =
  | 'headerLogo'
  | 'hero.image'
  | 'reservationSection.image'
  | 'discoverSection'

const HOTEL_IMAGE_FIELDS: FieldPath[] = [
  'headerLogo',
  'hero.image',
  'reservationSection.image',
  'discoverSection',
]

function getPath(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj)
}

function hasImageContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  // imageWithAlt object — has asset._ref
  const v = value as { asset?: { _ref?: string }; cards?: unknown[] }
  if (v.asset?._ref) return true
  // discoverSection — sprawdź czy cards mają obrazki
  if (Array.isArray(v.cards)) {
    return v.cards.some((c) => {
      const card = c as { image?: { asset?: { _ref?: string } } }
      return Boolean(card.image?.asset?._ref)
    })
  }
  return false
}

async function recoverHotelPage(docId: string) {
  console.log(`\n${docId}`)
  let transactions: Transaction[] = []
  try {
    transactions = await fetchTransactions(docId)
  } catch (err) {
    console.warn(`  ⚠ Failed to list transactions: ${(err as Error).message}`)
    return
  }
  console.log(`  Found ${transactions.length} revisions`)

  // Dla każdego pola znajdź NAJNOWSZĄ rewizję z niepustą wartością.
  const recovered: Record<string, unknown> = {}
  const remainingFields = new Set(HOTEL_IMAGE_FIELDS)

  // Pobierz current — pomiń pola, które już są (np. po częściowym przywróceniu).
  const current = await client.getDocument(docId)
  for (const field of HOTEL_IMAGE_FIELDS) {
    const value = getPath(current, field)
    if (hasImageContent(value)) {
      console.log(`  ✓ ${field} już ustawiony — pomijam`)
      remainingFields.delete(field)
    }
  }

  for (let i = transactions.length - 1; i >= 0 && remainingFields.size > 0; i--) {
    const tx = transactions[i]
    let doc: Record<string, unknown> | null = null
    try {
      doc = (await fetchDocAtRevision(docId, tx.id)) as Record<string, unknown> | null
    } catch (err) {
      console.warn(`  Skip rev ${tx.id}: ${(err as Error).message}`)
      continue
    }
    const inner: unknown =
      doc && Array.isArray(doc.documents) ? (doc.documents[0] as unknown) : doc

    for (const field of Array.from(remainingFields)) {
      const value = getPath(inner, field)
      if (hasImageContent(value)) {
        console.log(`  ✓ ${field} odnaleziony w rewizji ${tx.id} (${tx.timestamp})`)
        recovered[field] = value
        remainingFields.delete(field)
      }
    }
  }

  if (Object.keys(recovered).length === 0) {
    console.warn(`  ✗ Nic do przywrócenia`)
    return
  }

  // Buduj patch — Sanity API wymaga formy { 'hero.image': value } albo zagnieżdżonej.
  // Dot-path działa w patch.set().
  await client.patch(docId).set(recovered).commit()
  console.log(`  ✓ Restored ${Object.keys(recovered).length} field(s) on ${docId}`)
}

async function main() {
  console.log(`Recovering images from history (dataset: ${dataset})…`)
  for (const id of ROOM_IDS) {
    await recover(id)
  }
  await recoverHotelPage('hotelPage')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
