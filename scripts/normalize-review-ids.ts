/**
 * Porzadkuje ID dokumentow `review` — nadaje im deterministyczny hash.
 *
 * Skad rozjazd: pierwsze opinie wjechaly seedem ze stalymi, "mowiacymi" ID
 * (`review-agnieszka-w`), a potem redakcja przepisala ich tresc w Studio.
 * Nazwa w ID zostala stara — `review-agnieszka-w` trzymal opinie "Bart KRK".
 *
 * Dlatego ID przestaje cokolwiek znaczyc: bierzemy skrot SHA-256 z naturalnego
 * klucza opinii (autor + data wystawienia) i tniemy do 12 znakow hex. Zadnej
 * transliteracji polskich znakow, zadnego rozjazdu przy zmianie tresci, a
 * skrypt zostaje idempotentny — ten sam autor i ta sama data daja zawsze ten
 * sam identyfikator, wiec ponowne uruchomienie nie ma co robic.
 *
 * Dlaczego jedna transakcja: docelowe ID moze byc chwilowo zajete przez
 * dokument, ktory sam czeka na zmiane nazwy. Kasujemy wiec komplet, dopiero
 * potem tworzymy — mutacje w transakcji Sanity ida po kolei, a calosc jest
 * atomowa.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/normalize-review-ids.ts
 */

import { createHash } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

// 12 znakow hex = 48 bitow. Przy skali "kilkadziesiat opinii" szansa kolizji
// jest pomijalna, a ID zostaje krotkie i czytelne w logach.
const ID_LENGTH = 12

function reviewId(authorName: string, publishedAt: string): string {
  const digest = createHash('sha256').update(`${authorName}|${publishedAt}`).digest('hex')
  return `review-${digest.slice(0, ID_LENGTH)}`
}

type ReviewDoc = {
  _id: string
  _type: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  authorName?: string
  publishedAt?: string
  [key: string]: unknown
}

async function main() {
  const docs = await client.fetch<ReviewDoc[]>('*[_type == "review"] | order(order asc)')

  const drafts = docs.filter((d) => d._id.startsWith('drafts.'))
  if (drafts.length > 0) {
    throw new Error(
      `Sa niezopublikowane wersje robocze (${drafts.length}). Opublikuj je albo odrzuc — ` +
        'inaczej rename zostawi osierocone drafty.',
    )
  }

  const taken = new Set<string>()
  const renames: Array<{ from: string; to: string; doc: ReviewDoc }> = []

  for (const doc of docs) {
    if (!doc.authorName || !doc.publishedAt) {
      console.warn(`  pomijam ${doc._id} — brak autora albo daty, nie ma z czego liczyc hasha`)
      continue
    }

    // Dwie opinie tego samego autora z tego samego dnia daja ten sam skrot —
    // sufiks trzyma je rozdzielne zamiast pozwolic drugiej nadpisac pierwsza.
    const base = reviewId(doc.authorName, doc.publishedAt)
    let target = base
    let suffix = 2
    while (taken.has(target)) target = `${base}-${suffix++}`
    taken.add(target)

    if (target !== doc._id) renames.push({ from: doc._id, to: target, doc })
  }

  if (renames.length === 0) {
    console.log('Wszystkie ID sa juz poprawne — nic do zrobienia.')
    return
  }

  const tx = client.transaction()
  for (const { from } of renames) tx.delete(from)
  for (const { to, doc } of renames) {
    const { _id, _rev, _createdAt, _updatedAt, ...fields } = doc
    void _id
    void _rev
    void _createdAt
    void _updatedAt
    tx.create({ ...fields, _id: to, _type: doc._type })
  }

  await tx.commit()

  for (const { from, to, doc } of renames) {
    console.log(`  ${from}  ->  ${to}   (${doc.authorName})`)
  }
  console.log(`Zmieniono ID: ${renames.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
